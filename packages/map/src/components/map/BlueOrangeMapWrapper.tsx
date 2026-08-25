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
	/**
	 * Whether selected markers and tracks are outlined. The outline is kept
	 * through updates either way, so an object that is moving carries the same
	 * outline as one standing still; this only decides whether that outline is
	 * drawn at all. Shapes are not affected — the map recolours those itself.
	 */
	selectionOutline?: boolean,
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

	const {markers=[], shapes=[], tracks=[], colors, defaultMarker, options, selectionOutline=true, instance} = props;

	const mapRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeMapRef = useRef<BlueOrangeMap | null>(null);

	// Event listeners are registered once, so they read the callbacks through a
	// ref to always call the latest props rather than the ones captured on mount.
	const propsRef = useRef<Props>(props);
	propsRef.current = props;

	/**
	 * The map hangs the selection outline on a class it adds to the icon element
	 * of the selected object. Moving a marker or a track rebuilds that element
	 * from the marker's own class name, so the outline is dropped while the map
	 * still holds the object as selected — a marker that is being driven around
	 * flickers its outline off and never gets it back.
	 *
	 * The two update calls are wrapped so anything that was selected going in is
	 * selected again coming out, which puts the class back on the element that
	 * replaced it. Whether the object was selected is read before the update
	 * rather than after: an update that changes a marker's layer is served by
	 * taking the marker off the map and putting it back, and that drops the
	 * selection on the way through.
	 *
	 * The class goes back on whether or not the outline is being drawn, so that
	 * selectionOutline is the only thing deciding what is visible.
	 */
	const keepSelectionOutline = (map: BlueOrangeMap) => {
		// Flagged on the map rather than in a ref so the wrapping survives being
		// asked for twice and is never applied twice to the same instance —
		// including on a hot reload, where the effect runs again against the map
		// that is already up.
		const flagged = map as unknown as {_foundationsSelectionOutline?: boolean};
		if (flagged._foundationsSelectionOutline) {
			return;
		}
		flagged._foundationsSelectionOutline = true;

		const updateMarker = map.updateMarker.bind(map);
		map.updateMarker = (marker: BlueOrangeMapMarker) => {
			const wasSelected = map.getSelectedObjects().markers.some((item) => item.id === marker.id);
			updateMarker(marker);
			if (wasSelected) {
				// An object whose layer is hidden has no element to mark up. The
				// outline is cosmetic, so a miss is not worth failing the update
				// that has already gone through.
				try {
					map.selectMarker(marker);
				} catch (error) {}
			}
		};

		const updateTrack = map.updateTrack.bind(map);
		map.updateTrack = (track: BlueOrangeMapTrack) => {
			const wasSelected = map.getSelectedObjects().tracks.some((item) => item.id === track.id);
			updateTrack(track);
			if (!wasSelected) {
				return;
			}
			try {
				// Selection track lines are added rather than replaced, so they
				// come down before they go back up — otherwise every update
				// leaves another copy of them on the map.
				if (track.display && track.display.trackLinesOnSelection) {
					map.unselectTrack(track);
				}
				map.selectTrack(track);
			} catch (error) {}
		};
	}

	useEffect(() => {
		const current = mapRef.current as HTMLElement;
		// Outside the block below: on a hot reload the map is already up, and the
		// wrapping has to be put back on the instance that is running rather
		// than only on one built from scratch.
		if (blueOrangeMapRef.current != null) {
			keepSelectionOutline(blueOrangeMapRef.current);
		}
		if (blueOrangeMapRef.current == null) {
			blueOrangeMapRef.current = new BlueOrangeMap(
				current,
				markers,
				shapes,
				tracks,
				colors,
				defaultMarker,
				options);
			keepSelectionOutline(blueOrangeMapRef.current);
			readCommandClickAsAdditive(current);
			if (instance) {
				instance(blueOrangeMapRef.current)
			}
			current.addEventListener("blueorangemapselectionchange", () => {
				// Read once the click that raised this has finished rather than
				// off the event. The map announces the selection from the middle
				// of its click handler: a plain click on a second marker adds it,
				// announces both, and only then drops the first — with nothing
				// raised to say so. Taken off the event, a second click looks
				// like a two object selection when the map holds one.
				queueMicrotask(() => {
					const map = blueOrangeMapRef.current;
					if (map && propsRef.current.selectionChanged) {
						propsRef.current.selectionChanged(map.getSelectedObjects());
					}
				});
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


	/**
	 * The map adds to a selection on a shift click and replaces it otherwise.
	 * Command click on a mac — control click elsewhere — is the other gesture
	 * people reach for, so it is turned into the one the map already knows: the
	 * modifier is read here, ahead of the map's own handlers, and the event is
	 * handed on as though shift were down.
	 */
	const additiveModifier = (event: MouseEvent) => {
		const platform = typeof navigator === "undefined"
			? ""
			: (navigator.platform || navigator.userAgent || "");
		return /Mac|iPhone|iPad/.test(platform) ? event.metaKey : event.ctrlKey;
	}

	const readCommandClickAsAdditive = (element: HTMLElement) => {
		element.addEventListener("click", (event: MouseEvent) => {
			if (event.shiftKey || !additiveModifier(event)) {
				return;
			}
			try {
				Object.defineProperty(event, "shiftKey", {get: () => true, configurable: true});
			} catch (error) {}
		}, true);
	}

	/**
	 * Toggled on the element rather than rendered into className. Leaflet adds
	 * its own classes to this div once it takes it over, and React owning the
	 * attribute would wipe them — along with the overflow the map is clipped by
	 * — the moment the prop changed.
	 */
	useEffect(() => {
		const current = mapRef.current;
		if (current) {
			current.classList.toggle("blue-orange-map-no-selection-outline", !selectionOutline);
		}
	}, [selectionOutline]);

	return (
		<div ref={mapRef} className="blue-orange-map-parent"></div>
	)
}
