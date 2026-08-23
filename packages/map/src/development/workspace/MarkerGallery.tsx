import React from "react";

import "./MarkerGallery.css";

import {FixedMarker} from "../../components/map-markers/fixedmarker/FixedMarker";
import {FloatingMarker} from "../../components/map-markers/floatingmarker/FloatingMarker";
import {FloatingRouteMarker} from "../../components/map-markers/floatingroutemarker/FloatingRouteMarker";
import {LocationPuck} from "../../components/map-markers/locationpuck/LocationPuck";

interface Props {
}

const Sample: React.FC<{name: string, wide?: boolean, children: React.ReactNode}> = ({name, wide, children}) => (
	<div className={"marker-gallery-sample" + (wide ? " marker-gallery-sample-wide" : "")}>
		<div className="marker-gallery-sample-stage">{children}</div>
		<div className="marker-gallery-sample-name">{name}</div>
	</div>
);

/**
 * The markers rendered as plain components, off the map — the quickest way to
 * check a change to the shapes without hunting for a pin on a tile.
 */
export const MarkerGallery: React.FC<Props> = ({}) => {

	return (
		<div className="marker-gallery">
			<Sample name="fixed / large">
				<FixedMarker
					size="large"
					needle="tall"
					label="Depot"
					startEnhancer={<i className="ri-building-4-fill" />} />
			</Sample>
			<Sample name="fixed / medium + badge">
				<FixedMarker
					size="medium"
					kind="accent"
					label="12"
					secondaryLabel="waiting"
					startEnhancer={<i className="ri-user-fill" />}
					badgeEnhancerSize="small"
					badgeEnhancerContent={<i className="ri-arrow-up-line" />} />
			</Sample>
			<Sample name="fixed / negative">
				<FixedMarker
					size="small"
					kind="negative"
					needle="short"
					startEnhancer={<i className="ri-alarm-warning-fill" />} />
			</Sample>
			<Sample name="fixed / dots">
				<div className="marker-gallery-row">
					<FixedMarker size="x-small-circle" needle="none" badgeEnhancerSize="x-small" />
					<FixedMarker size="x-small-square" needle="none" kind="accent" />
					<FixedMarker size="xx-small-circle" needle="none" kind="negative" />
				</div>
			</Sample>
			<Sample name="floating" wide={true}>
				<FloatingMarker
					size="medium"
					label="Data centre"
					secondaryLabel="Shoreditch"
					anchor="bottom-left"
					startEnhancer={<i className="ri-server-fill" />} />
			</Sample>
			<Sample name="route callout">
				<FloatingRouteMarker
					label="12 min"
					secondaryLabel="to the depot"
					anchorPosition="bottom-left"
					startEnhancer={<i className="ri-time-fill" />} />
			</Sample>
			<Sample name="puck / consumer">
				<LocationPuck type="consumer" heading={40} confidenceRadius={110} />
			</Sample>
			<Sample name="puck / earner">
				<LocationPuck type="earner" size="small" heading={200} confidenceRadius={130} />
			</Sample>
		</div>
	)
}
