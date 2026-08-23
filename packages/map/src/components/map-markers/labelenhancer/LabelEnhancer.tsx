import React from "react";

import "./LabelEnhancer.css";
import "../MapMarkerTokens.css";

import {LABEL_ENHANCER_POSITIONS, LABEL_SIZES, NEEDLE_HEIGHTS, NEEDLE_SIZES} from "../constants";
import {LabelEnhancerProps, NeedleSize, PinHeadSize} from "../types";
import {classNames, hasContent} from "../utils/MapMarkerUtils";

interface Props extends LabelEnhancerProps {
	size: PinHeadSize,
	/** Needle the pin head sits on, so a bottom label clears the needle tip. */
	needle?: NeedleSize,
	className?: string
}

/**
 * A stroked caption drawn outside the pin head — a place name next to a pin
 * rather than a label inside it. It is laid out from a zero sized anchor so it
 * never changes the size of the marker it belongs to.
 */
export const LabelEnhancer: React.FC<Props> = (props) => {

	const {
		labelEnhancerContent,
		labelEnhancerPosition = LABEL_ENHANCER_POSITIONS.none,
		size,
		needle = NEEDLE_SIZES.none,
		className
	} = props;

	if (labelEnhancerPosition === LABEL_ENHANCER_POSITIONS.none || !hasContent(labelEnhancerContent)) {
		return null;
	}

	const needleHeight = NEEDLE_HEIGHTS[needle];

	return (
		<div
			className={classNames("foundations-map-marker-label-enhancer-container",
				"foundations-map-marker-label-enhancer-container-" + labelEnhancerPosition, className)}
			style={labelEnhancerPosition === LABEL_ENHANCER_POSITIONS.bottom
				? {top: "calc(100% + 4px + " + needleHeight + "px)"}
				: undefined}>
			<div className={classNames("foundations-map-marker-label-enhancer",
				"foundations-map-marker-label-" + LABEL_SIZES[size])}>
				{labelEnhancerContent}
			</div>
		</div>
	)
}
