import React from "react";

import "./BadgeEnhancer.css";

import {
	BADGE_ENHANCER_CONTENT_SIZE,
	BADGE_ENHANCER_POSITIONS,
	BADGE_ENHANCER_SIZES,
	PINHEAD_TYPES
} from "../constants";
import {BadgeEnhancerProps, PinHeadSize, PinHeadType} from "../types";
import {classNames, hasContent, renderEnhancer} from "../utils/MapMarkerUtils";

interface Props extends BadgeEnhancerProps {
	pinHeadSize: PinHeadSize,
	markerType: PinHeadType,
	className?: string
}

/**
 * The counter or status dot that hangs off the top right of a pin head. Not
 * every badge size fits every pin head; the combinations that do are listed in
 * BADGE_ENHANCER_POSITIONS and anything else is dropped with a warning.
 */
export const BadgeEnhancer: React.FC<Props> = (props) => {

	const {
		pinHeadSize,
		markerType,
		badgeEnhancerSize = BADGE_ENHANCER_SIZES.none,
		badgeEnhancerContent,
		className
	} = props;

	if (!badgeEnhancerSize || badgeEnhancerSize === BADGE_ENHANCER_SIZES.none) {
		return null;
	}
	if (badgeEnhancerSize !== BADGE_ENHANCER_SIZES.xSmall && !hasContent(badgeEnhancerContent)) {
		console.warn("Badges other than size " + BADGE_ENHANCER_SIZES.xSmall + " must have content");
		return null;
	}
	if (markerType === PINHEAD_TYPES.floating) {
		console.warn("Badges can only be rendered on fixed markers");
		return null;
	}

	const positions = BADGE_ENHANCER_POSITIONS[pinHeadSize];
	const position = positions ? positions[badgeEnhancerSize] : null;
	if (!position) {
		console.warn("Badge size " + badgeEnhancerSize + " cannot be rendered on a "
			+ pinHeadSize + " pin head");
		return null;
	}

	return (
		<div
			className={classNames("foundations-map-marker-badge",
				"foundations-map-marker-badge-" + badgeEnhancerSize, className)}
			style={{transform: "translate(calc(100% + " + position.x + "px), " + position.y + "px)"}}>
			{badgeEnhancerSize !== BADGE_ENHANCER_SIZES.xSmall
				&& renderEnhancer(badgeEnhancerContent, BADGE_ENHANCER_CONTENT_SIZE[badgeEnhancerSize])}
		</div>
	)
}
