import React from "react";

import "./DragShadow.css";
import "../MapMarkerTokens.css";

import {DRAG_SHADOW_HEIGHT, DRAG_SHADOW_MARGIN_TOP, DRAG_SHADOW_WIDTH} from "../constants";
import {DragShadowProps} from "../types";
import {classNames, kindClassName, kindColourStyle} from "../utils/MapMarkerUtils";

/**
 * The ellipse a fixed marker casts while it is being dragged. It occupies its
 * space whether or not the marker is dragging, so the pin head can translate
 * over it without the marker changing height.
 */
export const DragShadow: React.FC<DragShadowProps> = (props) => {

	const {
		dragging = false,
		height = DRAG_SHADOW_MARGIN_TOP + DRAG_SHADOW_HEIGHT,
		kind,
		background,
		className
	} = props;

	return (
		<div
			className={classNames(
				"foundations-map-marker-drag-shadow-container",
				dragging && "foundations-map-marker-drag-shadow-container-dragging",
				kind && kindClassName(kind), className)}
			style={{
				width: DRAG_SHADOW_WIDTH + "px",
				height: height + "px",
				...kindColourStyle(undefined, background)
			}}>
			<div
				className="foundations-map-marker-drag-shadow"
				style={{width: DRAG_SHADOW_WIDTH + "px"}} />
		</div>
	)
}
