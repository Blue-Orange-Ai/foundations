import React from "react";

import "./LocationPuck.css";
import "../MapMarkerTokens.css";

import {EARNER_LOCATION_PUCK_CORE_SCALES, LOCATION_PUCK_SIZES, LOCATION_PUCK_TYPES} from "../constants";
import {LocationPuckProps} from "../types";
import {classNames} from "../utils/MapMarkerUtils";

/**
 * Where someone is, rather than what is there: a dot with an accuracy halo and
 * a heading indicator. The `consumer` type is the small rider dot, `earner` is
 * the larger driver puck. Anchor it with the `center` anchor mode.
 */
export const LocationPuck: React.FC<LocationPuckProps> = (props) => {

	const {
		size = LOCATION_PUCK_SIZES.medium,
		heading = 0,
		showHeading = true,
		confidenceRadius = 0,
		type = LOCATION_PUCK_TYPES.consumer,
		className
	} = props;

	if (size !== LOCATION_PUCK_SIZES.medium && type === LOCATION_PUCK_TYPES.consumer) {
		console.warn("Location puck size only applies to the " + LOCATION_PUCK_TYPES.earner + " type");
	}

	// The halo is drawn at half the confidence radius, matching the scale the
	// rest of the puck is drawn at.
	const approximation = (
		<div
			className="foundations-location-puck-approximation"
			style={{height: (confidenceRadius / 2) + "px", width: (confidenceRadius / 2) + "px"}} />
	);

	if (type === LOCATION_PUCK_TYPES.consumer) {
		return (
			<div className={classNames("foundations-location-puck", className)} data-foundations="location-puck">
				{approximation}
				<div className="foundations-location-puck-consumer-core" />
				{showHeading &&
					<svg
						className="foundations-location-puck-consumer-heading"
						style={{transform: "rotate(" + heading + "deg) translateY(-16px)"}}
						xmlns="http://www.w3.org/2000/svg"
						width="11"
						height="6"
						viewBox="0 0 11 6">
						<path fillRule="evenodd" clipRule="evenodd" d="M5.5 0L0 6L5.5 5L11 6L5.5 0Z" fill="currentColor" />
					</svg>}
			</div>
		)
	}

	const scale = EARNER_LOCATION_PUCK_CORE_SCALES[size];

	return (
		<div className={classNames("foundations-location-puck", className)} data-foundations="location-puck">
			{approximation}
			<div className="foundations-location-puck-earner-core" style={{transform: "scale(" + scale + ")"}} />
			{/* The earner puck always shows its heading — the wedge is what tells
			    the two ends of the vehicle apart. */}
			<svg
				className="foundations-location-puck-earner-heading"
				style={{transform: "rotate(" + heading + "deg) scale(" + scale + ")"}}
				xmlns="http://www.w3.org/2000/svg"
				width="72"
				height="72"
				viewBox="0 0 72 72">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M36 20L52 52L36 42.8571L20 52L36 20Z"
					fill="currentColor" />
			</svg>
		</div>
	)
}
