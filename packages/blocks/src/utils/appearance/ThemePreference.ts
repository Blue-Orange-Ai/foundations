import Cookies from "js-cookie";

/**
 * The three choices offered on the appearance page.
 *
 * `SYSTEM` is not a theme in its own right — it defers to the operating
 * system's `prefers-color-scheme` and follows it for as long as it is selected.
 */
export enum ThemePreference {
	LIGHT = "light",
	DARK = "dark",
	SYSTEM = "system"
}

/** What a preference resolves to once the operating system has been consulted. */
export type ResolvedTheme = "light" | "dark";

/**
 * Holds the *effective* theme and is therefore only ever "light" or "dark" —
 * never "system". Everything that only needs to know which way to paint reads
 * this one cookie and needs no knowledge of the system option.
 */
export const THEME_COOKIE_NAME = "theme";

/**
 * Written only while the preference is `SYSTEM`, and holds the scheme the
 * operating system is currently reporting. Its presence is what marks the
 * preference as "system"; picking an explicit light or dark theme deletes it.
 */
export const SYSTEM_THEME_COOKIE_NAME = "theme-system";

export type ThemeCookieOptions = Cookies.CookieAttributes;

/**
 * A year, at the site root. js-cookie writes a session cookie by default, and a
 * theme preference that expires when the browser closes is no preference at all.
 */
export const DEFAULT_COOKIE_OPTIONS: ThemeCookieOptions = {
	expires: 365,
	path: "/",
	sameSite: "lax"
};

export interface ThemeCookieNames {
	/** Defaults to `theme`. */
	theme?: string;
	/** Defaults to `theme-system`. */
	systemTheme?: string;
}

export interface ApplyThemeOptions {
	/** Set false to toggle the `dark` class without touching cookies. Defaults to true. */
	persist?: boolean;
	cookieOptions?: ThemeCookieOptions;
	cookieNames?: ThemeCookieNames;
}

const SYSTEM_QUERY = "(prefers-color-scheme: dark)";

const themeCookie = (names?: ThemeCookieNames): string =>
	(names && names.theme) || THEME_COOKIE_NAME;

const systemThemeCookie = (names?: ThemeCookieNames): string =>
	(names && names.systemTheme) || SYSTEM_THEME_COOKIE_NAME;

/** The scheme the operating system is asking for, defaulting to light where it cannot be read. */
export const getSystemTheme = (): ResolvedTheme => {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
		return "light";
	}
	return window.matchMedia(SYSTEM_QUERY).matches ? "dark" : "light";
};

/**
 * Reads the stored preference. The system cookie wins when present — it is the
 * marker for "follow the OS" — otherwise the theme cookie is taken at face
 * value, and `fallback` covers a visitor who has never chosen anything.
 */
export const getThemePreference = (
	names?: ThemeCookieNames,
	fallback: ThemePreference = ThemePreference.SYSTEM
): ThemePreference => {
	if (Cookies.get(systemThemeCookie(names)) !== undefined) {
		return ThemePreference.SYSTEM;
	}
	const stored = Cookies.get(themeCookie(names));
	if (stored === ThemePreference.DARK) {
		return ThemePreference.DARK;
	}
	if (stored === ThemePreference.LIGHT) {
		return ThemePreference.LIGHT;
	}
	return fallback;
};

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
	preference === ThemePreference.SYSTEM ? getSystemTheme() : preference;

/**
 * Toggles the `dark` class on <body>, which is the signal the rest of the
 * library themes itself from (see `isDarkMode` in foundations-core).
 */
export const applyTheme = (theme: ResolvedTheme): void => {
	if (typeof document === "undefined") {
		return;
	}
	document.body.classList.toggle("dark", theme === "dark");
};

/** Writes the pair of cookies described at the top of this file. */
export const writeThemeCookies = (
	preference: ThemePreference,
	resolved: ResolvedTheme,
	options?: ThemeCookieOptions,
	names?: ThemeCookieNames
): void => {
	const attributes = {...DEFAULT_COOKIE_OPTIONS, ...options};
	Cookies.set(themeCookie(names), resolved, attributes);
	if (preference === ThemePreference.SYSTEM) {
		Cookies.set(systemThemeCookie(names), resolved, attributes);
	} else {
		// The remove has to carry the same path/domain the cookie was written with.
		Cookies.remove(systemThemeCookie(names), attributes);
	}
};

/**
 * Applies a preference: paints the page and (unless `persist` is false) records
 * it in the cookies. Returns the theme it resolved to.
 */
export const applyThemePreference = (
	preference: ThemePreference,
	options: ApplyThemeOptions = {}
): ResolvedTheme => {
	const resolved = resolveTheme(preference);
	applyTheme(resolved);
	if (options.persist !== false) {
		writeThemeCookies(preference, resolved, options.cookieOptions, options.cookieNames);
	}
	return resolved;
};

/**
 * Calls back whenever the operating system flips between light and dark.
 * Returns an unsubscribe function.
 */
export const watchSystemTheme = (onChange: (theme: ResolvedTheme) => void): (() => void) => {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
		return () => {};
	}
	const query = window.matchMedia(SYSTEM_QUERY);
	const listener = (event: MediaQueryListEvent) => onChange(event.matches ? "dark" : "light");
	if (typeof query.addEventListener === "function") {
		query.addEventListener("change", listener);
		return () => query.removeEventListener("change", listener);
	}
	// Safari below 14 only has the deprecated pair.
	query.addListener(listener);
	return () => query.removeListener(listener);
};

/**
 * Applies the stored preference and keeps it in step with the operating system
 * while "system" is selected. Call this once when the app boots — the Appearance
 * block does the same thing while it is mounted, but a settings page is rarely
 * the first screen a user lands on. Returns a teardown function.
 */
export const initialiseTheme = (options: ApplyThemeOptions = {}): (() => void) => {
	const preference = getThemePreference(options.cookieNames);
	applyThemePreference(preference, options);
	if (preference !== ThemePreference.SYSTEM) {
		return () => {};
	}
	return watchSystemTheme(() => applyThemePreference(ThemePreference.SYSTEM, options));
};
