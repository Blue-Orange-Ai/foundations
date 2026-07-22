import React from 'react';
import { GanttLinkType, IGanttLink } from '../../interfaces/GanttInterfaces';
import { IBarGeometry, linkEndpoints } from '../../utils/ganttUtils';
import './GanttLinks.css';

interface Props {
    links: IGanttLink[];
    /** Positioned bar geometry keyed by task id, for the currently visible rows. */
    geometryById: Map<string | number, IBarGeometry>;
    width: number;
    height: number;
    onLinkClick?: (id: string | number) => void;
    /** A link currently being drawn, rendered as a dashed rubber-band line. */
    draft?: { x1: number; y1: number; x2: number; y2: number } | null;
}

const ARROW = 6;
const STUB = 12;

/**
 * The SVG overlay that draws dependency arrows between task bars. Each link is
 * routed as an orthogonal elbow connector ending in an arrowhead, following the
 * precedence relationship encoded by its {@link GanttLinkType}.
 */
export const GanttLinks: React.FC<Props> = ({
    links,
    geometryById,
    width,
    height,
    onLinkClick,
    draft,
}) => {
    return (
        <svg
            className="blue-orange-gantt-links"
            width={width}
            height={height}
            style={{ width, height }}
        >
            {links.map((link) => {
                const source = geometryById.get(link.source);
                const target = geometryById.get(link.target);
                if (!source || !target) return null;
                const { path, arrow } = buildLinkPath(source, target, link.type);
                return (
                    <g
                        key={link.id}
                        className={
                            'blue-orange-gantt-link' +
                            (onLinkClick ? ' blue-orange-gantt-link-clickable' : '')
                        }
                        onClick={onLinkClick ? () => onLinkClick(link.id) : undefined}
                    >
                        {/* Wide invisible hit area for easy clicking. */}
                        <path className="blue-orange-gantt-link-hit" d={path} />
                        <path className="blue-orange-gantt-link-line" d={path} />
                        <polygon className="blue-orange-gantt-link-arrow" points={arrow} />
                    </g>
                );
            })}

            {draft && (
                <line
                    className="blue-orange-gantt-link-draft"
                    x1={draft.x1}
                    y1={draft.y1}
                    x2={draft.x2}
                    y2={draft.y2}
                />
            )}
        </svg>
    );
};

/** Builds an orthogonal elbow path plus an arrowhead polygon for a link. */
function buildLinkPath(
    source: IBarGeometry,
    target: IBarGeometry,
    type: GanttLinkType | undefined
): { path: string; arrow: string } {
    const { from, to } = linkEndpoints(type);

    const sy = source.y + source.height / 2;
    const ty = target.y + target.height / 2;
    const sx = from === 'end' ? source.x + source.width : source.x;
    const tx = to === 'start' ? target.x : target.x + target.width;

    // Direction the arrow enters the target: into a start endpoint we approach
    // from the left (pointing right); into an end endpoint from the right.
    const enterFromLeft = to === 'start';
    const approachX = enterFromLeft ? tx - STUB : tx + STUB;
    // Direction leaving the source.
    const leaveDir = from === 'end' ? 1 : -1;
    const departX = sx + leaveDir * STUB;

    const points: [number, number][] = [[sx, sy], [departX, sy]];
    // Route vertically at a midpoint between the departure and approach stubs.
    const midX =
        enterFromLeft && approachX > departX
            ? (departX + approachX) / 2
            : Math.max(departX, approachX) + STUB;

    if (enterFromLeft && approachX >= departX) {
        // Simple forward case: step across then down/up into the target.
        const stepX = (departX + approachX) / 2;
        points.push([stepX, sy], [stepX, ty], [approachX, ty], [tx, ty]);
    } else {
        // Target is behind the source (or an end-endpoint): route around.
        points.push([midX, sy], [midX, ty], [approachX, ty], [tx, ty]);
    }

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

    // Arrowhead pointing into the target endpoint.
    const dir = enterFromLeft ? 1 : -1;
    const arrow = [
        [tx, ty],
        [tx - dir * ARROW, ty - ARROW / 1.4],
        [tx - dir * ARROW, ty + ARROW / 1.4],
    ]
        .map((p) => `${p[0]},${p[1]}`)
        .join(' ');

    return { path, arrow };
}
