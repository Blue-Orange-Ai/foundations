import React, {useEffect, useRef, useState} from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Description,
	PaddedPage,
	PageHeading
} from "@blue-orange-ai/foundations-core";

import './Appearance.css'
import {
	ApplyThemeOptions,
	applyThemePreference,
	getThemePreference,
	ResolvedTheme,
	resolveTheme,
	ThemeCookieOptions,
	ThemePreference,
	watchSystemTheme
} from "../../../utils/appearance/ThemePreference";
import {EmojiSkinTone, getEmojiSkinTone, setEmojiSkinTone} from "../../../utils/appearance/EmojiSkinTone";
import {ThemePreferenceSelector} from "../theme-preference-selector/ThemePreferenceSelector";
import {EmojiSkinToneSelector} from "../emoji-skin-tone-selector/EmojiSkinToneSelector";

interface Props {
	/** Drives the theme choice from outside. Omit to let the block track the cookies itself. */
	themePreference?: ThemePreference;
	onThemePreferenceChange?: (preference: ThemePreference, resolved: ResolvedTheme) => void;
	/** Drives the skin tone from outside. Omit to let the block track the cookie itself. */
	skinTone?: EmojiSkinTone;
	onSkinToneChange?: (tone: EmojiSkinTone) => void;
	/** Set false to apply preferences without writing any cookies. Defaults to true. */
	persist?: boolean;
	/** Expiry, path, domain and friends for every cookie this page writes. */
	cookieOptions?: ThemeCookieOptions;
	themeCookieName?: string;
	systemThemeCookieName?: string;
	skinToneCookieName?: string;
	/** Set false to drop the page heading when embedding the block inside an existing page. */
	heading?: boolean;
	/** Set false to render without the page padding, e.g. inside a drawer or a tab. */
	padded?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The appearance settings page: theme preference and default emoji skin tone.
 *
 * Both preferences are stored in cookies the rest of the stack already reads —
 * `theme` for the effective light/dark theme and `skinTone` for the emoji picker
 * — so choosing here changes the whole app rather than just this page. Selecting
 * System additionally writes `theme-system`, whose presence marks the preference
 * as "follow the OS" and whose value is the scheme the OS currently reports;
 * while it is selected the block follows the OS live.
 */
export const Appearance: React.FC<Props> = ({
												themePreference,
												onThemePreferenceChange,
												skinTone,
												onSkinToneChange,
												persist = true,
												cookieOptions,
												themeCookieName,
												systemThemeCookieName,
												skinToneCookieName,
												heading = true,
												padded = true,
												classes = "",
												style = {}}) => {

	const cookieNames = {theme: themeCookieName, systemTheme: systemThemeCookieName};

	// The theme options are read inside effects and callbacks. Holding them in a
	// ref keeps a caller's inline `cookieOptions={{...}}` from re-running the
	// effect on every render.
	const themeOptions: ApplyThemeOptions = {persist, cookieOptions, cookieNames};
	const themeOptionsRef = useRef(themeOptions);
	themeOptionsRef.current = themeOptions;

	const [preferenceState, setPreferenceState] = useState<ThemePreference>(
		() => themePreference !== undefined ? themePreference : getThemePreference(cookieNames));

	const [skinToneState, setSkinToneState] = useState<EmojiSkinTone>(
		() => skinTone !== undefined ? skinTone : getEmojiSkinTone(skinToneCookieName));

	const activePreference = themePreference !== undefined ? themePreference : preferenceState;

	const activeSkinTone = skinTone !== undefined ? skinTone : skinToneState;

	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(activePreference));

	// Applying on mount means the page always agrees with what is on screen, and
	// materialises the cookies for a visitor who has never chosen anything. While
	// System is selected the OS is followed for as long as the block is mounted.
	useEffect(() => {
		setResolvedTheme(applyThemePreference(activePreference, themeOptionsRef.current));
		if (activePreference !== ThemePreference.SYSTEM) {
			return;
		}
		return watchSystemTheme(() => {
			setResolvedTheme(applyThemePreference(ThemePreference.SYSTEM, themeOptionsRef.current));
		});
	}, [activePreference, persist, themeCookieName, systemThemeCookieName]);

	const changeThemePreference = (preference: ThemePreference) => {
		if (themePreference === undefined) {
			setPreferenceState(preference);
		}
		const resolved = applyThemePreference(preference, themeOptionsRef.current);
		setResolvedTheme(resolved);
		if (onThemePreferenceChange) {
			onThemePreferenceChange(preference, resolved);
		}
	};

	const changeSkinTone = (tone: EmojiSkinTone) => {
		if (skinTone === undefined) {
			setSkinToneState(tone);
		}
		if (persist) {
			setEmojiSkinTone(tone, cookieOptions, skinToneCookieName);
		}
		if (onSkinToneChange) {
			onSkinToneChange(tone);
		}
	};

	const body = (
		<div className={"blue-orange-blocks-appearance" + (classes ? " " + classes : "")} style={style}>
			{heading && (
				<div>
					<PageHeading>Appearance</PageHeading>
					<Description>Choose how the app looks on this device.</Description>
				</div>
			)}
			<Card>
				<CardHeader>
					<CardTitle>Theme</CardTitle>
					<CardDescription>
						Pick a theme, or match whatever your device is set to.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ThemePreferenceSelector
						value={activePreference}
						onChange={changeThemePreference}
						systemTheme={resolvedTheme}></ThemePreferenceSelector>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Emoji skin tone</CardTitle>
					<CardDescription>
						The default tone applied to emoji that support one, everywhere you pick an emoji.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<EmojiSkinToneSelector
						value={activeSkinTone}
						onChange={changeSkinTone}></EmojiSkinToneSelector>
				</CardContent>
			</Card>
		</div>
	);

	if (!padded) {
		return body;
	}

	return (
		<PaddedPage>
			{body}
		</PaddedPage>
	)
}
