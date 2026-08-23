import React from "react";

import "./FloatingRouteMarker.css";
import "../MapMarkerTokens.css";

import {
	FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS,
	FLOATING_ROUTE_MARKER_POINTER_OFFSET,
	FLOATING_ROUTE_MARKER_POINTER_SIZES,
	FLOATING_ROUTE_MARKER_POINTERS,
	PINHEAD_DIMENSIONS,
	PINHEAD_SIZES_SHAPES
} from "../constants";
import {FloatingRouteMarkerAnchorPosition, FloatingRouteMarkerProps} from "../types";
import {classNames, hasContent, renderEnhancer} from "../utils/MapMarkerUtils";

/**
 * The transform that places a route marker relative to the point it annotates,
 * leaving room for the pointer. `offset` adds clearance on top of that, for
 * stacking several markers off the same point.
 */
export const calculateFloatingRouteMarkerOffsets = (
	anchorPosition: FloatingRouteMarkerAnchorPosition,
	offset: number = 0): string => {

	const clearance = FLOATING_ROUTE_MARKER_POINTER_OFFSET + offset;
	const forward = clearance + "px";
	const back = "calc(-100% - " + clearance + "px)";

	switch (anchorPosition) {
		case FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.topLeft:
			return "translate(" + forward + ", " + forward + ")";
		case FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.topRight:
			return "translate(" + back + ", " + forward + ")";
		case FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.bottomLeft:
			return "translate(" + forward + ", " + back + ")";
		case FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.bottomRight:
			return "translate(" + back + ", " + back + ")";
		case FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.topCenter:
			return "translate(-50%, " + forward + ")";
		case FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.bottomCenter:
			return "translate(-50%, " + back + ")";
		case FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.leftCenter:
			return "translate(" + forward + ", -50%)";
		default:
			return "translate(" + back + ", -50%)";
	}
}

/**
 * A callout that annotates a leg of a route — an ETA, a fare, a stop name —
 * with a pointer aimed back at the point it belongs to.
 */
export const FloatingRouteMarker: React.FC<FloatingRouteMarkerProps> = (props) => {

	const {
		label,
		secondaryLabel,
		startEnhancer,
		endEnhancer,
		anchorPosition = FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS.topLeft,
		selected = false,
		className
	} = props;

	const {icon} = PINHEAD_DIMENSIONS[PINHEAD_SIZES_SHAPES.medium];
	const activeSlots = [label, startEnhancer, endEnhancer].filter((slot) => hasContent(slot));

	const pointer = FLOATING_ROUTE_MARKER_POINTERS[anchorPosition];
	const pointerSize = FLOATING_ROUTE_MARKER_POINTER_SIZES[pointer.type];

	const enhancerSlot = (enhancer: FloatingRouteMarkerProps["startEnhancer"]) => (
		<div className="foundations-map-marker-enhancer-slot" style={{fontSize: icon + "px", color: "inherit"}}>
			{renderEnhancer(enhancer, icon)}
		</div>
	);

	return (
		<div
			className={classNames("foundations-floating-route-map-marker",
				selected && "foundations-floating-route-map-marker-selected", className)}
			style={{gridTemplateColumns: activeSlots.map(() => "auto").join(" ")}}
			data-foundations="floating-route-map-marker">
			{hasContent(startEnhancer) && enhancerSlot(startEnhancer)}
			{hasContent(label) &&
				<div className="foundations-floating-route-map-marker-labels">
					<div className="foundations-map-marker-label-medium">{label}</div>
					{hasContent(secondaryLabel) &&
						<div className={classNames("foundations-map-marker-label-small",
							"foundations-floating-route-map-marker-secondary-label")}>{secondaryLabel}</div>}
				</div>}
			{hasContent(endEnhancer) && enhancerSlot(endEnhancer)}
			<svg
				className={classNames("foundations-floating-route-map-marker-pointer",
					"foundations-floating-route-map-marker-pointer-" + anchorPosition)}
				xmlns="http://www.w3.org/2000/svg"
				width={pointerSize.width}
				height={pointerSize.height}
				viewBox={pointerSize.viewBox}>
				<path d={pointer.path} />
			</svg>
		</div>
	)
}
