import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid';

import './Workspace.css'
import {BlueOrangeMapWrapper} from "../../components/map/BlueOrangeMapWrapper";
import {
	BlueOrangeMap,
	BlueOrangeMapMarker,
	BlueOrangeMapObservations,
	BlueOrangeMapOptions,
	BlueOrangeMapSelectedObjects,
	BlueOrangeMapShape,
	BlueOrangeMapTrack
} from "@blue-orange-ai/primitives-map";
import {Panel, PanelTab, PropertiesDisplay, Property} from "@blue-orange-ai/foundations-core";

import {FixedMarker} from "../../components/map-markers/fixedmarker/FixedMarker";
import {FloatingMarker} from "../../components/map-markers/floatingmarker/FloatingMarker";
import {FloatingRouteMarker} from "../../components/map-markers/floatingroutemarker/FloatingRouteMarker";
import {LocationPuck} from "../../components/map-markers/locationpuck/LocationPuck";
import {createMapMarker, mapMarkerIcon} from "../../components/map-markers/utils/MapMarkerHtml";
import {MapMarkerAnchorMode} from "../../components/map-markers/types";
import {
	advanceVehicle,
	initialVehicleState,
	VEHICLES,
	VehicleDefinition,
	VehicleState
} from "../simulation/TrackSimulation";
import {MarkerGallery} from "./MarkerGallery";

interface Props {
}

/** How often the simulation steps. Small enough that movement reads as motion. */
const TICK_MS = 200;

/** How many observations each track keeps behind it. */
const TRAIL_LENGTH = 26;

/** Every nth observation gets its own pin when observation pins are shown. */
const OBSERVATION_PIN_STRIDE = 5;

const SPEED_MULTIPLIERS = [1, 2, 4, 8];

// ---------------------------------------------------------------------------
// Static scenery — the fixed sites, drawn with the marker components.
// ---------------------------------------------------------------------------

const headingArrow = (heading: number) => (
	<span className="workspace-heading-arrow" style={{transform: "rotate(" + heading + "deg)"}}>
		<i className="ri-navigation-fill" />
	</span>
);

const initialMarkers: Array<BlueOrangeMapMarker> = [
	createMapMarker({
		id: "hq",
		latlng: {lat: 51.5074, lng: -0.1278},
		element: (
			<FixedMarker
				size="medium"
				needle="tall"
				label="London HQ"
				startEnhancer={<i className="ri-building-4-fill" />}
				labelEnhancerContent="Trafalgar Square"
				labelEnhancerPosition="bottom"
				badgeEnhancerSize="small"
				badgeEnhancerContent={<i className="ri-check-line" />} />
		)
	}),
	createMapMarker({
		id: "dc",
		latlng: {lat: 51.5238, lng: -0.0846},
		anchorMode: "center",
		element: (
			<FloatingMarker
				size="medium"
				kind="accent"
				label="Data centre"
				secondaryLabel="Shoreditch"
				anchor="bottom-left"
				startEnhancer={<i className="ri-server-fill" />} />
		)
	}),
	createMapMarker({
		id: "lab",
		latlng: {lat: 51.4993, lng: -0.1770},
		element: (
			<FixedMarker
				size="large"
				needle="medium"
				kind="accent"
				startEnhancer={<i className="ri-flask-fill" />}
				labelEnhancerContent="Research lab"
				labelEnhancerPosition="right" />
		)
	}),
	createMapMarker({
		id: "eta",
		latlng: {lat: 51.5262, lng: -0.1035},
		anchorMode: "bottom-left",
		offset: 8,
		element: (
			<FloatingRouteMarker
				label="12 min"
				secondaryLabel="to the depot"
				anchorPosition="bottom-left"
				startEnhancer={<i className="ri-time-fill" />} />
		)
	}),
	createMapMarker({
		id: "incident",
		latlng: {lat: 51.5045, lng: -0.0865},
		anchorMode: "center",
		element: <FixedMarker size="x-small-circle" needle="none" kind="negative" badgeEnhancerSize="x-small" />
	})
];

const initialShapes: Array<BlueOrangeMapShape> = [
	{
		id: "coverage", type: "circle", center: {lat: 51.5074, lng: -0.1278}, radius: 900,
		color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.12, tooltip: "HQ coverage (900 m)"
	},
	{
		id: "campus", type: "polygon",
		points: [
			{lat: 51.5285, lng: -0.0935}, {lat: 51.5305, lng: -0.0785},
			{lat: 51.5225, lng: -0.0755}, {lat: 51.5205, lng: -0.0905}
		],
		color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.15, tooltip: "Campus boundary"
	},
	{
		id: "fibre", type: "line",
		points: [
			{lat: 51.5074, lng: -0.1278}, {lat: 51.5150, lng: -0.1050},
			{lat: 51.5238, lng: -0.0846}
		],
		color: "#7c3aed", tooltip: "Fibre route HQ -> DC"
	}
];

