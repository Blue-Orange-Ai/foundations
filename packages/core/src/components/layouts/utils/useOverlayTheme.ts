import {useEffect, useRef, useState} from "react";

/**
 * Overlays portal themselves out to the body so no ancestor can capture their fixed positioning.
 * That also drops them out of any `dark` wrapper they were written inside — the class only themes
 * its own subtree, and an embedded widget may scope it to itself rather than to <body>.
 *
 * This keeps a hidden anchor where the overlay sits in the caller's tree, resolves the theme from
 * there, and hands back the class to re-apply on the portalled window so the two stay in step.
 */
export const useOverlayTheme = (mounted: boolean) => {

	const anchorRef = useRef<HTMLSpanElement>(null);
	const [dark, setDark] = useState(false);

	useEffect(() => {
		if (!mounted) {
			return;
		}

		const resolve = () => setDark(anchorRef.current != null && anchorRef.current.closest(".dark") != null);
		resolve();

		if (typeof MutationObserver === "undefined") {
			return;
		}

		// the class can be toggled anywhere above the overlay, so watch the whole chain up to <html>
		const observer = new MutationObserver(resolve);
		let node: HTMLElement | null = anchorRef.current;
		while (node) {
			observer.observe(node, {attributes: true, attributeFilter: ["class"]});
			node = node.parentElement;
		}
		return () => observer.disconnect();
	}, [mounted]);

	return {anchorRef, themeClass: dark ? " dark" : ""};
};
