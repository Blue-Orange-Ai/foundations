import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react";

import './BlueOrangeMapWrapper.css'

import { BlueOrangeMap } from '@blue-orange-ai/primitives-map'

import '@blue-orange-ai/primitives-map/dist/css/primitives-map.min.css'

import type {
	BlueOrangeMapColors,
	BlueOrangeMapCreateArcOptions,
	BlueOrangeMapCreateArrowOptions,
	BlueOrangeMapDefaultMarker,
	BlueOrangeMapGroup,
	BlueOrangeMapGroupObjects,
	BlueOrangeMapLayer,
	BlueOrangeMapMarker,
	BlueOrangeMapOptions,
	BlueOrangeMapSelectedObjects,
	BlueOrangeMapShape,
	BlueOrangeMapState,
	BlueOrangeMapTrack,
	BlueOrangeMapVisibleCoordinates
} from "@blue-orange-ai/primitives-map";

/**
 * The imperative surface of the underlying BlueOrangeMap. The map owns its own
 * Leaflet state, so everything after construction is driven through here rather
 * than by re-rendering: markers, shapes, tracks, arcs, arrows, groups,
 * selection and layers.
 */
export interface BlueOrangeMapHandle {
	getMap: () => BlueOrangeMap | null,

	// Viewport & state
	getVisibleMapCoordinates: () => BlueOrangeMapVisibleCoordinates | null,
	getMapState: () => BlueOrangeMapState | null,

	// Layers
	changeBaseLayer: (layer: BlueOrangeMapLayer) => void,
	updateOverlayLayer: (layer?: BlueOrangeMapLayer) => void,
	addLayer: (layerName: string, visible?: boolean) => void,
	removeLayer: (id: string) => void,

	// Markers
	addMarker: (marker: BlueOrangeMapMarker, save?: boolean) => void,
	getMarker: (id: string) => BlueOrangeMapMarker | undefined,
	updateMarker: (marker: BlueOrangeMapMarker) => void,
	removeMarker: (id: string) => void,

	// Shapes
	addShape: (shape: BlueOrangeMapShape, save?: boolean) => void,
	getShape: (id: string) => BlueOrangeMapShape | undefined,
	updateShape: (shape: BlueOrangeMapShape) => void,
	removeShape: (id: string) => void,

	// Tracks
	addTrack: (track: BlueOrangeMapTrack, save?: boolean) => void,
	getTrack: (id: string) => BlueOrangeMapTrack | undefined,
	updateTrack: (track: BlueOrangeMapTrack) => void,
	removeTrack: (id: string) => void,

	// Arcs & arrows (primitives >= 0.56.1)
	createArc: (options: BlueOrangeMapCreateArcOptions) => BlueOrangeMapShape | null,
	updateArc: (id: string, options: BlueOrangeMapCreateArcOptions) => BlueOrangeMapShape | null,
	createArrow: (options: BlueOrangeMapCreateArrowOptions) => BlueOrangeMapShape | null,
	updateArrow: (id: string, options: BlueOrangeMapCreateArrowOptions) => BlueOrangeMapShape | null,

	// Groups (primitives >= 0.56.1) — objects that select and move together.
	createGroup: (groupId?: string | null, name?: string | null) => string | null,
	getGroup: (groupId: string) => BlueOrangeMapGroup | undefined,
	getAllGroups: () => { [groupId: string]: BlueOrangeMapGroup },
	getGroupObjects: (groupId: string) => BlueOrangeMapGroupObjects | null,
	addMarkerToGroup: (markerId: string, groupId: string) => boolean,
	addShapeToGroup: (shapeId: string, groupId: string) => boolean,
	addTrackToGroup: (trackId: string, groupId: string) => boolean,
	removeMarkerFromGroup: (markerId: string) => boolean,
	removeShapeFromGroup: (shapeId: string) => boolean,
	removeTrackFromGroup: (trackId: string) => boolean,
	selectGroup: (groupId: string) => void,
	unselectGroup: (groupId: string) => void,
	deleteGroup: (groupId: string, removeObjects?: boolean) => void,

	// Selection
	selectShape: (shape: BlueOrangeMapShape) => void,
	unselectShape: (shape: BlueOrangeMapShape) => void,
	selectMarker: (marker: BlueOrangeMapMarker) => void,
	unselectMarker: (marker: BlueOrangeMapMarker) => void,
	selectTrack: (track: BlueOrangeMapTrack) => void,
	unselectTrack: (track: BlueOrangeMapTrack) => void,
	clearAllSelectedObjects: (exclusions?: Array<string>) => void,
	removeSelectedObjects: () => void,
	getSelectedObjects: () => BlueOrangeMapSelectedObjects | null,
}

