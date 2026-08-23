import React from "react";

import {MAP_MARKER_KINDS} from "../constants";
import {MapMarkerEnhancer, MapMarkerKind} from "../types";

/** True when the slot has something worth reserving a grid column for. */
export const hasContent = (value: React.ReactNode | MapMarkerEnhancer): boolean => (
	value !== undefined && value !== null && value !== false && value !== ""
);

/**
 * Enhancers may be a component that wants to be told the icon size, or a plain
 * node. Components get the size as a prop, nodes are sized by the slot they are
 * rendered into.
 */
export const renderEnhancer = (enhancer: MapMarkerEnhancer | undefined, size: number): React.ReactNode => {
	if (!hasContent(enhancer)) {
		return null;
	}
	if (typeof enhancer === "function") {
		const Enhancer = enhancer as React.ComponentType<{size: number}>;
		return <Enhancer size={size} />;
	}
	return enhancer as React.ReactNode;
}

export const kindClassName = (kind: MapMarkerKind = MAP_MARKER_KINDS.default): string => (
	"foundations-map-marker-kind-" + kind
);

/**
 * Explicit colours win over the ones the kind resolves, by writing the same
 * two custom properties the kind class sets.
 */
export const kindColourStyle = (color?: string, background?: string): React.CSSProperties => {
	const style: {[property: string]: string} = {};
	if (color) {
		style["--foundations-map-marker-foreground"] = color;
	}
	if (background) {
		style["--foundations-map-marker-background"] = background;
	}
	return style as React.CSSProperties;
}

export const classNames = (...values: Array<string | undefined | false>): string => (
	values.filter((value) => !!value).join(" ")
);
