// Dark mode across this library is signalled by a `dark` class on <body> (or
// <html>) — see the DarkMode util in foundations-core and the Appearance
// settings page in foundations-blocks. The primitives-graph components read
// that class themselves, so a graph, diagram or ER diagram goes dark with the
// rest of the app without any wiring here.
//
// The `theme` prop on the wrappers is for the other case: pinning one
// component to light or dark whatever the application is doing. It is optional
// everywhere, and "auto" hands the choice back to the application.

export type GraphTheme = "light" | "dark" | "auto";

/**
 * Merges the theme into the options object passed to a primitives component.
 * Typed loosely on purpose: the option is only present in primitives-graph
 * versions that support theming, and the wrappers must keep compiling against
 * the ones that don't.
 */
export const withGraphTheme = <T extends object>(options: T | undefined, theme?: GraphTheme): T => {
	return {...(options || {}), ...(theme ? {theme: theme} : {})} as T;
};

/**
 * Applies a theme change to a live component. A no-op on a build of
 * primitives-graph that predates theming, so a `theme` prop can be passed
 * safely either way.
 */
export const applyGraphTheme = (component: unknown, theme?: GraphTheme): void => {
	if (component == null || theme == null) {
		return;
	}
	const themed = component as {theme?: string, setTheme?: (theme: GraphTheme) => unknown};
	if (typeof themed.setTheme !== "function" || themed.theme === theme) {
		return;
	}
	themed.setTheme(theme);
};