// ---------------------------------------------------------------------------
// What the panel says about a thing on the map. A real application would carry
// this on the object it drew the marker from; the demo keeps a lookup beside
// the scenery.
// ---------------------------------------------------------------------------

interface ObjectDetail {
	name: string,
	icon: string,
	kind: string,
	detail: string
}

const MARKER_DETAILS: {[id: string]: ObjectDetail} = {
	hq: {name: "London HQ", icon: "ri-building-4-fill", kind: "Office", detail: "Trafalgar Square"},
	dc: {name: "Data centre", icon: "ri-server-fill", kind: "Facility", detail: "Shoreditch, rack rows A-F"},
	lab: {name: "Research lab", icon: "ri-flask-fill", kind: "Facility", detail: "South Kensington"},
	eta: {name: "Depot ETA", icon: "ri-time-fill", kind: "Callout", detail: "12 minutes out"},
	incident: {name: "Incident", icon: "ri-alarm-warning-fill", kind: "Incident", detail: "Reported 09:42, unassigned"}
};

const SHAPE_DETAILS: {[id: string]: ObjectDetail} = {
	coverage: {name: "HQ coverage", icon: "ri-circle-line", kind: "Coverage", detail: "900 m radius around the HQ"},
	campus: {name: "Campus boundary", icon: "ri-shape-2-line", kind: "Boundary", detail: "Shoreditch campus"},
	fibre: {name: "Fibre route", icon: "ri-route-line", kind: "Route", detail: "HQ to the data centre"}
};

const SHAPE_ICONS: {[type: string]: string} = {
	circle: "ri-circle-line",
	polygon: "ri-shape-2-line",
	rectangle: "ri-square-line",
	line: "ri-route-line",
	polyline: "ri-route-line",
	arc: "ri-pie-chart-line",
	arrow: "ri-arrow-right-up-line"
};

/** Ad-hoc objects are keyed by uuid — enough of it to tell them apart. */
const shortId = (id: string) => (id.length > 12 ? id.slice(0, 8) : id);

const coordinates = (point?: {lat: number, lng: number}) => (
	point ? point.lat.toFixed(4) + ", " + point.lng.toFixed(4) : undefined
);

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const markerDetail = (marker: BlueOrangeMapMarker): ObjectDetail => (
	MARKER_DETAILS[marker.id] ?? {
		name: "Marker " + shortId(marker.id),
		icon: "ri-map-pin-2-line",
		kind: "Dropped marker",
		detail: "Added from the sidebar"
	}
);

const shapeDetail = (shape: BlueOrangeMapShape): ObjectDetail => (
	SHAPE_DETAILS[shape.id] ?? {
		name: shape.tooltip ?? titleCase(shape.type) + " " + shortId(shape.id),
		icon: SHAPE_ICONS[shape.type] ?? "ri-shape-line",
		kind: titleCase(shape.type),
		detail: "Drawn on the map"
	}
);

const markerProperties = (marker: BlueOrangeMapMarker): Array<Property> => {
	const detail = markerDetail(marker);
	return [
		{label: "Name", value: detail.name},
		{label: "Type", value: detail.kind},
		{label: "Detail", value: detail.detail},
		{label: "Position", value: coordinates(marker.latlng), copyable: true},
		{label: "Id", value: marker.id, copyable: true},
		{label: "Group", value: marker.groupId}
	];
}

const shapeProperties = (shape: BlueOrangeMapShape): Array<Property> => {
	const detail = shapeDetail(shape);
	return [
		{label: "Name", value: detail.name},
		{label: "Type", value: detail.kind},
		{label: "Detail", value: detail.detail},
		{label: "Centre", value: coordinates(shape.center ?? shape.base)},
		{label: "Radius", value: shape.radius ? Math.round(shape.radius) + " m" : undefined},
		{label: "Points", value: shape.points ? shape.points.length + " vertices" : undefined},
		{label: "Colour", value: shape.color},
		{label: "Id", value: shape.id, copyable: true},
		{label: "Group", value: shape.groupId}
	];
}

// Popups are off across the board — clicking an object opens the panel instead.
const options: BlueOrangeMapOptions = {
	center: [51.5104, -0.1240],
	zoom: 13,
	shapePopups: {enabled: false}
};

