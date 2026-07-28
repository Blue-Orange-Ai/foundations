// Chart.js draws grid lines, tick labels and axis titles onto a canvas, so their
// colours cannot be themed with CSS like the rest of the library. This helper
// resolves the correct colours for the active (light/dark) theme, applies them to
// a live chart instance and watches for runtime theme toggles.

export interface ChartThemeColors {
	gridColor: string;
	tickColor: string;
	borderColor: string;
}

const LIGHT_THEME: ChartThemeColors = {
	gridColor: "rgba(0, 0, 0, 0.1)",
	tickColor: "#666666",
	borderColor: "rgba(0, 0, 0, 0.1)",
};

const DARK_THEME: ChartThemeColors = {
	gridColor: "rgba(255, 255, 255, 0.15)",
	tickColor: "#c9c9c9",
	borderColor: "rgba(255, 255, 255, 0.2)",
};

// Dark mode is signalled by a `dark` class on <body> (see the dev app) or <html>.
export const isChartDarkMode = (): boolean => {
	if (typeof document === "undefined") {
		return false;
	}
	return document.body.classList.contains("dark") ||
		document.documentElement.classList.contains("dark");
};

export const getChartThemeColors = (): ChartThemeColors => {
	return isChartDarkMode() ? DARK_THEME : LIGHT_THEME;
};

// Applies the active theme's grid/tick/title colours to every scale of a chart
// instance and repaints without re-animating. Safe to call on any chart.
export const applyChartTheme = (chart: any): void => {
	if (!chart || !chart.options || !chart.options.scales) {
		return;
	}
	const colors = getChartThemeColors();
	Object.keys(chart.options.scales).forEach((key) => {
		const scale = chart.options.scales[key];
		if (!scale) {
			return;
		}
		scale.grid = {...(scale.grid || {}), color: colors.gridColor, borderColor: colors.borderColor};
		scale.ticks = {...(scale.ticks || {}), color: colors.tickColor};
		if (scale.title) {
			scale.title = {...scale.title, color: colors.tickColor};
		}
	});
	chart.update("none");
};

// Watches for `dark` class toggles on <body>/<html> and invokes the callback so a
// mounted chart can re-theme itself. Returns a disconnect function for cleanup.
export const observeChartTheme = (onChange: () => void): (() => void) => {
	if (typeof MutationObserver === "undefined" || typeof document === "undefined") {
		return () => {};
	}
	const observer = new MutationObserver(() => onChange());
	observer.observe(document.body, {attributes: true, attributeFilter: ["class"]});
	observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class"]});
	return () => observer.disconnect();
};
