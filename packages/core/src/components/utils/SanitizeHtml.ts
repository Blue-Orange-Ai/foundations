import DOMPurify, {Config, DOMPurify as Purifier, UponSanitizeAttributeHookEvent} from "dompurify";

// Markup that reaches the page through innerHTML or dangerouslySetInnerHTML is
// parsed and run by the browser exactly as written: a `<script>`, an
// `<img onerror>`, a `javascript:` link or an `<iframe srcdoc>` all execute in
// the app's origin, with the signed in user's session. Every component that
// has to show markup it did not build itself sends it through sanitizeHtml
// first, which keeps the formatting and drops anything that can run, load or
// submit something.
//
// DOMPurify does the parsing and filtering. It runs on its own instance so the
// hooks below never leak into a DOMPurify the host application uses, and it
// fails closed: where there is no DOM to sanitize with (server rendering, a
// worker) the markup is escaped and shown as text rather than passed through.

export interface SanitizeHtmlOptions {
	/**
	 * Keeps inline `style` attributes. Declarations that load something
	 * (`url()`, `image-set()`), run something (`expression()`, bindings) or lift
	 * content out of its container (`position: fixed|absolute|sticky`,
	 * `z-index`) are always removed. Defaults to true.
	 */
	allowStyles?: boolean;
	/** Keeps `<img>`, `<picture>`, `<video>` and `<audio>`. Defaults to true. */
	allowMedia?: boolean;
	/** Keeps inline `<svg>` markup, e.g. an icon or a logo. Defaults to true. */
	allowSvg?: boolean;
	/**
	 * Keeps `class` attributes (the library's own class names are always
	 * removed, see RESERVED_CLASS). Turn it off for markup written somewhere
	 * else, such as an invite's HTML body: its classes only matter to its own
	 * stylesheet, which is never kept, and any that match the host page's CSS
	 * would borrow that styling. Defaults to true.
	 */
	allowClasses?: boolean;
}

// Never wanted, whatever the options: they run script, pull in other documents,
// restyle the whole page, or collect input that could be posted anywhere.
const FORBIDDEN_TAGS = [
	"script", "noscript", "style", "link", "meta", "base",
	"iframe", "frame", "frameset", "object", "embed", "applet", "portal",
	"form", "input", "button", "textarea", "select", "option", "optgroup", "datalist", "keygen", "output",
	"dialog", "template", "slot",
	"foreignobject", "use", "animate", "animatemotion", "animatetransform", "set", "handler", "listener",
];

const FORBIDDEN_ATTRIBUTES = ["action", "formaction", "ping", "srcdoc", "autofocus", "http-equiv"];

const MEDIA_TAGS = ["img", "picture", "source", "video", "audio", "track", "image"];

