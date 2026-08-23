/**
 * Fullscreen support for the viewer.
 *
 * The @embedpdf fullscreen plugin only performs the actual
 * `requestFullscreen()` call from the wrapper component exported by its
 * `/react` entry point; registering the plugin package on its own leaves
 * `toggleFullscreen()` as a no-op. Rather than injecting that wrapper div
 * between the viewer root and its flex layout, the viewer drives the
 * Fullscreen API itself against the root element — which keeps the theme
 * class, the CSS custom properties and all of the chrome inside the
 * fullscreened surface.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';

/** Safari (and older WebKit) still only expose the prefixed API. */
type FullscreenDocument = Document & {
	webkitFullscreenElement?: Element | null;
	webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenTarget = HTMLElement & {
	webkitRequestFullscreen?: () => Promise<void> | void;
};

const currentFullscreenElement = (): Element | null => {
	if (typeof document === 'undefined') return null;
	const doc = document as FullscreenDocument;
	return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
};

export interface PdfFullscreen {
	/** True while the viewer root is the document's fullscreen element. */
	isFullscreen: boolean;
	enter(): void;
	exit(): void;
	toggle(): void;
}

export const usePdfFullscreen = (
	rootRef: RefObject<HTMLDivElement | null>,
): PdfFullscreen => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	// `fullscreenchange` also fires when the user leaves with Esc or F11, so the
	// state stays in sync with the browser rather than with our own calls.
	useEffect(() => {
		const sync = () => setIsFullscreen(currentFullscreenElement() === rootRef.current);
		sync();
		document.addEventListener('fullscreenchange', sync);
		document.addEventListener('webkitfullscreenchange', sync);
		return () => {
			document.removeEventListener('fullscreenchange', sync);
			document.removeEventListener('webkitfullscreenchange', sync);
		};
	}, [rootRef]);

	const enter = useCallback(() => {
		const element = rootRef.current as FullscreenTarget | null;
		if (!element || currentFullscreenElement()) return;
		const request = element.requestFullscreen ?? element.webkitRequestFullscreen;
		if (!request) return;
		// The request rejects when the gesture is not user-initiated or the
		// element is inside an iframe without `allowfullscreen`.
		Promise.resolve(request.call(element)).catch(() => undefined);
	}, [rootRef]);

	const exit = useCallback(() => {
		const doc = document as FullscreenDocument;
		if (!currentFullscreenElement()) return;
		const release = doc.exitFullscreen ?? doc.webkitExitFullscreen;
		if (!release) return;
		Promise.resolve(release.call(doc)).catch(() => undefined);
	}, []);

	const toggle = useCallback(() => {
		if (currentFullscreenElement() === rootRef.current) {
			exit();
		} else {
			enter();
		}
	}, [enter, exit, rootRef]);

	return useMemo(
		() => ({ isFullscreen, enter, exit, toggle }),
		[isFullscreen, enter, exit, toggle],
	);
};
