// URLs that come from data rather than from the code — a link in a comment, a
// logo someone configured, a redirect after sign in — can carry a script of
// their own (`javascript:`), or a whole document (`data:text/html`). React 18
// renders those as written and only React 19 refuses them, so anything that
// puts a URL taken from data into an href or a navigation passes it through
// here first.

/** Schemes a link may use when nothing narrower is asked for. */
export const SAFE_LINK_PROTOCOLS: ReadonlyArray<string> = [
	"http:",
	"https:",
	"mailto:",
	"tel:",
	"ftp:",
	"ftps:",
];

/** Schemes an image, audio or video source may use. */
export const SAFE_MEDIA_PROTOCOLS: ReadonlyArray<string> = [
	"http:",
	"https:",
	"blob:",
];

export interface SanitizeUrlOptions {
	/** Schemes that are let through, with their trailing colon. Defaults to SAFE_LINK_PROTOCOLS. */
	protocols?: ReadonlyArray<string>;
	/** Lets a relative URL (`/path`, `page`, `#anchor`, `?query`) through. Defaults to true. */
	allowRelative?: boolean;
	/** Lets `data:image/*` URLs through, for image sources. SVG is never let through. Defaults to false. */
	allowDataImages?: boolean;
}

// Browsers drop leading and trailing control characters and spaces, and every
// tab and newline anywhere in a URL, before they look for its scheme — so
// `java\tscript:` is still a script. The scheme is judged on what the browser
// will actually see.
const STRIPPED_ANYWHERE = /[\t\n\r]/g;
const STRIPPED_AT_ENDS = /^[\u0000- ]+|[\u0000- ]+$/g;
const HAS_SCHEME = /^[a-z][a-z0-9+.\-]*:/i;
const SAFE_DATA_IMAGE = /^data:image\/(png|gif|jpe?g|webp|avif|bmp|x-icon);base64,[a-z0-9+\/=\s]*$/i;

const normalise = (url: string): string => url.replace(STRIPPED_ANYWHERE, "").replace(STRIPPED_AT_ENDS, "");

/**
 * Returns the URL when its scheme is one of the allowed ones (or it is
 * relative), and undefined otherwise. The URL is handed back as it was given,
 * trimmed; it is never rewritten.
 */
export const sanitizeUrl = (url: unknown, options: SanitizeUrlOptions = {}): string | undefined => {
	if (typeof url !== "string") {
		return undefined;
	}
	const protocols = options.protocols ?? SAFE_LINK_PROTOCOLS;
	const allowRelative = options.allowRelative ?? true;
	const normalised = normalise(url);
	if (normalised === "") {
		return undefined;
	}
	if (!HAS_SCHEME.test(normalised)) {
		// No scheme of its own, so it resolves against the page. `//host` is
		// still relative in form, and keeps the page's (safe) scheme.
		return allowRelative ? url.trim() : undefined;
	}
	if (options.allowDataImages && SAFE_DATA_IMAGE.test(normalised)) {
		return url.trim();
	}
	let protocol: string;
	try {
		protocol = new URL(normalised).protocol.toLowerCase();
	} catch (e) {
		return undefined;
	}
	return protocols.map(item => item.toLowerCase()).includes(protocol) ? url.trim() : undefined;
};

/** True when sanitizeUrl would let the URL through. */
export const isSafeUrl = (url: unknown, options?: SanitizeUrlOptions): boolean =>
	sanitizeUrl(url, options) !== undefined;

/**
 * For image, audio and video sources: http(s), blob and raster `data:` images.
 * An SVG `data:` URL is refused, since opened on its own it runs its scripts.
 */
export const sanitizeMediaUrl = (url: unknown): string | undefined =>
	sanitizeUrl(url, {protocols: SAFE_MEDIA_PROTOCOLS, allowDataImages: true});

/**
 * Where to send the browser after something like a sign in, taken from a query
 * parameter or other data. Only a path on this site is accepted — anything
 * that would leave the origin (`https://elsewhere`, `//elsewhere`,
 * `/\elsewhere`, `javascript:`) gives the fallback instead.
 */
export const sanitizeRedirect = (url: unknown, fallback: string = "/"): string => {
	if (typeof url !== "string") {
		return fallback;
	}
	const normalised = normalise(url);
	const hasWindow = typeof window !== "undefined" && !!window.location;
	// An absolute URL is accepted only when it points back at this site, and
	// is reduced to its path.
	if (hasWindow && HAS_SCHEME.test(normalised)) {
		try {
			const absolute = new URL(normalised);
			if ((absolute.protocol === "http:" || absolute.protocol === "https:") && absolute.origin === window.location.origin) {
				return sitePath(absolute);
			}
		} catch (e) {
			// Not a URL at all.
		}
		return fallback;
	}
	if (!normalised.startsWith("/") || normalised.startsWith("//") || normalised.startsWith("/\\")) {
		return fallback;
	}
	if (!hasWindow) {
		return normalised;
	}
	try {
		const resolved = new URL(normalised, window.location.origin);
		if (resolved.origin !== window.location.origin) {
			return fallback;
		}
		return sitePath(resolved);
	} catch (e) {
		return fallback;
	}
};

// Dot segments can leave a path that starts with more than one slash
// (`/..//elsewhere` resolves to `//elsewhere`), which a browser would read as
// another host, so the leading run is collapsed to a single slash.
const sitePath = (url: URL): string =>
	url.pathname.replace(/^[\/\\]+/, "/") + url.search + url.hash;
