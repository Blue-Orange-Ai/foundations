import React from "react";

import "./FloatingMarker.css";
import "../MapMarkerTokens.css";

import {
	FLOATING_MARKER_ANCHOR_POSITIONS,
	FLOATING_MARKER_ANCHOR_TYPES,
	MAP_MARKER_KINDS,
	PINHEAD_DIMENSIONS,
	PINHEAD_SIZES_SHAPES,
	PINHEAD_TYPES
} from "../constants";
import {FloatingMarkerAnchorPosition, FloatingMarkerAnchorType, FloatingMarkerProps, PinHeadSize} from "../types";
import {classNames, kindClassName} from "../utils/MapMarkerUtils";
import {PinHead} from "../pinhead/PinHead";

const anchorPinHeadSize = (anchorType: FloatingMarkerAnchorType): PinHeadSize => {
	if (anchorType === FLOATING_MARKER_ANCHOR_TYPES.circle) {
		return PINHEAD_SIZES_SHAPES.xSmallCircle;
	}
	if (anchorType === FLOATING_MARKER_ANCHOR_TYPES.square) {
		return PINHEAD_SIZES_SHAPES.xSmallSquare;
	}
	if (anchorType === FLOATING_MARKER_ANCHOR_TYPES.xxSmallSquare) {
		return PINHEAD_SIZES_SHAPES.xxSmallSquare;
	}
	return PINHEAD_SIZES_SHAPES.xxSmallCircle;
}

/**
 * Which corner of the head meets the anchor dot. `top-left` means the head sits
 * down and to the right of the point, so its top left corner is the anchor.
 */
const anchorTransform = (anchor: FloatingMarkerAnchorPosition, anchorSize: number): string => {
	switch (anchor) {
		case FLOATING_MARKER_ANCHOR_POSITIONS.topLeft:
			return "translate(" + anchorSize + "px, " + anchorSize + "px)";
		case FLOATING_MARKER_ANCHOR_POSITIONS.topRight:
			return "translate(-100%, " + anchorSize + "px)";
		case FLOATING_MARKER_ANCHOR_POSITIONS.bottomLeft:
			return "translate(" + anchorSize + "px, -100%)";
		case FLOATING_MARKER_ANCHOR_POSITIONS.bottomRight:
			return "translate(-100%, -100%)";
		default:
			return "";
	}
}

/**
 * A marker that labels a point without covering it: a small anchor dot on the
 * point itself and a card floating beside it. Anchor it with the `center`
 * anchor mode.
 */
export const FloatingMarker: React.FC<FloatingMarkerProps> = (props) => {

	const {
		label,
		secondaryLabel,
		size = PINHEAD_SIZES_SHAPES.medium,
		anchor = FLOATING_MARKER_ANCHOR_POSITIONS.bottomLeft,
		anchorType = FLOATING_MARKER_ANCHOR_TYPES.circle,
		startEnhancer,
		endEnhancer,
		kind = MAP_MARKER_KINDS.default,
		className
	} = props;

	const dotSize = anchorPinHeadSize(anchorType);
	const dotDimension = PINHEAD_DIMENSIONS[dotSize].height;

	return (
		<div
			className={classNames("foundations-floating-map-marker", className)}
			style={{height: dotDimension + "px", width: dotDimension + "px"}}
			data-foundations="floating-map-marker">
			<div
				className="foundations-floating-map-marker-head-container"
				style={{transform: anchorTransform(anchor, dotDimension)}}>
				{/* The card is the surface colour so the anchor dot, which uses the
				    marker kind, stays the thing that reads as the point. */}
				<PinHead
					size={size}
					label={label}
					secondaryLabel={secondaryLabel}
					startEnhancer={startEnhancer}
					endEnhancer={endEnhancer}
					kind={MAP_MARKER_KINDS.surface}
					type={PINHEAD_TYPES.floating} />
			</div>
			{anchor !== FLOATING_MARKER_ANCHOR_POSITIONS.none &&
				<div className={classNames("foundations-floating-map-marker-anchor-container", kindClassName(kind))}>
					<PinHead size={dotSize} type={PINHEAD_TYPES.fixed} />
				</div>}
		</div>
	)
}
