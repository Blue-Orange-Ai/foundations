import React from "react";
import {fireEvent, render} from "@testing-library/react";
import {DemoStage} from "./DemoStage";

/**
 * ButtonIcon renders its label as a tooltip rather than an accessible name, so
 * the control is found by the glyph it is showing.
 */
const control = (container: HTMLElement, icon: string): HTMLElement | null => {
	const glyph = container.querySelector("." + icon);
	return glyph ? glyph.parentElement : null;
};

/**
 * jsdom implements none of the fullscreen API, so it is stubbed here — which is
 * also what proves the stage leaves the control out when a browser cannot offer it.
 */
const stubFullscreen = () => {
	const requestFullscreen = vi.fn(function (this: Element) {
		(document as any).fullscreenElement = this;
		return Promise.resolve();
	});
	const exitFullscreen = vi.fn(() => {
		(document as any).fullscreenElement = null;
		return Promise.resolve();
	});
	(Element.prototype as any).requestFullscreen = requestFullscreen;
	(document as any).exitFullscreen = exitFullscreen;
	(document as any).fullscreenElement = null;
	return {requestFullscreen, exitFullscreen};
};

const clearFullscreen = () => {
	delete (Element.prototype as any).requestFullscreen;
	delete (document as any).exitFullscreen;
	delete (document as any).fullscreenElement;
};

describe("DemoStage full screen", () => {

	afterEach(() => {
		clearFullscreen();
	});

	it("leaves the control out where the browser has no full screen", () => {
		const {container} = render(<DemoStage><div>preview</div></DemoStage>);

		expect(control(container, "ri-fullscreen-line")).toBeNull();
	});

	it("takes the demo full screen and brings it back", () => {
		const {requestFullscreen, exitFullscreen} = stubFullscreen();
		const {container} = render(<DemoStage><div>preview</div></DemoStage>);
		const demo = container.querySelector(".blue-orange-docs-demo") as HTMLElement;

		fireEvent.click(control(container, "ri-fullscreen-line") as HTMLElement);
		expect(requestFullscreen).toHaveBeenCalledTimes(1);
		expect(document.fullscreenElement).toBe(demo);

		// the browser reports the change rather than the click, so the icon only
		// turns over once the document says the element is actually full screen
		fireEvent(document, new Event("fullscreenchange"));
		expect(control(container, "ri-fullscreen-exit-line")).not.toBeNull();

		fireEvent.click(control(container, "ri-fullscreen-exit-line") as HTMLElement);
		expect(exitFullscreen).toHaveBeenCalledTimes(1);

		fireEvent(document, new Event("fullscreenchange"));
		expect(control(container, "ri-fullscreen-line")).not.toBeNull();
	});

	it("turns the icon back over when full screen is left without the button", () => {
		stubFullscreen();
		const {container} = render(<DemoStage><div>preview</div></DemoStage>);

		fireEvent.click(control(container, "ri-fullscreen-line") as HTMLElement);
		fireEvent(document, new Event("fullscreenchange"));
		expect(control(container, "ri-fullscreen-exit-line")).not.toBeNull();

		// escape, or the browser leaving full screen on its own
		(document as any).fullscreenElement = null;
		fireEvent(document, new Event("fullscreenchange"));
		expect(control(container, "ri-fullscreen-line")).not.toBeNull();
	});

	it("keeps the viewport at the width it was given while full screen", () => {
		stubFullscreen();
		const {container} = render(<DemoStage width={375}><div>preview</div></DemoStage>);
		const viewport = () => container.querySelector(".blue-orange-docs-demo-viewport") as HTMLElement;

		expect(viewport().style.width).toEqual("375px");

		fireEvent.click(control(container, "ri-fullscreen-line") as HTMLElement);
		fireEvent(document, new Event("fullscreenchange"));

		// a mobile width on a full screen stage is the point — the extra room is
		// there to be given to the preview by the presets, not taken automatically
		expect(viewport().style.width).toEqual("375px");
	});
});
