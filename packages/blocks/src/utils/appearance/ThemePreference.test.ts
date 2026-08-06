import {beforeEach, describe, expect, it} from "vitest";
import Cookies from "js-cookie";
import {
	applyThemePreference,
	getSystemTheme,
	getThemePreference,
	initialiseTheme,
	SYSTEM_THEME_COOKIE_NAME,
	THEME_COOKIE_NAME,
	ThemePreference
} from "./ThemePreference";

/**
 * jsdom has no real media query engine, so the OS answer is stubbed per test.
 * `matches` is read through a getter because the code re-queries the OS on every
 * apply rather than trusting the event — flipping `dark` models the real thing.
 */
const stubSystemTheme = (dark: boolean) => {
	const state = {
		dark,
		listeners: [] as Array<(event: MediaQueryListEvent) => void>
	};
	window.matchMedia = ((query: string) => ({
		get matches() {
			return state.dark;
		},
		media: query,
		onchange: null,
		addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
			state.listeners.push(listener);
		},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false
	})) as unknown as typeof window.matchMedia;
	return state;
};

const clearCookies = () => {
	Cookies.remove(THEME_COOKIE_NAME, {path: "/"});
	Cookies.remove(SYSTEM_THEME_COOKIE_NAME, {path: "/"});
};

describe("ThemePreference", () => {

	beforeEach(() => {
		clearCookies();
		document.body.classList.remove("dark");
		stubSystemTheme(false);
	});

	it("stores an explicit dark choice and paints the page", () => {
		const resolved = applyThemePreference(ThemePreference.DARK);

		expect(resolved).toBe("dark");
		expect(Cookies.get(THEME_COOKIE_NAME)).toBe("dark");
		expect(document.body.classList.contains("dark")).toBe(true);
	});

	it("removes the system cookie when an explicit theme is chosen", () => {
		applyThemePreference(ThemePreference.SYSTEM);
		expect(Cookies.get(SYSTEM_THEME_COOKIE_NAME)).toBeDefined();

		applyThemePreference(ThemePreference.LIGHT);

		expect(Cookies.get(SYSTEM_THEME_COOKIE_NAME)).toBeUndefined();
		expect(Cookies.get(THEME_COOKIE_NAME)).toBe("light");
		expect(document.body.classList.contains("dark")).toBe(false);
	});

	it("records the operating system scheme in the additional cookie", () => {
		stubSystemTheme(true);

		const resolved = applyThemePreference(ThemePreference.SYSTEM);

		expect(resolved).toBe("dark");
		// The effective theme stays readable from the one cookie everything else uses...
		expect(Cookies.get(THEME_COOKIE_NAME)).toBe("dark");
		// ...and the extra cookie carries the system property that produced it.
		expect(Cookies.get(SYSTEM_THEME_COOKIE_NAME)).toBe("dark");
		expect(document.body.classList.contains("dark")).toBe(true);
	});

	it("writes nothing when persistence is turned off", () => {
		applyThemePreference(ThemePreference.DARK, {persist: false});

		expect(Cookies.get(THEME_COOKIE_NAME)).toBeUndefined();
		expect(document.body.classList.contains("dark")).toBe(true);
	});

	it("honours custom cookie names", () => {
		applyThemePreference(ThemePreference.SYSTEM, {
			cookieNames: {theme: "app-theme", systemTheme: "app-theme-system"}
		});

		expect(Cookies.get("app-theme")).toBe("light");
		expect(Cookies.get("app-theme-system")).toBe("light");
		expect(Cookies.get(THEME_COOKIE_NAME)).toBeUndefined();

		Cookies.remove("app-theme", {path: "/"});
		Cookies.remove("app-theme-system", {path: "/"});
	});

	it("reads the preference back out of the cookies", () => {
		expect(getThemePreference()).toBe(ThemePreference.SYSTEM);

		applyThemePreference(ThemePreference.DARK);
		expect(getThemePreference()).toBe(ThemePreference.DARK);

		applyThemePreference(ThemePreference.SYSTEM);
		expect(getThemePreference()).toBe(ThemePreference.SYSTEM);
	});

	it("falls back to light when the browser cannot answer the media query", () => {
		const matchMedia = window.matchMedia;
		delete (window as {matchMedia?: unknown}).matchMedia;

		expect(getSystemTheme()).toBe("light");

		window.matchMedia = matchMedia;
	});

	it("follows the operating system while system is the stored preference", () => {
		stubSystemTheme(false);
		applyThemePreference(ThemePreference.SYSTEM);

		const system = stubSystemTheme(false);
		const teardown = initialiseTheme();

		expect(system.listeners.length).toBe(1);

		system.dark = true;
		system.listeners[0]({matches: true} as MediaQueryListEvent);

		expect(document.body.classList.contains("dark")).toBe(true);
		expect(Cookies.get(THEME_COOKIE_NAME)).toBe("dark");
		expect(Cookies.get(SYSTEM_THEME_COOKIE_NAME)).toBe("dark");

		teardown();
	});
});
