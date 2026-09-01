import { describe, expect, it } from 'vitest';
import { WorkflowDefinition } from '../interfaces/WorkflowGraph';
import { WorkflowSerializer } from './WorkflowSerializer';
import {
    NODE_HEIGHT,
    NODE_WIDTH,
    TOOL_ROW_GAP,
    TOOL_ROW_HEIGHT,
    WELL_PADDING,
} from './NodeHtml';
import { LAYER_GAP, SIBLING_GAP, WorkflowLayout } from './WorkflowLayout';

/** gather (2 tools) → summarise ‖ critique → report. */
function fanOutDefinition(): WorkflowDefinition {
    return WorkflowSerializer.expand({
        name: 'Research',
        nodes: {
            gather: {
                id: 'gather', type: 'task', depends_on: [],
                tools: [{ name: 'web_search' }, { name: 'fetch_page' }],
            },
            summarise: { id: 'summarise', type: 'task', depends_on: ['gather'] },
            critique: { id: 'critique', type: 'task', depends_on: ['gather'] },
            report: { id: 'report', type: 'task', depends_on: ['summarise', 'critique'] },
        },
    });
}

/** Positions keyed by node id, for readable assertions. */
function positionMap(positions: Array<{ id: string; x: number; y: number }>) {
    const map: Record<string, { x: number; y: number }> = {};
    positions.forEach((position) => { map[position.id] = { x: position.x, y: position.y }; });
    return map;
}

describe('WorkflowLayout box sizing', () => {

    it('grows a box to hold the tools inside it', () => {
        const definition = fanOutDefinition();
        const gather = definition.nodes.gather;

        expect(WorkflowLayout.boxHeight(definition, gather)).toBe(
            NODE_HEIGHT + WELL_PADDING * 2 + 2 * TOOL_ROW_HEIGHT + TOOL_ROW_GAP);
        // A node with no tools stays a plain card.
        expect(WorkflowLayout.boxHeight(definition, definition.nodes.summarise)).toBe(NODE_HEIGHT);
    });

    it('lays out only top-level nodes — tools have no position of their own', () => {
        const definition = fanOutDefinition();
        const { positions } = WorkflowLayout.compute(definition);
        const toolIds = WorkflowSerializer.toolsOf(definition, 'gather').map((tool) => tool.id);

        expect(positions.map((position) => position.id).sort())
            .toEqual(['critique', 'gather', 'report', 'summarise']);
        toolIds.forEach((id) => {
            expect(positions.some((position) => position.id === id)).toBe(false);
        });
    });
});

describe('WorkflowLayout vertical layout', () => {

    it('lays dependent nodes out down the canvas by default', () => {
        const definition = fanOutDefinition();
        const { positions } = WorkflowLayout.compute(definition);
        const at = positionMap(positions);

        // Each layer is strictly below the one it depends on.
        expect(at.summarise.y).toBeGreaterThan(at.gather.y);
        expect(at.critique.y).toBeGreaterThan(at.gather.y);
        expect(at.report.y).toBeGreaterThan(at.summarise.y);
        // Independent siblings share a layer and sit side by side.
        expect(at.summarise.y).toBe(at.critique.y);
        expect(at.critique.x - at.summarise.x).toBe(NODE_WIDTH + SIBLING_GAP);
    });

    it('clears the next layer of the whole box, tools included', () => {
        const definition = fanOutDefinition();
        const { positions } = WorkflowLayout.compute(definition);
        const at = positionMap(positions);

        const boxBottom = at.gather.y + WorkflowLayout.boxHeight(definition, definition.nodes.gather);
        expect(at.summarise.y).toBe(boxBottom + LAYER_GAP);
    });

    it('reads left-to-right when asked for a horizontal flow', () => {
        const definition = fanOutDefinition();
        const { positions } = WorkflowLayout.compute(definition, 'horizontal');
        const at = positionMap(positions);

        expect(at.summarise.x).toBeGreaterThan(at.gather.x);
        expect(at.report.x).toBeGreaterThan(at.summarise.x);
        expect(at.summarise.x).toBe(at.critique.x);
        expect(at.critique.y).toBeGreaterThan(at.summarise.y);
    });

    it('terminates on a cyclic definition', () => {
        const definition: WorkflowDefinition = {
            name: 'Cycle',
            nodes: {
                a: { id: 'a', type: 'task', depends_on: ['b'] },
                b: { id: 'b', type: 'task', depends_on: ['a'] },
            },
        };
        expect(WorkflowLayout.compute(definition).positions).toHaveLength(2);
    });

    it('reports that a definition without positions needs laying out', () => {
        expect(WorkflowLayout.needsLayout(fanOutDefinition())).toBe(true);
        const laidOut = WorkflowLayout.applyPositions(
            fanOutDefinition(), WorkflowLayout.compute(fanOutDefinition()).positions);
        // Tools carry no position, and must not make the check ask for another pass.
        expect(WorkflowLayout.needsLayout(laidOut)).toBe(false);
    });
});
