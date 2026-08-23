import React from "react";

import {
	BADGE_ENHANCER_SIZES,
	FLOATING_MARKER_ANCHOR_POSITIONS,
	FLOATING_MARKER_ANCHOR_TYPES,
	FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS,
	LABEL_ENHANCER_POSITIONS,
	LOCATION_PUCK_SIZES,
	LOCATION_PUCK_TYPES,
	MAP_MARKER_ANCHOR_MODES,
	MAP_MARKER_KINDS,
	NEEDLE_SIZES,
	PINHEAD_SIZES_SHAPES,
	PINHEAD_TYPES
} from "./constants";

export type NeedleSize = typeof NEEDLE_SIZES[keyof typeof NEEDLE_SIZES];

export type PinHeadSize = typeof PINHEAD_SIZES_SHAPES[keyof typeof PINHEAD_SIZES_SHAPES];

export type PinHeadType = typeof PINHEAD_TYPES[keyof typeof PINHEAD_TYPES];

export type MapMarkerKind = typeof MAP_MARKER_KINDS[keyof typeof MAP_MARKER_KINDS];

export type FloatingMarkerAnchorPosition =
	typeof FLOATING_MARKER_ANCHOR_POSITIONS[keyof typeof FLOATING_MARKER_ANCHOR_POSITIONS];

export type FloatingMarkerAnchorType =
	typeof FLOATING_MARKER_ANCHOR_TYPES[keyof typeof FLOATING_MARKER_ANCHOR_TYPES];

export type BadgeEnhancerSize = typeof BADGE_ENHANCER_SIZES[keyof typeof BADGE_ENHANCER_SIZES];

export type LabelEnhancerPosition =
	typeof LABEL_ENHANCER_POSITIONS[keyof typeof LABEL_ENHANCER_POSITIONS];

export type LocationPuckSize = typeof LOCATION_PUCK_SIZES[keyof typeof LOCATION_PUCK_SIZES];

export type LocationPuckType = typeof LOCATION_PUCK_TYPES[keyof typeof LOCATION_PUCK_TYPES];

export type FloatingRouteMarkerAnchorPosition =
	typeof FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS[keyof typeof FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS];

export type MapMarkerAnchorMode = typeof MAP_MARKER_ANCHOR_MODES[keyof typeof MAP_MARKER_ANCHOR_MODES];

/**
 * Enhancers are either a component that is handed the icon size it should draw
 * itself at, or any node — which is rendered inside a slot whose font size is
 * that same icon size, so an icon font (remixicon) sizes itself correctly.
 */
export type MapMarkerEnhancer = React.ComponentType<{size: number}> | React.ReactNode;

export interface BadgeEnhancerProps {
	/** Size of the badge; `none` (the default) hides it. */
	badgeEnhancerSize?: BadgeEnhancerSize,
	/** Content of the badge. Required for every size other than `x-small`. */
	badgeEnhancerContent?: MapMarkerEnhancer
}

export interface LabelEnhancerProps {
	/** Text drawn outside the pin head, stroked so it stays readable on any tile. */
	labelEnhancerContent?: React.ReactNode,
	labelEnhancerPosition?: LabelEnhancerPosition
}

export interface PinHeadProps extends BadgeEnhancerProps, LabelEnhancerProps {
	size?: PinHeadSize,
	label?: React.ReactNode,
	secondaryLabel?: React.ReactNode,
	startEnhancer?: MapMarkerEnhancer,
	endEnhancer?: MapMarkerEnhancer,
	kind?: MapMarkerKind,
	/** Overrides the foreground colour the `kind` would otherwise supply. */
	color?: string,
	/** Overrides the background colour the `kind` would otherwise supply. */
	background?: string,
	type?: PinHeadType,
	/** Needle the pin head sits on — only used to offset a bottom label enhancer. */
	needle?: NeedleSize,
	className?: string
}

export interface NeedleProps {
	size?: NeedleSize,
	kind?: MapMarkerKind,
	background?: string,
	className?: string
}

export interface DragShadowProps {
	dragging?: boolean,
	height?: number,
	kind?: MapMarkerKind,
	background?: string,
	className?: string
}

export interface FixedMarkerProps extends BadgeEnhancerProps, LabelEnhancerProps {
	size?: PinHeadSize,
	needle?: NeedleSize,
	label?: React.ReactNode,
	secondaryLabel?: React.ReactNode,
	startEnhancer?: MapMarkerEnhancer,
	endEnhancer?: MapMarkerEnhancer,
	kind?: MapMarkerKind,
	color?: string,
	background?: string,
	dragging?: boolean,
	className?: string
}

export interface FloatingMarkerProps {
	label?: React.ReactNode,
	secondaryLabel?: React.ReactNode,
	size?: PinHeadSize,
	anchor?: FloatingMarkerAnchorPosition,
	anchorType?: FloatingMarkerAnchorType,
	startEnhancer?: MapMarkerEnhancer,
	endEnhancer?: MapMarkerEnhancer,
	kind?: MapMarkerKind,
	className?: string
}

export interface FloatingRouteMarkerProps {
	label?: React.ReactNode,
	secondaryLabel?: React.ReactNode,
	startEnhancer?: MapMarkerEnhancer,
	endEnhancer?: MapMarkerEnhancer,
	anchorPosition?: FloatingRouteMarkerAnchorPosition,
	selected?: boolean,
	className?: string
}

export interface LocationPuckProps {
	size?: LocationPuckSize,
	/** Bearing in degrees, clockwise from north. */
	heading?: number,
	/** Diameter of the accuracy halo, in pixels. */
	confidenceRadius?: number,
	showHeading?: boolean,
	type?: LocationPuckType,
	className?: string
}
