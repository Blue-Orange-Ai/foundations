import React from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cookies from "js-cookie";

import {Appearance} from "./Appearance";
import {SYSTEM_THEME_COOKIE_NAME, THEME_COOKIE_NAME, ThemePreference} from "../../../utils/appearance/ThemePreference";
import {SKIN_TONE_COOKIE_NAME} from "../../../utils/appearance/EmojiSkinTone";

const stubSystemTheme = (dark: boolean) => {
	window.matchMedia = ((query: string) => ({
		matches: dark,
		media: query,
		onchange: null,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false
	})) as unknown as typeof window.matchMedia;
};

// "Light" and "Dark" name an option in both groups, so every query is scoped.
const themeOption = (name: RegExp) =>
	within(screen.getByRole("radiogroup", {name: "Theme"})).getByRole("radio", {name});

const skinToneOption = (name: string) =>
	within(screen.getByRole("radiogroup", {name: "Emoji skin tone"})).getByRole("radio", {name});

describe("Appearance", () => {

	beforeEach(() => {
		Cookies.remove(THEME_COOKIE_NAME, {path: "/"});
		Cookies.remove(SYSTEM_THEME_COOKIE_NAME, {path: "/"});
		Cookies.remove(SKIN_TONE_COOKIE_NAME, {path: "/"});
		document.body.classList.remove("dark");
		stubSystemTheme(false);
	});

	it("offers the three theme preferences and the six skin tones", () => {
		render(<Appearance/>);

		expect(themeOption(/^Light/)).toBeInTheDocument();
		expect(themeOption(/^Dark/)).toBeInTheDocument();
		expect(themeOption(/^System/)).toBeInTheDocument();
		expect(within(screen.getByRole("radiogroup", {name: "Emoji skin tone"}))
			.getAllByRole("radio").length).toBe(6);
	});

	it("stores an explicit dark theme and paints the page", async () => {
		const onChange = vi.fn();
		render(<Appearance onThemePreferenceChange={onChange}/>);

		await userEvent.click(themeOption(/^Dark/));

		expect(Cookies.get(THEME_COOKIE_NAME)).toBe("dark");
		expect(Cookies.get(SYSTEM_THEME_COOKIE_NAME)).toBeUndefined();
		expect(document.body.classList.contains("dark")).toBe(true);
		expect(onChange).toHaveBeenCalledWith(ThemePreference.DARK, "dark");
	});

	it("writes the additional system cookie when system is chosen", async () => {
		stubSystemTheme(true);
		render(<Appearance/>);

		await userEvent.click(themeOption(/^System/));

		expect(Cookies.get(THEME_COOKIE_NAME)).toBe("dark");
		expect(Cookies.get(SYSTEM_THEME_COOKIE_NAME)).toBe("dark");
		expect(document.body.classList.contains("dark")).toBe(true);
	});

	it("stores the emoji skin tone the picker reads", async () => {
		const onChange = vi.fn();
		render(<Appearance onSkinToneChange={onChange}/>);

		await userEvent.click(skinToneOption("Medium dark"));

		expect(Cookies.get(SKIN_TONE_COOKIE_NAME)).toBe("4");
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it("starts from the preference already in the cookies", () => {
		Cookies.set(THEME_COOKIE_NAME, "dark", {path: "/"});
		Cookies.set(SKIN_TONE_COOKIE_NAME, "2", {path: "/"});

		render(<Appearance/>);

		expect(themeOption(/^Dark/)).toHaveAttribute("aria-checked", "true");
		expect(skinToneOption("Medium light")).toHaveAttribute("aria-checked", "true");
	});

	it("leaves the cookies alone when persistence is turned off", async () => {
		render(<Appearance persist={false}/>);

		await userEvent.click(themeOption(/^Dark/));

		expect(Cookies.get(THEME_COOKIE_NAME)).toBeUndefined();
		expect(document.body.classList.contains("dark")).toBe(true);
	});
});
