import React, {useEffect, useRef} from "react";

import './BlueOrangeMapWrapper.css'

import { BlueOrangeMap } from '@blue-orange-ai/primitives-map'

import '@blue-orange-ai/primitives-map/dist/css/primitives-map.min.css'

import {
	BlueOrangeMapColors,
	BlueOrangeMapDefaultMarker,
	BlueOrangeMapGroup,
	BlueOrangeMapMarker,
	BlueOrangeMapOptions,
	BlueOrangeMapSelectedObjects,
	BlueOrangeMapShape,
	BlueOrangeMapState,
	BlueOrangeMapTrack
} from "@blue-orange-ai/primitives-map";

interface Props {
	markers?: Array<BlueOrangeMapMarker>,
	shapes?: Array<BlueOrangeMapShape>,
	tracks?: Array<BlueOrangeMapTrack>,
	colors?: BlueOrangeMapColors,
	defaultMarker?: BlueOrangeMapDefaultMarker,
	options?: BlueOrangeMapOptions,
	instance?: (map: BlueOrangeMap) => void,
	/** Fired whenever the selected markers / shapes / tracks change. */
	selectionChanged?: (selection: BlueOrangeMapSelectedObjects) => void,
	/** Fired when the user finishes drawing objects with the map controls. */
	objectsCreated?: (selection: BlueOrangeMapSelectedObjects, mapState: BlueOrangeMapState) => void,
	/** Fired when the user deletes the selected objects. */
	objectsDeleted?: (selection: BlueOrangeMapSelectedObjects) => void,
	groupCreated?: (groupId: string, group: BlueOrangeMapGroup | undefined) => void,
	groupRemoved?: (groupIds: Array<string>) => void
}

export const BlueOrangeMapWrapper: React.FC<Props> = (props) => {

	const {markers=[], shapes=[], tracks=[], colors, defaultMarker, options, instance} = props;

	const mapRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeMapRef = useRef<BlueOrangeMap | null>(null);

	// Event listeners are registered once, so they read the callbacks through a
	// ref to always call the latest props rather than the ones captured on mount.
	const propsRef = useRef<Props>(props);
	propsRef.current = props;

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
				if (propsRef.current.selectionChanged) {
					propsRef.current.selectionChanged(selection);
				}
			})
			current.addEventListener("blueorangemapobjectscreatedbyuser", (ev: any) => {
				const selection: BlueOrangeMapSelectedObjects = ev.detail.selection;
				const mapState: BlueOrangeMapState = ev.detail.mapState;
				if (propsRef.current.objectsCreated) {
					propsRef.current.objectsCreated(selection, mapState);
				}
			})
			current.addEventListener("blueorangemapobjectsdeleted", (ev: any) => {
				const selection: BlueOrangeMapSelectedObjects = ev.detail.selection;
				if (propsRef.current.objectsDeleted) {
					propsRef.current.objectsDeleted(selection);
				}
			})
			current.addEventListener("blueorangemapgroupcreated", (ev: any) => {
				const groupId: string = ev.detail.groupId;
				const group: BlueOrangeMapGroup | undefined = ev.detail.group;
				if (propsRef.current.groupCreated) {
					propsRef.current.groupCreated(groupId, group);
				}
			})
			current.addEventListener("blueorangemapgroupremoved", (ev: any) => {
				const groupIds: Array<string> = ev.detail.groupIds;
				if (propsRef.current.groupRemoved) {
					propsRef.current.groupRemoved(groupIds);
				}
			})
		}
	}, []);


	return (
		<div ref={mapRef} className="blue-orange-map-parent"></div>
	)
}
