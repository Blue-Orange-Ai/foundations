import React from "react";
import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";

import {FixedMarker} from "./fixedmarker/FixedMarker";
import {FloatingMarker} from "./floatingmarker/FloatingMarker";
import {FloatingRouteMarker} from "./floatingroutemarker/FloatingRouteMarker";
import {LocationPuck} from "./locationpuck/LocationPuck";
import {PinHead} from "./pinhead/PinHead";
import {createMapMarker, mapMarkerAnchorTransform, renderMapMarkerHtml} from "./utils/MapMarkerHtml";

const pinHead = (container: HTMLElement) => container.querySelector(".foundations-pin-head");
const needle = (container: HTMLElement) => container.querySelector(".foundations-map-marker-needle");
const badge = (container: HTMLElement) => container.querySelector(".foundations-map-marker-badge");

describe("FixedMarker", () => {

	it("draws a pin head on a needle", () => {
		const {container} = render(<FixedMarker label="Depot" needle="tall" />);
		expect(screen.getByText("Depot")).toBeTruthy();
		expect(pinHead(container)).toBeTruthy();
		expect((needle(container) as HTMLElement).style.height).toBe("20px");
	});

	it("carries the kind down to the pin head", () => {
		const {container} = render(<FixedMarker label="Depot" kind="negative" />);
		expect(container.querySelector(".foundations-map-marker-kind-negative")).toBeTruthy();
		// The head must not re-declare a kind of its own, or it would paint over
		// the one the marker resolved.
		expect(pinHead(container)!.closest(".foundations-map-marker-kind-default")).toBeNull();
	});

	it("refuses a needle on the dot sizes", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
		const {container} = render(<FixedMarker size="xx-small-circle" needle="tall" />);
		expect(needle(container)).toBeNull();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it("shows a label enhancer outside the head", () => {
		render(<FixedMarker label="Depot" labelEnhancerContent="Bermondsey" labelEnhancerPosition="bottom" />);
		expect(screen.getByText("Bermondsey")).toBeTruthy();
	});
});

describe("PinHead", () => {

	it("collapses to a circle for a single icon with no label", () => {
		const {container} = render(<PinHead size="medium" startEnhancer={<i className="ri-truck-fill" />} />);
		const head = pinHead(container) as HTMLElement;
		expect(head.classList.contains("foundations-pin-head-circle")).toBe(true);
		expect(head.style.width).toBe("36px");
	});

	it("hands the icon size to an enhancer component", () => {
		render(<PinHead size="large" label="A" startEnhancer={({size}) => <span>{"icon:" + size}</span>} />);
		expect(screen.getByText("icon:24")).toBeTruthy();
	});

	it("only renders a secondary label on the larger heads", () => {
		const {rerender} = render(<PinHead size="small" label="A" secondaryLabel="B" />);
		expect(screen.queryByText("B")).toBeNull();
		rerender(<PinHead size="medium" label="A" secondaryLabel="B" />);
		expect(screen.getByText("B")).toBeTruthy();
	});

	it("drops a badge that does not fit the head it was asked for", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
		const {container} = render(
			<PinHead size="large" label="A" badgeEnhancerSize="small" badgeEnhancerContent={<span>2</span>} />);
		expect(badge(container)).toBeNull();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it("places a badge that does fit", () => {
		const {container} = render(
			<PinHead size="medium" label="A" badgeEnhancerSize="small" badgeEnhancerContent={<span>2</span>} />);
		expect((badge(container) as HTMLElement).style.transform).toBe("translate(calc(100% + -10px), -4px)");
	});
});

describe("FloatingMarker", () => {

	it("is sized by its anchor dot, not by its head", () => {
		const {container} = render(<FloatingMarker label="Data centre" anchorType="circle" />);
		const root = container.querySelector(".foundations-floating-map-marker") as HTMLElement;
		expect(root.style.width).toBe("16px");
		expect(screen.getByText("Data centre")).toBeTruthy();
	});

	it("omits the anchor dot when it is anchored nowhere", () => {
		const {container} = render(<FloatingMarker label="Data centre" anchor="none" />);
		expect(container.querySelector(".foundations-floating-map-marker-anchor-container")).toBeNull();
	});
});

describe("FloatingRouteMarker", () => {

	it("points back at the leg it annotates", () => {
		const {container} = render(<FloatingRouteMarker label="12 min" secondaryLabel="to the depot" anchorPosition="top-center" />);
		expect(screen.getByText("12 min")).toBeTruthy();
		expect(container.querySelector(".foundations-floating-route-map-marker-pointer-top-center")).toBeTruthy();
	});
});

describe("LocationPuck", () => {

	it("rotates the heading indicator", () => {
		const {container} = render(<LocationPuck type="consumer" heading={90} confidenceRadius={100} />);
		const heading = container.querySelector(".foundations-location-puck-consumer-heading") as HTMLElement;
		expect(heading.style.transform).toBe("rotate(90deg) translateY(-16px)");
		const halo = container.querySelector(".foundations-location-puck-approximation") as HTMLElement;
		expect(halo.style.width).toBe("50px");
	});

	it("scales the earner core with its size", () => {
		const {container} = render(<LocationPuck type="earner" size="small" heading={0} />);
		const core = container.querySelector(".foundations-location-puck-earner-core") as HTMLElement;
		expect(core.style.transform).toBe("scale(0.5)");
	});
});

describe("map marker html", () => {

	it("hangs the marker off a zero sized anchor", () => {
		const html = renderMapMarkerHtml(<FixedMarker label="Depot" />);
		expect(html).toContain("foundations-map-marker-anchor");
		expect(html).toContain("translate(-50%, -100%)");
		expect(html).toContain("Depot");
	});

	it("offsets the marker from the point when asked", () => {
		expect(mapMarkerAnchorTransform("center")).toBe("translate(-50%, -50%)");
		expect(mapMarkerAnchorTransform("top-left", 8)).toBe("translate(8px, 8px)");
		expect(mapMarkerAnchorTransform("bottom-right", 8)).toBe("translate(calc(-100% - 8px), calc(-100% - 8px))");
	});

	it("builds a marker the map can take as is", () => {
		const marker = createMapMarker({
			id: "hq",
			latlng: {lat: 51.5074, lng: -0.1278},
			element: <FixedMarker label="Depot" />,
			popup: {display: true, html: "<strong>HQ</strong>"}
		});
		expect(marker.id).toBe("hq");
		expect(marker.size).toEqual([0, 0]);
		// The icon element carries a 2px border, so the anchor sits inside it.
		expect(marker.anchor).toEqual([2, 2]);
		expect(marker.popup!.html).toBe("<strong>HQ</strong>");
	});
});
