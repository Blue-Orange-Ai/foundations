// @ts-ignore
import React, {useRef, useState} from "react";

import './Workspace.css'
import {BlueOrangeMapHandle, BlueOrangeMapWrapper} from "../../components/map/BlueOrangeMapWrapper";
import type {
	BlueOrangeMapMarker,
	BlueOrangeMapSelectedObjects,
	BlueOrangeMapShape,
	BlueOrangeMapTrack
} from "@blue-orange-ai/primitives-map";

interface Props {
}

// Circular Quay / Sydney Harbour, matching the primitives demo.
const CENTRE = {lat: -33.8600, lng: 151.2100};

const MARKERS: Array<BlueOrangeMapMarker> = [
	{
		id: "marker-hq", latlng: {lat: -33.8610, lng: 151.2110},
		html: '<i class="ri-building-2-line"></i>', className: "blue-orange-map-test-icon",
		size: [40, 40], anchor: [20, 40],
		popup: {display: true, offset: {x: 0, y: -34}, html: "<b>HQ</b><br>Circular Quay"}
	},
	{
		id: "marker-depot", latlng: {lat: -33.8700, lng: 151.2010},
		html: '<i class="ri-store-2-line"></i>', className: "blue-orange-map-test-icon",
		size: [40, 40], anchor: [20, 40],
		popup: {display: true, offset: {x: 0, y: -34}, html: "<b>Depot</b><br>Darling Harbour"}
	}
];

const SHAPES: Array<BlueOrangeMapShape> = [
	{
		id: "shape-polygon", type: "polygon",
		points: [
			{lat: -33.8560, lng: 151.2010}, {lat: -33.8555, lng: 151.2055},
			{lat: -33.8595, lng: 151.2065}, {lat: -33.8605, lng: 151.2015}
		],
		color: "#8E44AD", fillColor: "#8E44AD", fillOpacity: 0.22
	},
	{
		id: "shape-circle", type: "circle", center: {lat: -33.8675, lng: 151.2070}, radius: 300,
		color: "#27AE60", fillColor: "#27AE60", fillOpacity: 0.22
	},
	{
		id: "shape-polyline", type: "line",
		points: [
			{lat: -33.8700, lng: 151.2065}, {lat: -33.8670, lng: 151.2080},
			{lat: -33.8640, lng: 151.2095}, {lat: -33.8610, lng: 151.2110}
		],
		color: "#D35400"
	}
];

const TRACK_ROUTE = [
	{lat: -33.8735, lng: 151.2065}, {lat: -33.8690, lng: 151.2075},
	{lat: -33.8650, lng: 151.2088}, {lat: -33.8615, lng: 151.2105}
];

// A track is a marker riding its newest observation, with the trail behind it
// drawn from the rest. Observations are timestamped fixes, not markers.
const TRACK_START = new Date("2026-01-01T09:00:00Z").getTime();

const TRACKS: Array<BlueOrangeMapTrack> = [
	{
		id: "veh-truck",
		type: "vehicle",
		latlng: TRACK_ROUTE[TRACK_ROUTE.length - 1],
		marker: {
			id: "veh-truck-marker",
			latlng: TRACK_ROUTE[TRACK_ROUTE.length - 1],
			html: '<i class="ri-truck-line"></i>',
			className: "blue-orange-map-test-icon",
			size: [34, 34],
			anchor: [17, 34],
			popup: {display: true, offset: {x: 0, y: -30}, html: "<b>Delivery Truck 07</b><br>CBD street loop"}
		},
		display: {trackLines: true, trackLinesOnSelection: false},
		trackline: {color: "#2563eb", weight: 4, opacity: 0.75},
		observations: TRACK_ROUTE.map((point, index) => ({
			id: "obs-" + index,
			timestamp: new Date(TRACK_START + index * 30000),
			lat: point.lat,
			lng: point.lng,
			data: {speed: 40 + index}
		}))
	}
];

