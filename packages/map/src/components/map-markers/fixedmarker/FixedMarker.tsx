import React from "react";

import "./FixedMarker.css";
import "../MapMarkerTokens.css";

import {
	DRAG_SHADOW_HEIGHT,
	DRAG_SHADOW_MARGIN_TOP,
	MAP_MARKER_KINDS,
	NEEDLE_SIZES,
	PINHEAD_SIZES_SHAPES,
	PINHEAD_TYPES
} from "../constants";
import {FixedMarkerProps, PinHeadSize} from "../types";
import {classNames, kindClassName, kindColourStyle} from "../utils/MapMarkerUtils";
import {PinHead} from "../pinhead/PinHead";
import {Needle} from "../needle/Needle";
import {DragShadow} from "../dragshadow/DragShadow";

const NEEDLELESS_SIZES: Array<PinHeadSize> = [
	PINHEAD_SIZES_SHAPES.xxSmallCircle,
	PINHEAD_SIZES_SHAPES.xxSmallSquare
];

/**
 * A marker pinned to a point on the map: a pin head on a needle whose tip is
 * the point being marked. Anchor it with the `bottom-center` anchor mode.
 */
export const FixedMarker: React.FC<FixedMarkerProps> = (props) => {

	const {
		size = PINHEAD_SIZES_SHAPES.medium,
		needle = NEEDLE_SIZES.medium,
		label,
		secondaryLabel,
		startEnhancer,
		endEnhancer,
		kind = MAP_MARKER_KINDS.default,
		color,
		background,
		dragging = false,
		labelEnhancerContent,
		labelEnhancerPosition,
		badgeEnhancerSize,
		badgeEnhancerContent,
		className
	} = props;

	// The dot sizes are the whole marker, so they get neither needle nor shadow.
	const needleless = NEEDLELESS_SIZES.indexOf(size) >= 0;
	const renderNeedle = needle !== NEEDLE_SIZES.none && !needleless;
	const liftsOnDrag = needle !== NEEDLE_SIZES.none && !needleless;

	if (needle !== NEEDLE_SIZES.none && needleless) {
		console.warn("Needles cannot be rendered on " + PINHEAD_SIZES_SHAPES.xxSmallCircle
			+ " or " + PINHEAD_SIZES_SHAPES.xxSmallSquare + " pin heads");
	}

	const dragShadowHeight = DRAG_SHADOW_MARGIN_TOP + DRAG_SHADOW_HEIGHT;

	return (
		<div
			className={classNames("foundations-fixed-map-marker", kindClassName(kind), className)}
			style={kindColourStyle(color, background)}
			data-foundations="fixed-map-marker">
			<div
				className="foundations-fixed-map-marker-drag-container"
				style={{transform: "translateY(" + (liftsOnDrag && !dragging ? dragShadowHeight : 0) + "px)"}}>
				<PinHead
					size={size}
					label={label}
					secondaryLabel={secondaryLabel}
					startEnhancer={startEnhancer}
					endEnhancer={endEnhancer}
					type={PINHEAD_TYPES.fixed}
					needle={needle}
					labelEnhancerContent={labelEnhancerContent}
					labelEnhancerPosition={labelEnhancerPosition}
					badgeEnhancerSize={badgeEnhancerSize}
					badgeEnhancerContent={badgeEnhancerContent} />
				{renderNeedle && <Needle size={needle} />}
			</div>
			{liftsOnDrag && <DragShadow dragging={dragging} height={dragShadowHeight} />}
		</div>
	)
}