export interface BlueOrangeMapWrapperProps {
	/** Seeded onto the map at construction. Add more later through the handle. */
	markers?: Array<BlueOrangeMapMarker>,
	shapes?: Array<BlueOrangeMapShape>,
	tracks?: Array<BlueOrangeMapTrack>,
	/** Per-shape-kind colours for the selecting / drawing / error / active states. */
	colors?: BlueOrangeMapColors,
	/** Icon used for markers drawn by the user with the marker tool. */
	defaultMarker?: BlueOrangeMapDefaultMarker,
	/** Centre, zoom, base layer, control set and shape popups. */
	options?: BlueOrangeMapOptions,
	/** Hands back the raw map instance once it exists. */
	instance?: (map: BlueOrangeMap) => void,
	/** Fires whenever the set of selected objects changes, including on clear. */
	onSelectionChange?: (selection: BlueOrangeMapSelectedObjects) => void,
	/** Fires when the user finishes drawing a shape or marker with the toolbar. */
	onObjectsCreated?: (selection: BlueOrangeMapSelectedObjects, mapState: BlueOrangeMapState) => void,
	/** Fires just before the selected objects are removed (Backspace or the delete control). */
	onObjectsDeleted?: (selection: BlueOrangeMapSelectedObjects) => void,
	/** Fires when the user groups the current selection with the group control. */
	onGroupCreated?: (groupId: string, group: BlueOrangeMapGroup | undefined) => void,
	/** Fires when the user ungroups the current selection. */
	onGroupRemoved?: (groupIds: Array<string>) => void,
}