export const Workspace: React.FC<Props> = ({}) => {

	const mapRef = useRef<BlueOrangeMapHandle>(null);

	const [status, setStatus] = useState<string>("");
	const [outputTitle, setOutputTitle] = useState<string>("Output");
	const [output, setOutput] = useState<string>("");
	const [groupId, setGroupId] = useState<string | null>(null);

	const flash = (message: string) => setStatus(message);

	const show = (title: string, value: unknown) => {
		setOutputTitle(title);
		setOutput(JSON.stringify(value, null, 2));
	};

	const summarise = (selection: BlueOrangeMapSelectedObjects) =>
		selection.markers.length + " marker(s), " +
		selection.shapes.length + " shape(s), " +
		selection.tracks.length + " track(s)";

	// ---- Arcs & arrows ---------------------------------------------------

	const addArcs = () => {
		const map = mapRef.current;
		if (!map) {
			return;
		}
		map.createArc({
			center: CENTRE, radius: 400, startAngle: 0, endAngle: 90,
			arcType: "sector", color: "#8E44AD", fillColor: "#8E44AD", fillOpacity: 0.35
		});
		map.createArc({
			center: CENTRE, radius: 650, innerRadius: 450, startAngle: 90, endAngle: 180,
			arcType: "ring", color: "#E74C3C", fillColor: "#E74C3C", fillOpacity: 0.35
		});
		map.createArc({
			center: {lat: -33.8640, lng: 151.2170}, radius: 250, startAngle: 45, endAngle: 315,
			arcType: "arc", color: "#F39C12"
		});
		flash("Added a sector, a ring and a plain arc.");
	};

	const addArrows = () => {
		const map = mapRef.current;
		if (!map) {
			return;
		}
		map.createArrow({
			base: {lat: -33.8650, lng: 151.2040}, angle: 0, length: 250,
			color: "#E67E22", fillColor: "#E67E22", fillOpacity: 0.7
		});
		map.createArrow({
			base: {lat: -33.8650, lng: 151.2075}, angle: 135, length: 350,
			headWidth: 0.5, headLength: 0.35, shaftWidth: 0.1,
			color: "#1ABC9C", fillColor: "#1ABC9C", fillOpacity: 0.7
		});
		flash("Added two arrows.");
	};

	// ---- Groups ----------------------------------------------------------

	const buildGroup = () => {
		const map = mapRef.current;
		if (!map) {
			return;
		}
		const id = map.createGroup("demo-group", "Demo Group");
		if (!id) {
			return;
		}
		const arc = map.createArc({
			center: {lat: -33.8635, lng: 151.2145}, radius: 180, startAngle: 270, endAngle: 360,
			arcType: "sector", color: "#16A085", fillColor: "#16A085", fillOpacity: 0.5
		});
		if (arc) {
			map.addShapeToGroup(arc.id, id);
		}
		map.addMarkerToGroup("marker-hq", id);
		setGroupId(id);
		flash("Grouped an arc with the HQ marker — they now select together.");
	};

	const selectGroup = () => {
		if (groupId) {
			mapRef.current?.selectGroup(groupId);
			flash("Selected group " + groupId + ".");
		}
	};

	const showGroups = () => show("Groups", mapRef.current?.getAllGroups() ?? {});

	const deleteGroup = () => {
		if (groupId) {
			mapRef.current?.deleteGroup(groupId, false);
			setGroupId(null);
			flash("Deleted the group (its objects were kept).");
		}
	};

	// ---- Selection & state -----------------------------------------------

	const showSelection = () => show("Selected objects", mapRef.current?.getSelectedObjects() ?? null);

	const clearSelection = () => {
		mapRef.current?.clearAllSelectedObjects();
		flash("Cleared the selection.");
	};

	const showMapState = () => show("Map state", mapRef.current?.getMapState() ?? null);

	const showVisibleArea = () =>
		show("Visible coordinates", mapRef.current?.getVisibleMapCoordinates() ?? null);

	// ---- Events ----------------------------------------------------------

	const onSelectionChange = (selection: BlueOrangeMapSelectedObjects) =>
		flash("Selection changed: " + summarise(selection));

	const onObjectsCreated = (selection: BlueOrangeMapSelectedObjects) =>
		flash("Drew: " + summarise(selection));

	const onObjectsDeleted = (selection: BlueOrangeMapSelectedObjects) =>
		flash("Deleted: " + summarise(selection));

	const onGroupCreated = (createdGroupId: string) => {
		setGroupId(createdGroupId);
		flash("Group created from the toolbar: " + createdGroupId);
	};

	const onGroupRemoved = (groupIds: Array<string>) => {
		setGroupId(null);
		flash("Ungrouped: " + groupIds.join(", "));
	};

	return (
		<div className="workspace-main-window">
			<div className="workspace-map-pane">
				<BlueOrangeMapWrapper
					ref={mapRef}
					markers={MARKERS}
					shapes={SHAPES}
					tracks={TRACKS}
					options={{center: [CENTRE.lat, CENTRE.lng], zoom: 14}}
					onSelectionChange={onSelectionChange}
					onObjectsCreated={onObjectsCreated}
					onObjectsDeleted={onObjectsDeleted}
					onGroupCreated={onGroupCreated}
					onGroupRemoved={onGroupRemoved}
				/>
			</div>

			<div className="workspace-control-pane">
				<h2 className="workspace-title">Map — feature demo</h2>
				{status && <div className="workspace-status">{status}</div>}

				<section className="workspace-section">
					<h3>Arcs &amp; arrows <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={addArcs}>Add arcs</button>
						<button onClick={addArrows}>Add arrows</button>
					</div>
					<p className="workspace-hint">createArc() draws a sector, ring or plain arc; createArrow() draws a shaft-and-head polygon. Both return the shape they created.</p>
				</section>

				<section className="workspace-section">
					<h3>Groups <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={buildGroup}>Build a group</button>
						<button onClick={selectGroup} disabled={!groupId}>Select group</button>
						<button onClick={showGroups}>List groups</button>
						<button onClick={deleteGroup} disabled={!groupId}>Delete group</button>
					</div>
					<p className="workspace-hint">Grouped objects select and delete together. The toolbar's group / ungroup controls do the same thing from the map, and report back through onGroupCreated / onGroupRemoved.</p>
				</section>

				<section className="workspace-section">
					<h3>Selection</h3>
					<div className="workspace-btn-row">
						<button onClick={showSelection}>Selected objects</button>
						<button onClick={clearSelection}>Clear selection</button>
					</div>
					<p className="workspace-hint">Shift+drag on the map to box-select. Backspace deletes the selection.</p>
				</section>

				<section className="workspace-section">
					<h3>State</h3>
					<div className="workspace-btn-row">
						<button onClick={showMapState}>Map state</button>
						<button onClick={showVisibleArea}>Visible area</button>
					</div>
				</section>

				<section className="workspace-section">
					<h3>{outputTitle}</h3>
					<pre className="workspace-output">{output || "—"}</pre>
				</section>
			</div>
		</div>
	)
}
