// Most of the library themes itself with CSS through a `dark` ancestor class.
// Components that paint outside of CSS — a canvas, a syntax highlighter that
// bakes colours into the markup it generates — need the same signal in
// JavaScript, which is what this resolves.

/** Dark mode is signalled by a `dark` class on <body> (see the dev app) or <html>. */
export const isDarkMode = (): boolean => {
	if (typeof document === "undefined") {
		return false;
	}
	return document.body.classList.contains("dark") ||
		document.documentElement.classList.contains("dark");
};

/**
 * Watches for `dark` class toggles on <body>/<html> and invokes the callback so a
 * mounted component can re-theme itself. Returns a disconnect function for cleanup.
 */
export const observeDarkMode = (onChange: () => void): (() => void) => {
	if (typeof MutationObserver === "undefined" || typeof document === "undefined") {
		return () => {};
	}
	const observer = new MutationObserver(() => onChange());
	observer.observe(document.body, {attributes: true, attributeFilter: ["class"]});
	observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class"]});
	return () => observer.disconnect();
};