export const BlueOrangeMapWrapper = forwardRef<BlueOrangeMapHandle, BlueOrangeMapWrapperProps>((props, ref) => {

	const {markers = [], shapes = [], tracks = [], colors, defaultMarker, options, instance} = props;

	const mapRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeMapRef = useRef<BlueOrangeMap | null>(null);

	// Listeners are registered once, so they read the callbacks through a ref to
	// always call the latest props rather than the ones captured on mount.
	const propsRef = useRef<BlueOrangeMapWrapperProps>(props);
	propsRef.current = props;

	useImperativeHandle(ref, () => ({
		getMap: () => blueOrangeMapRef.current,

		getVisibleMapCoordinates: () => blueOrangeMapRef.current?.getVisibleMapCoordinates() ?? null,
		getMapState: () => blueOrangeMapRef.current?.getMapState() ?? null,

		changeBaseLayer: (layer: BlueOrangeMapLayer) => blueOrangeMapRef.current?.changeBaseLayer(layer),
		updateOverlayLayer: (layer?: BlueOrangeMapLayer) => blueOrangeMapRef.current?.updateOverlayLayer(layer),
		addLayer: (layerName: string, visible?: boolean) => blueOrangeMapRef.current?.addLayer(layerName, visible),
		removeLayer: (id: string) => blueOrangeMapRef.current?.removeLayer(id),

		addMarker: (marker: BlueOrangeMapMarker, save?: boolean) => blueOrangeMapRef.current?.addMarker(marker, save),
		getMarker: (id: string) => blueOrangeMapRef.current?.getMarker(id),
		updateMarker: (marker: BlueOrangeMapMarker) => blueOrangeMapRef.current?.updateMarker(marker),
		removeMarker: (id: string) => blueOrangeMapRef.current?.removeMarker(id),

		addShape: (shape: BlueOrangeMapShape, save?: boolean) => blueOrangeMapRef.current?.addShape(shape, save),
		getShape: (id: string) => blueOrangeMapRef.current?.getShape(id),
		updateShape: (shape: BlueOrangeMapShape) => blueOrangeMapRef.current?.updateShape(shape),
		removeShape: (id: string) => blueOrangeMapRef.current?.removeShape(id),

		addTrack: (track: BlueOrangeMapTrack, save?: boolean) => blueOrangeMapRef.current?.addTrack(track, save),
		getTrack: (id: string) => blueOrangeMapRef.current?.getTrack(id),
		updateTrack: (track: BlueOrangeMapTrack) => blueOrangeMapRef.current?.updateTrack(track),
		removeTrack: (id: string) => blueOrangeMapRef.current?.removeTrack(id),

		createArc: (arcOptions: BlueOrangeMapCreateArcOptions) =>
			blueOrangeMapRef.current?.createArc(arcOptions) ?? null,
		updateArc: (id: string, arcOptions: BlueOrangeMapCreateArcOptions) =>
			blueOrangeMapRef.current?.updateArc(id, arcOptions) ?? null,
		createArrow: (arrowOptions: BlueOrangeMapCreateArrowOptions) =>
			blueOrangeMapRef.current?.createArrow(arrowOptions) ?? null,
		updateArrow: (id: string, arrowOptions: BlueOrangeMapCreateArrowOptions) =>
			blueOrangeMapRef.current?.updateArrow(id, arrowOptions) ?? null,

		createGroup: (groupId?: string | null, name?: string | null) =>
			blueOrangeMapRef.current?.createGroup(groupId, name) ?? null,
		getGroup: (groupId: string) => blueOrangeMapRef.current?.getGroup(groupId),
		getAllGroups: () => blueOrangeMapRef.current?.getAllGroups() ?? {},
		getGroupObjects: (groupId: string) => blueOrangeMapRef.current?.getGroupObjects(groupId) ?? null,
		addMarkerToGroup: (markerId: string, groupId: string) =>
			blueOrangeMapRef.current?.addMarkerToGroup(markerId, groupId) ?? false,
		addShapeToGroup: (shapeId: string, groupId: string) =>
			blueOrangeMapRef.current?.addShapeToGroup(shapeId, groupId) ?? false,
		addTrackToGroup: (trackId: string, groupId: string) =>
			blueOrangeMapRef.current?.addTrackToGroup(trackId, groupId) ?? false,
		removeMarkerFromGroup: (markerId: string) =>
			blueOrangeMapRef.current?.removeMarkerFromGroup(markerId) ?? false,
		removeShapeFromGroup: (shapeId: string) =>
			blueOrangeMapRef.current?.removeShapeFromGroup(shapeId) ?? false,
		removeTrackFromGroup: (trackId: string) =>
			blueOrangeMapRef.current?.removeTrackFromGroup(trackId) ?? false,
		selectGroup: (groupId: string) => blueOrangeMapRef.current?.selectGroup(groupId),
		unselectGroup: (groupId: string) => blueOrangeMapRef.current?.unselectGroup(groupId),
		deleteGroup: (groupId: string, removeObjects?: boolean) =>
			blueOrangeMapRef.current?.deleteGroup(groupId, removeObjects),

		selectShape: (shape: BlueOrangeMapShape) => blueOrangeMapRef.current?.selectShape(shape),
		unselectShape: (shape: BlueOrangeMapShape) => blueOrangeMapRef.current?.unselectShape(shape),
		selectMarker: (marker: BlueOrangeMapMarker) => blueOrangeMapRef.current?.selectMarker(marker),
		unselectMarker: (marker: BlueOrangeMapMarker) => blueOrangeMapRef.current?.unselectMarker(marker),
		selectTrack: (track: BlueOrangeMapTrack) => blueOrangeMapRef.current?.selectTrack(track),
		unselectTrack: (track: BlueOrangeMapTrack) => blueOrangeMapRef.current?.unselectTrack(track),
		clearAllSelectedObjects: (exclusions?: Array<string>) =>
			blueOrangeMapRef.current?.clearAllSelectedObjects(exclusions),
		removeSelectedObjects: () => blueOrangeMapRef.current?.removeSelectedObjects(),
		getSelectedObjects: () => blueOrangeMapRef.current?.getSelectedObjects() ?? null,
	}));

	useEffect(() => {
		const current = mapRef.current as HTMLElement;
		if (blueOrangeMapRef.current == null) {
			blueOrangeMapRef.current = new BlueOrangeMap(
				current,
				markers,
				shapes,
				tracks,
				colors,
				defaultMarker,
				options);
			if (instance) {
				instance(blueOrangeMapRef.current)
			}
			current.addEventListener("blueorangemapselectionchange", (ev: any) => {
				const selection: BlueOrangeMapSelectedObjects = ev.detail.selection;
				if (propsRef.current.onSelectionChange) {
					propsRef.current.onSelectionChange(selection);
				}
			})
			current.addEventListener("blueorangemapobjectscreatedbyuser", (ev: any) => {
				const selection: BlueOrangeMapSelectedObjects = ev.detail.selection;
				const mapState: BlueOrangeMapState = ev.detail.mapState;
				if (propsRef.current.onObjectsCreated) {
					propsRef.current.onObjectsCreated(selection, mapState);
				}
			})
			current.addEventListener("blueorangemapobjectsdeleted", (ev: any) => {
				const selection: BlueOrangeMapSelectedObjects = ev.detail.selection;
				if (propsRef.current.onObjectsDeleted) {
					propsRef.current.onObjectsDeleted(selection);
				}
			})
			current.addEventListener("blueorangemapgroupcreated", (ev: any) => {
				const groupId: string = ev.detail.groupId;
				const group: BlueOrangeMapGroup | undefined = ev.detail.group;
				if (propsRef.current.onGroupCreated) {
					propsRef.current.onGroupCreated(groupId, group);
				}
			})
			current.addEventListener("blueorangemapgroupremoved", (ev: any) => {
				const groupIds: Array<string> = ev.detail.groupIds;
				if (propsRef.current.onGroupRemoved) {
					propsRef.current.onGroupRemoved(groupIds);
				}
			})
		}
	}, []);


	return (
		<div ref={mapRef} className="blue-orange-map-parent"></div>
	)
})
