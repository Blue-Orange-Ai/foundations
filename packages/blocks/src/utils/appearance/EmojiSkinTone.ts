import Cookies from "js-cookie";
import {DEFAULT_COOKIE_OPTIONS, ThemeCookieOptions} from "./ThemePreference";

/**
 * The six settings the emoji picker understands. `DEFAULT` is the yellow,
 * tone-less emoji; one through five are the Fitzpatrick modifiers in order.
 */
export enum EmojiSkinTone {
	DEFAULT = 0,
	LIGHT = 1,
	MEDIUM_LIGHT = 2,
	MEDIUM = 3,
	MEDIUM_DARK = 4,
	DARK = 5
}

/**
 * The cookie foundations-core's emoji picker already reads (see EmojiWrapper and
 * EmojiContainer) — writing it here is what makes the preference stick across
 * every picker in the app.
 */
export const SKIN_TONE_COOKIE_NAME = "skinTone";

export interface EmojiSkinToneOption {
	tone: EmojiSkinTone;
	label: string;
	/** A raised hand carrying the modifier, so the swatch previews the real thing. */
	sample: string;
}

export const EMOJI_SKIN_TONE_OPTIONS: EmojiSkinToneOption[] = [
	{tone: EmojiSkinTone.DEFAULT, label: "Default", sample: "✋"},
	{tone: EmojiSkinTone.LIGHT, label: "Light", sample: "✋🏻"},
	{tone: EmojiSkinTone.MEDIUM_LIGHT, label: "Medium light", sample: "✋🏼"},
	{tone: EmojiSkinTone.MEDIUM, label: "Medium", sample: "✋🏽"},
	{tone: EmojiSkinTone.MEDIUM_DARK, label: "Medium dark", sample: "✋🏾"},
	{tone: EmojiSkinTone.DARK, label: "Dark", sample: "✋🏿"}
];

export const getEmojiSkinTone = (cookieName: string = SKIN_TONE_COOKIE_NAME): EmojiSkinTone => {
	const stored = Cookies.get(cookieName);
	if (stored === undefined) {
		return EmojiSkinTone.DEFAULT;
	}
	const tone = parseInt(stored, 10);
	if (isNaN(tone) || tone < EmojiSkinTone.DEFAULT || tone > EmojiSkinTone.DARK) {
		return EmojiSkinTone.DEFAULT;
	}
	return tone;
};

export const setEmojiSkinTone = (
	tone: EmojiSkinTone,
	options?: ThemeCookieOptions,
	cookieName: string = SKIN_TONE_COOKIE_NAME
): void => {
	Cookies.set(cookieName, tone.toString(), {...DEFAULT_COOKIE_OPTIONS, ...options});
};
