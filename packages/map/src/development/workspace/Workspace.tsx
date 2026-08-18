import React, {useCallback, useRef, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Workspace.css'
import {BlueOrangeMapWrapper} from "../../components/map/BlueOrangeMapWrapper";
import {
	BlueOrangeMap,
	BlueOrangeMapMarker,
	BlueOrangeMapOptions,
	BlueOrangeMapShape,
	BlueOrangeMapTrack
} from "@blue-orange-ai/primitives-map";

interface Props {
}

const pin = (colour: string) => (
	'<i class="ri-map-pin-2-fill workspace-map-pin" style="color: ' + colour + ';"></i>'
);

const marker = (id: string, lat: number, lng: number, colour: string, popupHtml: string): BlueOrangeMapMarker => ({
	id: id,
	latlng: {lat: lat, lng: lng},
	html: pin(colour),
	size: [30, 30],
	anchor: [15, 30],
	popup: {display: true, html: popupHtml}
});

const initialMarkers: Array<BlueOrangeMapMarker> = [
	marker("hq", 51.5074, -0.1278, "#2563eb", "<strong>London HQ</strong><br/>Trafalgar Square"),
	marker("dc", 51.5238, -0.0846, "#16a34a", "<strong>Data centre</strong><br/>Shoreditch"),
	marker("lab", 51.4993, -0.1770, "#ea580c", "<strong>Research lab</strong><br/>South Kensington")
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

const initialTracks: Array<BlueOrangeMapTrack> = [
	{
		id: "courier-1",
		type: "courier",
		latlng: {lat: 51.5033, lng: -0.1196},
		marker: {
			id: "courier-1-marker",
			latlng: {lat: 51.5033, lng: -0.1196},
			html: '<i class="ri-truck-fill workspace-map-pin" style="color: #0f172a;"></i>',
			size: [28, 28],
			anchor: [14, 14],
			popup: {display: true, html: "<strong>Courier 1</strong><br/>Delivery route"}
		},
		display: {trackLines: true},
		trackline: {color: "#0f172a", weight: 3, opacity: 0.7},
		observations: [
			{id: "o1", timestamp: new Date(Date.now() - 3 * 3600_000), lat: 51.4941, lng: -0.1740, data: {}},
			{id: "o2", timestamp: new Date(Date.now() - 2 * 3600_000), lat: 51.4975, lng: -0.1520, data: {}},
			{id: "o3", timestamp: new Date(Date.now() - 1 * 3600_000), lat: 51.5007, lng: -0.1340, data: {}},
			{id: "o4", timestamp: new Date(), lat: 51.5033, lng: -0.1196, data: {}}
		]
	}
];

const options: BlueOrangeMapOptions = {
	center: [51.5104, -0.1140],
	zoom: 13,
	shapePopups: {enabled: true}
};

interface LogEntry {
	id: number,
	time: string,
	text: string
}

export const Workspace: React.FC<Props> = ({}) => {

	const mapRef = useRef<BlueOrangeMap | null>(null);

	const [entries, setEntries] = useState<Array<LogEntry>>([]);

	const log = useCallback((text: string) => {
		setEntries((previous) => [
			{id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), text: text},
			...previous
		].slice(0, 100));
	}, []);

	const withMap = (action: (map: BlueOrangeMap) => void) => {
		if (mapRef.current) {
			action(mapRef.current);
		}
	}

	const describeSelection = (selection: {markers: Array<any>, shapes: Array<any>, tracks: Array<any>}) => (
		selection.markers.length + " markers, " + selection.shapes.length + " shapes, " + selection.tracks.length + " tracks"
	);

	return (

		<div className="workspace-main-window">
			<div className="workspace-display-window">
				<BlueOrangeMapWrapper
					markers={initialMarkers}
					shapes={initialShapes}
					tracks={initialTracks}
					options={options}
					instance={(map) => mapRef.current = map}
					selectionChanged={(selection) => log("selectionChanged: " + describeSelection(selection))}
					objectsCreated={(selection) => log("objectsCreated: " + describeSelection(selection))}
					objectsDeleted={(selection) => log("objectsDeleted: " + describeSelection(selection))}
					groupCreated={(groupId) => log("groupCreated: " + groupId)}
					groupRemoved={(groupIds) => log("groupRemoved: " + groupIds.join(", "))} />
			</div>
			<div className="workspace-sidebar">
				<div className="workspace-controls">
					<strong>Markers & shapes</strong>
					<button onClick={() => withMap((map) => {
						const id = uuidv4();
						map.addMarker(marker(id, 51.5000 + Math.random() * 0.03, -0.16 + Math.random() * 0.08,
							"#db2777", "<strong>Ad-hoc marker</strong>"));
						log("addMarker -> " + id.slice(0, 8));
					})}>Add random marker</button>
					<button onClick={() => withMap((map) => {
						map.addShape({
							id: uuidv4(), type: "polygon",
							points: [
								{lat: 51.4890, lng: -0.1300}, {lat: 51.4930, lng: -0.1180},
								{lat: 51.4870, lng: -0.1120}, {lat: 51.4840, lng: -0.1250}
							],
							color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.2, tooltip: "New zone"
						});
						log("addShape: polygon");
					})}>Add polygon</button>
					<button onClick={() => withMap((map) => {
						map.createArc({
							center: {lat: 51.5238, lng: -0.0846}, radius: 700,
							startAngle: 300, endAngle: 60, arcType: "sector",
							color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.15,
							tooltip: "DC antenna sector"
						});
						log("createArc: sector at data centre");
					})}>Create arc (sector)</button>
					<button onClick={() => withMap((map) => {
						map.createArrow({
							base: {lat: 51.4993, lng: -0.1770}, angle: 45, length: 1800,
							color: "#0891b2", fillColor: "#0891b2", fillOpacity: 0.5,
							tooltip: "Prevailing wind"
						});
						log("createArrow: from research lab");
					})}>Create arrow</button>

					<strong>Selection & groups</strong>
					<button onClick={() => withMap((map) => {
						const selection = map.getSelectedObjects();
						const count = selection.markers.length + selection.shapes.length + selection.tracks.length;
						if (count === 0) {
							log("nothing selected — click objects (shift-click for multiple) first");
							return;
						}
						const groupId = map.createGroup(null, "demo-group");
						selection.markers.forEach((m) => map.addMarkerToGroup(m.id, groupId));
						selection.shapes.forEach((s) => map.addShapeToGroup(s.id, groupId));
						selection.tracks.forEach((t) => map.addTrackToGroup(t.id, groupId));
						log("createGroup -> " + groupId + " (" + count + " objects)");
					})}>Group selection</button>
					<button onClick={() => withMap((map) => map.removeSelectedObjects())}>Delete selection</button>
					<button onClick={() => withMap((map) => map.clearAllSelectedObjects())}>Clear selection</button>

					<strong>Map</strong>
					<button onClick={() => withMap((map) => {
						map.changeBaseLayer({
							name: "carto-dark",
							url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
							attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
						});
						log("changeBaseLayer: carto dark");
					})}>Base layer: dark</button>
					<button onClick={() => withMap((map) => {
						map.changeBaseLayer({
							name: "osm",
							url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
							attribution: "&copy; OpenStreetMap contributors"
						});
						log("changeBaseLayer: osm");
					})}>Base layer: OSM</button>
					<button onClick={() => withMap((map) => {
						console.log("map.getMapState()", map.getMapState());
						const state = map.getMapState();
						log("getMapState: zoom " + state.zoom + ", " + state.markers.length + " markers, "
							+ state.shapes.length + " shapes, " + state.tracks.length + " tracks (full state in console)");
					})}>Print map state</button>

					<div className="workspace-hints">
						<div>• Use the on-map controls to draw shapes, group and delete objects</div>
						<div>• Click a marker for its popup; click shapes / tracks to select them</div>
						<div>• The courier track draws its observation history as a track line</div>
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