// ---------------------------------------------------------------------------
// Live tracks
// ---------------------------------------------------------------------------

/** Which part of a vehicle's marker sits on its position. */
const anchorModeFor = (vehicle: VehicleDefinition): MapMarkerAnchorMode => (
	vehicle.markerStyle === "fixed" ? "bottom-center" : "center"
);

const vehicleMarkerElement = (vehicle: VehicleDefinition, state: VehicleState): React.ReactElement => {
	const speed = Math.round(state.speedKph) + " km/h";
	if (vehicle.markerStyle === "puck") {
		return <LocationPuck type="earner" size="small" heading={state.heading} confidenceRadius={140} />;
	}
	if (vehicle.markerStyle === "floating") {
		return (
			<FloatingMarker
				size="medium"
				kind={vehicle.kind}
				anchor="bottom-left"
				label={vehicle.name}
				secondaryLabel={speed}
				startEnhancer={<i className={vehicle.icon} />} />
		);
	}
	return (
		<FixedMarker
			size="medium"
			needle="short"
			kind={vehicle.kind}
			label={speed}
			startEnhancer={<i className={vehicle.icon} />}
			endEnhancer={headingArrow(state.heading)}
			labelEnhancerContent={vehicle.name}
			labelEnhancerPosition="bottom" />
	);
}

const buildTrack = (
	vehicle: VehicleDefinition,
	state: VehicleState,
	observations: Array<BlueOrangeMapObservations>,
	showTrackLines: boolean): BlueOrangeMapTrack => ({
	id: vehicle.id,
	type: vehicle.markerStyle,
	latlng: state.latlng,
	marker: {
		id: vehicle.id + "-marker",
		latlng: state.latlng,
		...mapMarkerIcon(vehicleMarkerElement(vehicle, state), {anchorMode: anchorModeFor(vehicle)})
	},
	display: {trackLines: showTrackLines},
	trackline: {color: vehicle.trackColour, weight: 3, opacity: 0.65},
	observations: observations
});

const observation = (
	vehicle: VehicleDefinition,
	state: VehicleState,
	timestamp: Date,
	sequence: number): BlueOrangeMapObservations => ({
	id: vehicle.id + "-obs-" + sequence,
	timestamp: timestamp,
	lat: state.latlng.lat,
	lng: state.latlng.lng,
	data: {speedKph: Math.round(state.speedKph), heading: Math.round(state.heading)}
});

/**
 * Walks a vehicle backwards along its route to invent the trail it would have
 * left, so every track already has history the moment the map opens.
 */
const seedObservations = (vehicle: VehicleDefinition, state: VehicleState): Array<BlueOrangeMapObservations> => {
	const seeded: Array<BlueOrangeMapObservations> = [];
	const stepMetres = (vehicle.speedKph / 3.6) * 6;
	const now = Date.now();
	for (let i = TRAIL_LENGTH - 1; i >= 0; i--) {
		const position = vehicle.route.positionAt(state.distance - i * stepMetres);
		seeded.push({
			id: vehicle.id + "-obs-seed-" + i,
			timestamp: new Date(now - i * 6000),
			lat: position.latlng.lat,
			lng: position.latlng.lng,
			data: {speedKph: Math.round(vehicle.speedKph), heading: Math.round(position.heading)}
		});
	}
	return seeded;
}

interface LogEntry {
	id: number,
	time: string,
	text: string
}

