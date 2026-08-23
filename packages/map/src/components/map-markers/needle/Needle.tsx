import React from "react";

import "./Needle.css";
import "../MapMarkerTokens.css";

import {NEEDLE_HEIGHTS, NEEDLE_SIZES} from "../constants";
import {NeedleProps} from "../types";
import {classNames, kindClassName, kindColourStyle} from "../utils/MapMarkerUtils";

/**
 * The stem that joins a fixed marker's pin head to the point it marks. It takes
 * its colour from the marker kind on the root, so it always matches the head.
 */
export const Needle: React.FC<NeedleProps> = (props) => {

	const {size = NEEDLE_SIZES.medium, kind, background, className} = props;

	const height = NEEDLE_HEIGHTS[size];

	if (height === 0) {
		return null;
	}

	return (
		<div
			className={classNames("foundations-map-marker-needle", "foundations-map-marker-shadow",
				kind && kindClassName(kind), className)}
			style={{height: height + "px", ...kindColourStyle(undefined, background)}} />
	)
}
