import React from "react";
import {renderToStaticMarkup} from "react-dom/server";

import "./MapMarkerAnchor.css";

import {BlueOrangeMapGeoPoint, BlueOrangeMapMarker, BlueOrangeMapPopUp} from "@blue-orange-ai/primitives-map";

import {MAP_MARKER_ANCHOR_MODES} from "../constants";
import {MapMarkerAnchorMode} from "../types";

/**
 * Leaflet gives the icon element a 2px transparent border by way of the
 * primitives' default marker class, so the anchor is nudged by that much to put
 * the content box origin exactly on the point.
 */
const ICON_BORDER_INSET = 2;

/** The zero sized icon every marker rendered through here uses. */
export const MAP_MARKER_ICON_SIZE: Array<number> = [0, 0];
export const MAP_MARKER_ICON_ANCHOR: Array<number> = [ICON_BORDER_INSET, ICON_BORDER_INSET];

/**
 * Which part of the marker sits on the point, and how far it is pushed away
 * from it. `bottom-center` puts the tip of a fixed marker's needle on the
 * point, `center` centres a floating marker or a location puck over it, and the
 * corner and edge modes place the named corner of the marker on the point —
 * which is what a route marker's pointer position means.
 */
export const mapMarkerAnchorTransform = (
	mode: MapMarkerAnchorMode = MAP_MARKER_ANCHOR_MODES.bottomCenter,
	offset: number = 0): string => {

	const forward = offset === 0 ? "0px" : offset + "px";
	const back = offset === 0 ? "-100%" : "calc(-100% - " + offset + "px)";
	const centre = "-50%";

	switch (mode) {
		case MAP_MARKER_ANCHOR_MODES.center:
			return "translate(" + centre + ", " + centre + ")";
		case MAP_MARKER_ANCHOR_MODES.bottomCenter:
			return "translate(" + centre + ", " + back + ")";
		case MAP_MARKER_ANCHOR_MODES.topCenter:
			return "translate(" + centre + ", " + forward + ")";
		case MAP_MARKER_ANCHOR_MODES.topLeft:
			return "translate(" + forward + ", " + forward + ")";
		case MAP_MARKER_ANCHOR_MODES.topRight:
			return "translate(" + back + ", " + forward + ")";
		case MAP_MARKER_ANCHOR_MODES.bottomLeft:
			return "translate(" + forward + ", " + back + ")";
		case MAP_MARKER_ANCHOR_MODES.bottomRight:
			return "translate(" + back + ", " + back + ")";
		case MAP_MARKER_ANCHOR_MODES.leftCenter:
			return "translate(" + forward + ", " + centre + ")";
		default:
			return "translate(" + back + ", " + centre + ")";
	}
}

export interface MapMarkerHtmlOptions {
	/** Which part of the marker lands on the point. Defaults to `bottom-center`. */
	anchorMode?: MapMarkerAnchorMode,
	/** Extra clearance between the marker and the point, in pixels. */
	offset?: number,
	/** Added to the anchor wrapper, for styling a whole class of markers. */
	className?: string
}

/**
 * Renders a marker component to the HTML string the map expects.
 *
 * The markup is static: React event handlers do not survive the trip, so use
 * the map's own marker events (or a popup) for interaction.
 */
export const renderMapMarkerHtml = (
	element: React.ReactElement,
	options: MapMarkerHtmlOptions = {}): string => {

	const {anchorMode = MAP_MARKER_ANCHOR_MODES.bottomCenter, offset = 0, className} = options;

	return renderToStaticMarkup(
		<div className={"foundations-map-marker-anchor" + (className ? " " + className : "")}>
			<div
				className="foundations-map-marker-anchor-content"
				style={{transform: mapMarkerAnchorTransform(anchorMode, offset)}}>
				{element}
			</div>
		</div>
	);
}

/**
 * The `html`, `size` and `anchor` a marker component needs, ready to be spread
 * into a marker or a track's marker.
 */
export const mapMarkerIcon = (
	element: React.ReactElement,
	options: MapMarkerHtmlOptions = {}): Pick<BlueOrangeMapMarker, "html" | "size" | "anchor"> => ({
	html: renderMapMarkerHtml(element, options),
	size: MAP_MARKER_ICON_SIZE,
	anchor: MAP_MARKER_ICON_ANCHOR
});

export interface MapMarkerConfig extends MapMarkerHtmlOptions {
	id: string,
	latlng: BlueOrangeMapGeoPoint,
	/** The marker component to draw, for example `<FixedMarker label="Depot" />`. */
	element: React.ReactElement,
	popup?: BlueOrangeMapPopUp,
	layerId?: string,
	groupId?: string
}

/** Builds a complete map marker from a marker component. */
export const createMapMarker = (config: MapMarkerConfig): BlueOrangeMapMarker => {

	const {id, latlng, element, popup, layerId, groupId, ...htmlOptions} = config;

	return {
		id: id,
		latlng: latlng,
		...mapMarkerIcon(element, htmlOptions),
		popup: popup,
		layerId: layerId,
		groupId: groupId
	};
}
