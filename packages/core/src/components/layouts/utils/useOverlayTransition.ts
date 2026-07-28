import {useEffect, useRef, useState} from "react";

export const OVERLAY_TRANSITION_DURATION = 200;

interface OverlayTransition {
	// whether the overlay should be in the DOM at all
	mounted: boolean;
	// whether the overlay should be in its open (animated in) state
	visible: boolean;
}

const nextFrame = (callback: () => void): (() => void) => {
	if (typeof requestAnimationFrame !== "function") {
		callback();
		return () => {};
	}
	// two frames so the closed styles are committed before the open styles are applied
	let inner: number | null = null;
	const outer = requestAnimationFrame(() => {
		inner = requestAnimationFrame(callback);
	});
	return () => {
		cancelAnimationFrame(outer);
		if (inner !== null) {
			cancelAnimationFrame(inner);
		}
	};
};

/**
 * Drives the enter and exit animation of an overlay.
 *
 * When `open` is left undefined the overlay is uncontrolled — being rendered means being open, and the
 * caller unmounts it themselves. When `open` is provided the overlay stays mounted while it animates
 * out, so `open={false}` plays the closing animation before it leaves the DOM.
 */
export const useOverlayTransition = (open?: boolean, duration: number = OVERLAY_TRANSITION_DURATION): OverlayTransition => {

	const controlled = open !== undefined;
	const shouldOpen = controlled ? open! : true;

	const [mounted, setMounted] = useState(shouldOpen);
	const [visible, setVisible] = useState(false);

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		if (shouldOpen) {
			setMounted(true);
			const cancelFrame = nextFrame(() => setVisible(true));
			return () => cancelFrame();
		}

		setVisible(false);
		timeoutRef.current = setTimeout(() => {
			timeoutRef.current = null;
			setMounted(false);
		}, duration);

		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [shouldOpen, duration]);

	return {mounted, visible};
};
