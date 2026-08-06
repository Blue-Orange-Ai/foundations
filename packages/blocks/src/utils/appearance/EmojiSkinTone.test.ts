import {beforeEach, describe, expect, it} from "vitest";
import Cookies from "js-cookie";
import {EmojiSkinTone, getEmojiSkinTone, setEmojiSkinTone, SKIN_TONE_COOKIE_NAME} from "./EmojiSkinTone";

describe("EmojiSkinTone", () => {

	beforeEach(() => {
		Cookies.remove(SKIN_TONE_COOKIE_NAME, {path: "/"});
	});

	it("defaults to the tone-less emoji when nothing is stored", () => {
		expect(getEmojiSkinTone()).toBe(EmojiSkinTone.DEFAULT);
	});

	it("round trips a tone through the cookie the picker reads", () => {
		setEmojiSkinTone(EmojiSkinTone.MEDIUM_DARK);

		expect(Cookies.get(SKIN_TONE_COOKIE_NAME)).toBe("4");
		expect(getEmojiSkinTone()).toBe(EmojiSkinTone.MEDIUM_DARK);
	});

	it("ignores a cookie that is not a tone", () => {
		Cookies.set(SKIN_TONE_COOKIE_NAME, "nonsense", {path: "/"});
		expect(getEmojiSkinTone()).toBe(EmojiSkinTone.DEFAULT);

		Cookies.set(SKIN_TONE_COOKIE_NAME, "9", {path: "/"});
		expect(getEmojiSkinTone()).toBe(EmojiSkinTone.DEFAULT);
	});
});