export const Workspace: React.FC<Props> = ({}) => {

	const [map, setMap] = useState<BlueOrangeMap | null>(null);

	const [running, setRunning] = useState<boolean>(true);
	const [speedMultiplier, setSpeedMultiplier] = useState<number>(2);
	const [showTrackLines, setShowTrackLines] = useState<boolean>(true);
	const [showObservationPins, setShowObservationPins] = useState<boolean>(true);
	const [selectionOutline, setSelectionOutline] = useState<boolean>(true);

	const [entries, setEntries] = useState<Array<LogEntry>>([]);

	// What the map says is selected. The panel is driven off this alone, so it
	// follows clicks, shift-clicks, the sidebar and the on-map controls alike.
	const [selection, setSelection] = useState<BlueOrangeMapSelectedObjects>({
		markers: [], shapes: [], tracks: []
	});

	// The tab the panel is showing. Held here rather than left to the panel so
	// that shift-clicking a fifth thing opens the fifth thing, instead of
	// leaving the panel on whatever was clicked first.
	const [activeTab, setActiveTab] = useState<string>("");

	// The simulation runs off refs: the interval owns the vehicle positions and
	// the trails, and only publishes a small readout for the sidebar.
	const statesRef = useRef<{[id: string]: VehicleState}>({});
	const observationsRef = useRef<{[id: string]: Array<BlueOrangeMapObservations>}>({});
	const sequenceRef = useRef<number>(0);
	const observationPinsRef = useRef<Array<string>>([]);

	const [readout, setReadout] = useState<{[id: string]: VehicleState}>({});

	// Built once, before the map is constructed, so the tracks exist from the
	// first frame and the interval only ever has to update them.
	const initialTracks = useMemo<Array<BlueOrangeMapTrack>>(() => (
		VEHICLES.map((vehicle) => {
			const state = initialVehicleState(vehicle);
			statesRef.current[vehicle.id] = state;
			observationsRef.current[vehicle.id] = seedObservations(vehicle, state);
			return buildTrack(vehicle, state, observationsRef.current[vehicle.id], true);
		})
	), []);

	// The observation pin is the same shape wherever it lands, so its markup is
	// rendered once per vehicle instead of once per pin per tick.
	const observationPinIcons = useMemo(() => {
		const icons: {[id: string]: ReturnType<typeof mapMarkerIcon>} = {};
		VEHICLES.forEach((vehicle) => {
			icons[vehicle.id] = mapMarkerIcon(
				<FixedMarker size="xx-small-circle" needle="none" kind={vehicle.kind} />,
				{anchorMode: "center", className: "workspace-observation-pin"});
		});
		return icons;
	}, []);

	const log = useCallback((text: string) => {
		setEntries((previous) => [
			{id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), text: text},
			...previous
		].slice(0, 100));
	}, []);

	const withMap = (action: (map: BlueOrangeMap) => void) => {
		if (map) {
			action(map);
		}
	}

	/**
	 * Brings the observation pins in line with the trails. The pin ids are
	 * derived from the vehicle and the sample index, so they stay stable across
	 * ticks and the pins can be moved rather than rebuilt.
	 */
	const syncObservationPins = useCallback((instance: BlueOrangeMap, enabled: boolean) => {
		const wanted: Array<BlueOrangeMapMarker> = [];
		if (enabled) {
			VEHICLES.forEach((vehicle) => {
				const observations = observationsRef.current[vehicle.id] || [];
				let sample = 0;
				for (let i = observations.length - 1 - OBSERVATION_PIN_STRIDE; i >= 0; i -= OBSERVATION_PIN_STRIDE) {
					wanted.push({
						id: vehicle.id + "-pin-" + sample,
						latlng: {lat: observations[i].lat, lng: observations[i].lng},
						...observationPinIcons[vehicle.id]
					});
					sample++;
				}
			});
		}

		const wantedIds = wanted.map((marker) => marker.id);
		observationPinsRef.current
			.filter((id) => wantedIds.indexOf(id) < 0)
			.forEach((id) => {
				if (instance.getMarker(id)) {
					instance.removeMarker(id);
				}
			});

		wanted.forEach((marker) => {
			// A pin can go missing if it was deleted with the map controls, so the
			// map is asked rather than trusting the bookkeeping.
			if (instance.getMarker(marker.id)) {
				instance.updateMarker(marker);
			} else {
				instance.addMarker(marker);
			}
		});
		observationPinsRef.current = wantedIds;
	}, [observationPinIcons]);

	// Redraw the tracks whenever a display toggle changes, even while paused.
	useEffect(() => {
		if (!map) {
			return;
		}
		VEHICLES.forEach((vehicle) => {
			map.updateTrack(buildTrack(vehicle, statesRef.current[vehicle.id],
				observationsRef.current[vehicle.id], showTrackLines));
		});
		syncObservationPins(map, showObservationPins);
	}, [map, showTrackLines, showObservationPins, syncObservationPins]);

	// The simulation itself.
	useEffect(() => {
		if (!map || !running) {
			return;
		}
		let previous = Date.now();
		const handle = window.setInterval(() => {
			const now = Date.now();
			const elapsed = (now - previous) / 1000 * speedMultiplier;
			previous = now;
			sequenceRef.current++;

			VEHICLES.forEach((vehicle) => {
				const state = advanceVehicle(vehicle, statesRef.current[vehicle.id], elapsed);
				statesRef.current[vehicle.id] = state;

				const trail = observationsRef.current[vehicle.id]
					.concat([observation(vehicle, state, new Date(now), sequenceRef.current)])
					.slice(-TRAIL_LENGTH);
				observationsRef.current[vehicle.id] = trail;

				map.updateTrack(buildTrack(vehicle, state, trail, showTrackLines));
			});

			syncObservationPins(map, showObservationPins);
			setReadout({...statesRef.current});
		}, TICK_MS);

		return () => window.clearInterval(handle);
	}, [map, running, speedMultiplier, showTrackLines, showObservationPins, syncObservationPins]);

	const describeSelection = (selection: {markers: Array<any>, shapes: Array<any>, tracks: Array<any>}) => (
		selection.markers.length + " markers, " + selection.shapes.length + " shapes, " + selection.tracks.length + " tracks"
	);

	const emptySelection = (): BlueOrangeMapSelectedObjects => ({markers: [], shapes: [], tracks: []});

	const clearSelection = () => {
		withMap((instance) => instance.clearAllSelectedObjects());
		setSelection(emptySelection());
		setActiveTab("");
		log("clearAllSelectedObjects: panel closed");
	}

	const tabUuidsOf = (objects: BlueOrangeMapSelectedObjects): Array<string> => ([
		...objects.markers.map((marker) => "marker:" + marker.id),
		...objects.shapes.map((shape) => "shape:" + shape.id),
		...objects.tracks.map((track) => "track:" + track.id)
	]);

	/** Where the thing behind a tab currently is. */
	const positionOf = (uuid: string, objects: BlueOrangeMapSelectedObjects) => {
		const separator = uuid.indexOf(":");
		const kind = uuid.slice(0, separator);
		const id = uuid.slice(separator + 1);
		if (kind === "marker") {
			return objects.markers.find((marker) => marker.id === id)?.latlng;
		}
		if (kind === "track") {
			// The live position, not the one the track was clicked at.
			return statesRef.current[id]?.latlng ?? objects.tracks.find((track) => track.id === id)?.latlng;
		}
		const shape = objects.shapes.find((item) => item.id === id);
		if (!shape) {
			return undefined;
		}
		if (shape.center ?? shape.base) {
			return shape.center ?? shape.base;
		}
		if (shape.points && shape.points.length > 0) {
			return {
				lat: shape.points.reduce((total, point) => total + point.lat, 0) / shape.points.length,
				lng: shape.points.reduce((total, point) => total + point.lng, 0) / shape.points.length
			};
		}
		return undefined;
	}

	/** How much of the map width the panel is sitting on top of. */
	const panelWidthFraction = () => {
		const panel = document.querySelector(".workspace-map-panel") as HTMLElement | null;
		const mapElement = document.querySelector(".blue-orange-map-parent") as HTMLElement | null;
		if (!panel || !mapElement || mapElement.clientWidth === 0) {
			return 0;
		}
		return (panel.offsetWidth + 24) / mapElement.clientWidth;
	}

	/**
	 * Brings the object behind the active tab into view. The map only moves when
	 * that object is near an edge or behind the panel — panning on every change
	 * would drag the map out from under someone shift-clicking their way through
	 * a group. The centre is offset by half the panel so the object lands in the
	 * middle of the map that is still visible rather than underneath it.
	 */
	const focusObject = (uuid: string, objects: BlueOrangeMapSelectedObjects) => {
		withMap((instance) => {
			const position = positionOf(uuid, objects);
			if (!position) {
				return;
			}
			const view = instance.getVisibleMapCoordinates();
			const latSpan = view.maxLat - view.minLat;
			const lngSpan = view.maxLng - view.minLng;
			const covered = lngSpan * panelWidthFraction();
			const inView = position.lat > view.minLat + latSpan * 0.15
				&& position.lat < view.maxLat - latSpan * 0.15
				&& position.lng > view.minLng + lngSpan * 0.1
				&& position.lng < view.maxLng - covered - lngSpan * 0.1;
			if (inView) {
				return;
			}
			// The leaflet map behind the wrapper — panning is not on the
			// primitives surface itself yet.
			const leaflet = (instance as any).map;
			if (leaflet && typeof leaflet.panTo === "function") {
				leaflet.panTo([position.lat, position.lng + covered / 2]);
				log("focus: panned to " + uuid);
			}
		});
	}

	/**
	 * Whatever was just added to the selection is what the panel opens on — the
	 * thing that was clicked last is the thing being asked about.
	 *
	 * A selection made on the map is left where it is: the object was clicked,
	 * so it is already under the user's eye and moving the map would shift the
	 * next target out from under them mid shift-click. A selection made from the
	 * sidebar has no such click behind it, so that one is focused.
	 */
	const selectionUpdated = (next: BlueOrangeMapSelectedObjects, focus: boolean = false) => {
		const previousUuids = tabUuidsOf(selection);
		const nextUuids = tabUuidsOf(next);
		const added = nextUuids.filter((uuid) => previousUuids.indexOf(uuid) < 0);
		const uuid = added.length > 0
			? added[added.length - 1]
			: (nextUuids.indexOf(activeTab) >= 0 ? activeTab : (nextUuids[0] ?? ""));
		setSelection(next);
		setActiveTab(uuid);
		if (uuid && focus) {
			focusObject(uuid, next);
		}
	}

	const tabClicked = (uuid: string) => {
		setActiveTab(uuid);
		focusObject(uuid, selection);
		log("panel tab: " + uuid);
	}

	/**
	 * Read out of the simulation rather than off the track the map handed over
	 * when it was clicked, so a selected vehicle keeps counting up in the panel
	 * while it drives.
	 */
	const trackProperties = (track: BlueOrangeMapTrack): Array<Property> => {
		const vehicle = VEHICLES.find((item) => item.id === track.id);
		const state = readout[track.id] ?? statesRef.current[track.id];
		const observations = observationsRef.current[track.id] ?? [];
		const last = observations[observations.length - 1];
		return [
			{label: "Vehicle", value: vehicle ? vehicle.name : track.id},
			{label: "Type", value: vehicle ? titleCase(vehicle.markerStyle) + " track" : "Track"},
			{label: "Detail", value: vehicle?.detail},
			{label: "Speed", value: state ? Math.round(state.speedKph) + " km/h" : undefined},
			{label: "Heading", value: state ? Math.round(state.heading) + "°" : undefined},
			{label: "Position", value: coordinates(state?.latlng), copyable: true},
			{label: "Observations", value: observations.length + " kept"},
			{label: "Last seen", value: last ? last.timestamp.toLocaleTimeString() : undefined},
			{label: "Id", value: track.id, copyable: true}
		];
	}

	// Only what applies to the thing that was clicked — a circle has no vertex
	// count and an ungrouped marker has no group, and a column of dashes reads
	// worse than a shorter list.
	const propertiesDisplay = (properties: Array<Property>) => (
		<PropertiesDisplay
			properties={properties.filter((property) => property.value !== undefined && property.value !== "")}
			orientation="vertical"
			labelWidth="110px" />
	);

	// One tab per selected object, in the order the map reports them.
	const panelTabs: Array<PanelTab> = [
		...selection.markers.map((marker) => {
			const detail = markerDetail(marker);
			return {
				uuid: "marker:" + marker.id,
				label: detail.name,
				icon: detail.icon,
				content: propertiesDisplay(markerProperties(marker))
			};
		}),
		...selection.shapes.map((shape) => {
			const detail = shapeDetail(shape);
			return {
				uuid: "shape:" + shape.id,
				label: detail.name,
				icon: detail.icon,
				content: propertiesDisplay(shapeProperties(shape))
			};
		}),
		...selection.tracks.map((track) => {
			const vehicle = VEHICLES.find((item) => item.id === track.id);
			return {
				uuid: "track:" + track.id,
				label: vehicle ? vehicle.name : "Track " + shortId(track.id),
				icon: vehicle ? vehicle.icon : "ri-route-line",
				content: propertiesDisplay(trackProperties(track))
			};
		})
	];

	const selectionCount = panelTabs.length;

	// A single selection reads better as a titled panel than as a lone tab.
	const activePanelTab = panelTabs.find((tab) => tab.uuid === activeTab) ?? panelTabs[0];

	const singleHeader = (
		<>
			<i className={activePanelTab?.icon} />
			<span>{activePanelTab?.label}</span>
		</>
	);

	const dropMarker = (name: string, element: React.ReactElement, anchorMode: MapMarkerAnchorMode) => {
		withMap((instance) => {
			const id = uuidv4();
			instance.addMarker(createMapMarker({
				id: id,
				latlng: {lat: 51.4980 + Math.random() * 0.028, lng: -0.170 + Math.random() * 0.090},
				element: element,
				anchorMode: anchorMode
			}));
			log("addMarker: " + name + " -> " + id.slice(0, 8));
		});
	}

	return (

		<div className="workspace-main-window">
			<div className="workspace-display-window">
				<BlueOrangeMapWrapper
					markers={initialMarkers}
					shapes={initialShapes}
					tracks={initialTracks}
					options={options}
					selectionOutline={selectionOutline}
					instance={(instance) => setMap(instance)}
					selectionChanged={(selection) => {
						selectionUpdated(selection);
						log("selectionChanged: " + describeSelection(selection));
					}}
					objectsCreated={(selection) => log("objectsCreated: " + describeSelection(selection))}
					objectsDeleted={(selection) => {
						setSelection(emptySelection());
						setActiveTab("");
						log("objectsDeleted: " + describeSelection(selection));
					}}
					groupCreated={(groupId) => log("groupCreated: " + groupId)}
					groupRemoved={(groupIds) => log("groupRemoved: " + groupIds.join(", "))} />
				{selectionCount > 0 &&
					<div className="workspace-map-panel">
						<Panel
							header={selectionCount === 1 ? singleHeader : selectionCount + " selected"}
							icon={"ri-close-line"}
							iconLabel={"Clear selection"}
							onIconClick={clearSelection}
							tabs={selectionCount > 1 ? panelTabs : []}
							activeTab={activeTab}
							onTabClick={tabClicked}
							width={"100%"}
							height={"100%"}
							padding={12}>
							{activePanelTab?.content}
						</Panel>
					</div>
				}
			</div>
			<div className="workspace-sidebar">
				<div className="workspace-controls">
					<strong>Live tracks</strong>
					<div className="workspace-button-row">
						<button onClick={() => setRunning((value) => !value)}>
							<i className={running ? "ri-pause-fill" : "ri-play-fill"} />
							{running ? "Pause" : "Play"}
						</button>
						{SPEED_MULTIPLIERS.map((multiplier) => (
							<button
								key={multiplier}
								className={multiplier === speedMultiplier ? "workspace-button-active" : undefined}
								onClick={() => setSpeedMultiplier(multiplier)}>{multiplier}x</button>
						))}
					</div>
					<label className="workspace-toggle">
						<input
							type="checkbox"
							checked={showTrackLines}
							onChange={(event) => setShowTrackLines(event.target.checked)} />
						Track lines
					</label>
					<label className="workspace-toggle">
						<input
							type="checkbox"
							checked={showObservationPins}
							onChange={(event) => setShowObservationPins(event.target.checked)} />
						Observation pins
					</label>
					<label className="workspace-toggle">
						<input
							type="checkbox"
							checked={selectionOutline}
							onChange={(event) => setSelectionOutline(event.target.checked)} />
						Selection outline
					</label>

					<div className="workspace-vehicles">
						{VEHICLES.map((vehicle) => {
							const state = readout[vehicle.id] || statesRef.current[vehicle.id];
							return (
								<div key={vehicle.id} className="workspace-vehicle">
									<span className="workspace-vehicle-swatch" style={{backgroundColor: vehicle.trackColour}}>
										<i className={vehicle.icon} />
									</span>
									<span className="workspace-vehicle-name">
										<span>{vehicle.name}</span>
										<span className="workspace-vehicle-detail">{vehicle.detail}</span>
									</span>
									<span className="workspace-vehicle-readout">
										{state ? Math.round(state.speedKph) + " km/h" : "--"}
										<span className="workspace-vehicle-detail">
											{state ? Math.round(state.heading) + "°" : ""}
										</span>
									</span>
									<button onClick={() => withMap((instance) => {
										const track = instance.getTrack(vehicle.id);
										if (track) {
											instance.clearAllSelectedObjects([vehicle.id]);
											instance.selectTrack(track);
											// Selecting through the API does not raise the map's own
											// selection event, so the panel is told directly.
											selectionUpdated(instance.getSelectedObjects(), true);
											log("selectTrack: " + vehicle.name);
										}
									})} title="Select this track"><i className="ri-focus-3-line" /></button>
								</div>
							)
						})}
					</div>

					<strong>Drop a marker</strong>
					<button onClick={() => dropMarker("fixed marker",
						<FixedMarker
							size="medium"
							needle="medium"
							label="Ad-hoc"
							startEnhancer={<i className="ri-map-pin-2-fill" />} />, "bottom-center")}>Fixed marker</button>
					<button onClick={() => dropMarker("floating marker",
						<FloatingMarker
							size="medium"
							kind="accent"
							label="Ad-hoc"
							secondaryLabel="dropped here"
							anchor="bottom-left"
							startEnhancer={<i className="ri-price-tag-3-fill" />} />, "center")}>Floating marker</button>
					<button onClick={() => dropMarker("route callout",
						<FloatingRouteMarker
							label="4 min"
							secondaryLabel="detour"
							anchorPosition="bottom-center"
							startEnhancer={<i className="ri-route-fill" />} />, "bottom-center")}>Route callout</button>
					<button onClick={() => dropMarker("location puck",
						<LocationPuck type="consumer" heading={Math.round(Math.random() * 360)} confidenceRadius={160} />,
						"center")}>Location puck</button>

					<strong>Markers & shapes</strong>
					<button onClick={() => withMap((instance) => {
						instance.addShape({
							id: uuidv4(), type: "polygon",
							points: [
								{lat: 51.4890, lng: -0.1300}, {lat: 51.4930, lng: -0.1180},
								{lat: 51.4870, lng: -0.1120}, {lat: 51.4840, lng: -0.1250}
							],
							color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.2, tooltip: "New zone"
						});
						log("addShape: polygon");
					})}>Add polygon</button>
					<button onClick={() => withMap((instance) => {
						instance.createArc({
							center: {lat: 51.5238, lng: -0.0846}, radius: 700,
							startAngle: 300, endAngle: 60, arcType: "sector",
							color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.15,
							tooltip: "DC antenna sector"
						});
						log("createArc: sector at data centre");
					})}>Create arc (sector)</button>
					<button onClick={() => withMap((instance) => {
						instance.createArrow({
							base: {lat: 51.4993, lng: -0.1770}, angle: 45, length: 1800,
							color: "#0891b2", fillColor: "#0891b2", fillOpacity: 0.5,
							tooltip: "Prevailing wind"
						});
						log("createArrow: from research lab");
					})}>Create arrow</button>

					<strong>Selection & groups</strong>
					<button onClick={() => withMap((instance) => {
						const selection = instance.getSelectedObjects();
						const count = selection.markers.length + selection.shapes.length + selection.tracks.length;
						if (count === 0) {
							log("nothing selected — click objects (shift-click for multiple) first");
							return;
						}
						const groupId = instance.createGroup(null, "demo-group");
						selection.markers.forEach((m) => instance.addMarkerToGroup(m.id, groupId));
						selection.shapes.forEach((s) => instance.addShapeToGroup(s.id, groupId));
						selection.tracks.forEach((t) => instance.addTrackToGroup(t.id, groupId));
						log("createGroup -> " + groupId + " (" + count + " objects)");
					})}>Group selection</button>
					<button onClick={() => withMap((instance) => {
						instance.removeSelectedObjects();
						setSelection(emptySelection());
						setActiveTab("");
					})}>Delete selection</button>
					<button onClick={clearSelection}>Clear selection</button>

					<strong>Map</strong>
					<button onClick={() => withMap((instance) => {
						instance.changeBaseLayer({
							name: "carto-dark",
							url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
							attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
						});
						log("changeBaseLayer: carto dark");
					})}>Base layer: dark</button>
					<button onClick={() => withMap((instance) => {
						instance.changeBaseLayer({
							name: "osm",
							url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
							attribution: "&copy; OpenStreetMap contributors"
						});
						log("changeBaseLayer: osm");
					})}>Base layer: OSM</button>
					<button onClick={() => withMap((instance) => {
						console.log("map.getMapState()", instance.getMapState());
						const state = instance.getMapState();
						log("getMapState: zoom " + state.zoom + ", " + state.markers.length + " markers, "
							+ state.shapes.length + " shapes, " + state.tracks.length + " tracks (full state in console)");
					})}>Print map state</button>

					<strong>Marker gallery</strong>
					<MarkerGallery />

					<div className="workspace-hints">
						<div>• Tracks step every {TICK_MS} ms; each step appends an observation and trims the trail to {TRAIL_LENGTH}</div>
						<div>• Use the on-map controls to draw shapes, group and delete objects</div>
						<div>• Click a marker, shape or track to open the panel; shift-click for several and the panel grows a tab per selection</div>
						<div>• The panel opens on whatever was clicked last, and the map pans to the active tab when it sits off screen or behind the panel</div>
						<div>• Selection outline keeps the outline on a selected vehicle while it drives; turned off, nothing is outlined at all</div>
					</div>
				</div>
				<div className="workspace-event-log">
					<div className="workspace-event-log-header">
						<span>Events</span>
						<button onClick={() => setEntries([])}>Clear</button>
					</div>
					<div className="workspace-event-log-entries">
						{entries.length === 0 &&
							<div className="workspace-event-log-empty">Interact with the map — wrapper callbacks land here.</div>}
						{entries.map((entry) => (
							<div key={entry.id} className="workspace-event-log-entry">
								<span className="workspace-event-log-time">{entry.time}</span>
								<span>{entry.text}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