// Inline styles are filtered per declaration rather than dropped outright, so
// highlighted code and formatted text keep their colours.
const UNSAFE_STYLE_VALUE = /url\s*\(|image-set\s*\(|image\s*\(|element\s*\(|expression\s*\(|paint\s*\(|javascript:|vbscript:|-moz-binding|behavior|@import|\\/i;
const UNSAFE_STYLE_PROPERTIES = new Set(["z-index", "behavior", "-moz-binding", "-ms-behavior"]);
const SAFE_POSITIONS = new Set(["static", "relative", ""]);

const LINK_TARGETS = new Set(["_blank", "_self"]);

// The library's own class names. Markup that borrowed them would pick up the
// library's styling — `blue-orange-modal-window`, for one, is a fixed,
// full-screen layer above everything — so they are taken off whatever the
// markup says.
const RESERVED_CLASS = /^(blue-orange|bo|foundations)-|^(tiptap|ProseMirror|tippy-box|tippy-content)$/i;

let purifier: Purifier | undefined;

const escapeHtml = (value: string): string => value
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/"/g, "&quot;")
	.replace(/'/g, "&#39;");

/** Rebuilds a style attribute from only the declarations that are safe to keep. */
export const sanitizeStyle = (style: string, ownerDocument?: Document): string => {
	const doc = ownerDocument ?? (typeof document !== "undefined" ? document : undefined);
	if (!doc || typeof style !== "string" || style.trim() === "") {
		return "";
	}
	// The browser's own CSS parser splits the declarations, so quoting or
	// comments cannot smuggle one declaration inside another.
	const source = doc.createElement("span").style;
	source.cssText = style;
	const kept = doc.createElement("span").style;
	for (let i = 0; i < source.length; i++) {
		const property = source.item(i);
		const value = source.getPropertyValue(property);
		const lowered = property.toLowerCase();
		if (UNSAFE_STYLE_PROPERTIES.has(lowered) || UNSAFE_STYLE_VALUE.test(value) || UNSAFE_STYLE_VALUE.test(property)) {
			continue;
		}
		if (lowered === "position" && !SAFE_POSITIONS.has(value.trim().toLowerCase())) {
			continue;
		}
		kept.setProperty(property, value, source.getPropertyPriority(property));
	}
	return kept.cssText;
};

const onAttribute = (node: Element, data: UponSanitizeAttributeHookEvent) => {
	if (data.attrName === "style") {
		const cleaned = sanitizeStyle(data.attrValue, node.ownerDocument);
		if (cleaned === "") {
			data.keepAttr = false;
		} else {
			data.attrValue = cleaned;
		}
	}
	if (data.attrName === "class") {
		const kept = data.attrValue.split(/\s+/).filter(name => name !== "" && !RESERVED_CLASS.test(name));
		if (kept.length === 0) {
			data.keepAttr = false;
		} else {
			data.attrValue = kept.join(" ");
		}
	}
	if (data.attrName === "target") {
		const target = data.attrValue.trim().toLowerCase();
		if (!LINK_TARGETS.has(target)) {
			data.keepAttr = false;
		} else {
			data.attrValue = target;
		}
	}
};

const afterAttributes = (node: Element) => {
	// A link that opens a new window must not hand that window a handle back
	// to this one (tab-nabbing), nor tell it where it came from.
	if (node.tagName && node.tagName.toLowerCase() === "a" && node.getAttribute("target") === "_blank") {
		const rel = new Set((node.getAttribute("rel") ?? "").split(/\s+/).filter(Boolean).map(item => item.toLowerCase()));
		rel.add("noopener");
		rel.add("noreferrer");
		node.setAttribute("rel", Array.from(rel).join(" "));
	}
};

const getPurifier = (): Purifier | undefined => {
	if (purifier) {
		return purifier;
	}
	if (typeof window === "undefined" || typeof window.document === "undefined") {
		return undefined;
	}
	const instance = DOMPurify(window);
	if (!instance.isSupported) {
		return undefined;
	}
	instance.addHook("uponSanitizeAttribute", (node, data) => onAttribute(node as Element, data));
	instance.addHook("afterSanitizeAttributes", (node) => afterAttributes(node as Element));
	purifier = instance;
	return purifier;
};

const buildConfig = (options: SanitizeHtmlOptions): Config => {
	const forbiddenTags = [...FORBIDDEN_TAGS];
	const forbiddenAttributes = [...FORBIDDEN_ATTRIBUTES];
	if (options.allowMedia === false) {
		forbiddenTags.push(...MEDIA_TAGS);
	}
	if (options.allowSvg === false) {
		forbiddenTags.push("svg");
	}
	if (options.allowStyles === false) {
		forbiddenAttributes.push("style");
	}
	if (options.allowClasses === false) {
		forbiddenAttributes.push("class");
	}
	return {
		USE_PROFILES: {html: true, svg: options.allowSvg !== false, svgFilters: options.allowSvg !== false, mathMl: true},
		ADD_ATTR: ["target"],
		FORBID_TAGS: forbiddenTags,
		FORBID_ATTR: forbiddenAttributes,
		// KaTeX puts the TeX source in an <annotation>, which is not kept; its
		// text is dropped with it rather than left loose inside the formula.
		ADD_FORBID_CONTENTS: ["annotation", "annotation-xml"],
		ALLOW_UNKNOWN_PROTOCOLS: false,
		ALLOW_DATA_ATTR: true,
		RETURN_TRUSTED_TYPE: false,
	};
};

/**
 * Returns markup that is safe to put into the page with innerHTML or
 * dangerouslySetInnerHTML: formatting is kept, anything that can execute,
 * navigate on its own, load other documents or post a form is removed.
 */
export const sanitizeHtml = (html: string | null | undefined, options: SanitizeHtmlOptions = {}): string => {
	if (html === null || html === undefined) {
		return "";
	}
	const value = typeof html === "string" ? html : String(html);
	if (value === "") {
		return "";
	}
	const instance = getPurifier();
	if (!instance) {
		return escapeHtml(value);
	}
	return instance.sanitize(value, buildConfig(options)) as unknown as string;
};

/**
 * The text an HTML fragment would show, without ever putting the fragment in
 * the page — the parse happens in an inert document, so nothing in it loads
 * or runs. Use it wherever markup is only needed for its words (a preview, a
 * notification, an emoji entity such as `&#x1F600;`).
 */
export const htmlToText = (html: string | null | undefined): string => {
	if (!html) {
		return "";
	}
	if (typeof DOMParser === "undefined") {
		return String(html).replace(/<[^>]*>/g, "");
	}
	return new DOMParser().parseFromString(String(html), "text/html").body.textContent ?? "";
};
