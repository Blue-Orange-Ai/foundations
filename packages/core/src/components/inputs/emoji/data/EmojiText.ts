// The emoji picker describes each emoji as HTML character references
// ("&#x1F44D;") and hands that string to whoever uses it — a reaction, a
// status, a message. Once stored, that string is whatever the person saving it
// sent, so it is only ever shown as text: the references are decoded here and
// anything else is left as literal characters. A "reaction" saved through the
// API as `<img src=x onerror=...>` shows up as those characters rather than
// running.

const CHARACTER_REFERENCE = /&#(x[0-9a-f]{1,6}|[0-9]{1,7});?/gi;

const fromCodePoint = (point: number): string => {
	if (!Number.isInteger(point) || point <= 0 || point > 0x10FFFF || (point >= 0xD800 && point <= 0xDFFF)) {
		return "";
	}
	return String.fromCodePoint(point);
};

/** The characters an emoji's HTML stands for, as plain text. */
export const emojiHtmlToText = (html: string | null | undefined): string => {
	if (typeof html !== "string") {
		return "";
	}
	return html.replace(CHARACTER_REFERENCE, (_match, code: string) =>
		fromCodePoint(code[0] === "x" || code[0] === "X" ? parseInt(code.slice(1), 16) : parseInt(code, 10)));
};
