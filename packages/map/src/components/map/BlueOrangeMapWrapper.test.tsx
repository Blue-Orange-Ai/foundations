import React from "react";
import {render} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {BlueOrangeMap, BlueOrangeMapMarker, BlueOrangeMapTrack} from "@blue-orange-ai/primitives-map";

import {BlueOrangeMapWrapper} from "./BlueOrangeMapWrapper";
import {createMapMarker, mapMarkerIcon} from "../map-markers/utils/MapMarkerHtml";
import {FixedMarker} from "../map-markers/fixedmarker/FixedMarker";

const mapElement = (container: HTMLElement) => container.querySelector(".blue-orange-map-parent") as HTMLElement;

const marker = (id: string, lat: number): BlueOrangeMapMarker => createMapMarker({
	id: id,
	latlng: {lat: lat, lng: -0.1278},
	element: <FixedMarker size="medium" label={id} />
});

const track = (id: string, lat: number): BlueOrangeMapTrack => ({
	id: id,
	type: "fixed",
	latlng: {lat: lat, lng: -0.1278},
	marker: {
		id: id + "-marker",
		latlng: {lat: lat, lng: -0.1278},
		...mapMarkerIcon(<FixedMarker size="medium" label={id} />, {anchorMode: "bottom-center"})
	},
	display: {trackLines: false},
	trackline: {color: "#2563eb", weight: 3, opacity: 0.6},
	observations: []
});

const selected = (element: HTMLElement, id: string) => {
	const icons = Array.from(element.querySelectorAll(".blue-orange-default-marker"));
	return icons.filter((icon) => icon.textContent?.includes(id))
		.some((icon) => icon.classList.contains("blue-orange-default-marker-active"));
}

describe("BlueOrangeMapWrapper", () => {

	it("outlines the selection by default", () => {
		const {container} = render(<BlueOrangeMapWrapper />);
		expect(mapElement(container).classList.contains("blue-orange-map-no-selection-outline")).toBe(false);
	});

	it("marks the map when the outline is turned off", () => {
		const {container} = render(<BlueOrangeMapWrapper selectionOutline={false} />);
		expect(mapElement(container).classList.contains("blue-orange-map-no-selection-outline")).toBe(true);
	});

	it("keeps the classes the map put on the element itself when the outline is toggled", () => {
		const {container, rerender} = render(<BlueOrangeMapWrapper />);
		const element = mapElement(container);
		// Leaflet hangs its own classes on this element after it takes it over,
		// and the overflow the map is clipped by comes off one of them.
		expect(element.classList.contains("leaflet-container")).toBe(true);
		rerender(<BlueOrangeMapWrapper selectionOutline={false} />);
		expect(element.classList.contains("leaflet-container")).toBe(true);
		expect(element.classList.contains("blue-orange-map-no-selection-outline")).toBe(true);
	});

	it("keeps a moving marker outlined once it has been selected", () => {
		var map: BlueOrangeMap | null = null;
		const {container} = render(
			<BlueOrangeMapWrapper markers={[marker("depot", 51.5074)]} instance={(value) => {map = value}} />
		);
		const element = mapElement(container);
		map!.selectMarker(map!.getMarker("depot")!);
		expect(selected(element, "depot")).toBe(true);
		map!.updateMarker(marker("depot", 51.5090));
		expect(selected(element, "depot")).toBe(true);
	});

	it("keeps a moving track outlined once it has been selected", () => {
		var map: BlueOrangeMap | null = null;
		const {container} = render(
			<BlueOrangeMapWrapper tracks={[track("van", 51.5074)]} instance={(value) => {map = value}} />
		);
		const element = mapElement(container);
		map!.selectTrack(map!.getTrack("van")!);
		expect(selected(element, "van")).toBe(true);
		map!.updateTrack(track("van", 51.5090));
		expect(selected(element, "van")).toBe(true);
	});

	const iconOf = (container: HTMLElement, id: string) => (
		Array.from(container.querySelectorAll(".blue-orange-default-marker"))
			.find((icon) => icon.textContent?.includes(id)) as HTMLElement
	);

	const clickIcon = async (icon: HTMLElement, modifiers: MouseEventInit = {}) => {
		icon.dispatchEvent(new MouseEvent("click", {bubbles: true, cancelable: true, ...modifiers}));
		// The wrapper reads the selection back once the click has unwound.
		await Promise.resolve();
	}

	it("reports one selection when a second marker is clicked on its own", async () => {
		const selectionChanged = vi.fn();
		const {container} = render(
			<BlueOrangeMapWrapper
				markers={[marker("alpha", 51.5074), marker("beta", 51.5238)]}
				selectionChanged={selectionChanged} />
		);
		await clickIcon(iconOf(container, "alpha"));
		await clickIcon(iconOf(container, "beta"));
		const reported = selectionChanged.mock.calls[selectionChanged.mock.calls.length - 1][0];
		expect(reported.markers.map((item: BlueOrangeMapMarker) => item.id)).toEqual(["beta"]);
	});

	it("adds to the selection on a shift click", async () => {
		const selectionChanged = vi.fn();
		const {container} = render(
			<BlueOrangeMapWrapper
				markers={[marker("alpha", 51.5074), marker("beta", 51.5238)]}
				selectionChanged={selectionChanged} />
		);
		await clickIcon(iconOf(container, "alpha"));
		await clickIcon(iconOf(container, "beta"), {shiftKey: true});
		const reported = selectionChanged.mock.calls[selectionChanged.mock.calls.length - 1][0];
		expect(reported.markers.map((item: BlueOrangeMapMarker) => item.id).sort()).toEqual(["alpha", "beta"]);
	});

	it("adds to the selection on a command click", async () => {
		const selectionChanged = vi.fn();
		const {container} = render(
			<BlueOrangeMapWrapper
				markers={[marker("alpha", 51.5074), marker("beta", 51.5238)]}
				selectionChanged={selectionChanged} />
		);
		const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
		await clickIcon(iconOf(container, "alpha"));
		await clickIcon(iconOf(container, "beta"), mac ? {metaKey: true} : {ctrlKey: true});
		const reported = selectionChanged.mock.calls[selectionChanged.mock.calls.length - 1][0];
		expect(reported.markers.map((item: BlueOrangeMapMarker) => item.id).sort()).toEqual(["alpha", "beta"]);
	});

	it("leaves an unselected marker alone when it moves", () => {
		var map: BlueOrangeMap | null = null;
		const {container} = render(
			<BlueOrangeMapWrapper markers={[marker("depot", 51.5074)]} instance={(value) => {map = value}} />
		);
		const element = mapElement(container);
		map!.updateMarker(marker("depot", 51.5090));
		expect(selected(element, "depot")).toBe(false);
	});
});
