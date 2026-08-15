// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// ---------------------------------------------------------------------------
// jsdom gaps
//
// The App smoke test mounts the real primitives BlockEditor (plus codemirror
// and plyr), which reaches for browser APIs jsdom does not implement. The
// primitives bundle calls window.matchMedia at module scope, so the import
// itself throws without these — the suite fails to collect before a test runs.
//
// Every shim is installed only when the API is genuinely missing, so a real
// jsdom implementation is never clobbered. They are plain functions and
// classes rather than vi.fn()s on purpose: this package's vitest config sets
// `mockReset: true`, which would strip a mock's implementation before each
// test and leave the shims inert.
// ---------------------------------------------------------------------------

if (!window.matchMedia) {
	window.matchMedia = function matchMedia(query: string): MediaQueryList {
		return {
			matches: false,
			media: query,
			onchange: null,
			addListener: () => undefined,    // deprecated, still used by older libs
			removeListener: () => undefined, // deprecated, still used by older libs
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
			dispatchEvent: () => false,
		} as unknown as MediaQueryList;
	};
}

if (!(window as any).ResizeObserver) {
	class ResizeObserverShim {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	(window as any).ResizeObserver = ResizeObserverShim;
	(global as any).ResizeObserver = ResizeObserverShim;
}

if (!(window as any).IntersectionObserver) {
	class IntersectionObserverShim {
		readonly root = null;
		readonly rootMargin = "";
		readonly thresholds: number[] = [];
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords(): any[] { return []; }
	}
	(window as any).IntersectionObserver = IntersectionObserverShim;
	(global as any).IntersectionObserver = IntersectionObserverShim;
}

if (!Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = function scrollIntoView() {};
}

// jsdom implements Range but not its measurement methods, which editors call
// while positioning carets, toolbars and tooltips.
if (typeof Range !== "undefined") {
	if (!Range.prototype.getClientRects) {
		Range.prototype.getClientRects = function getClientRects(): any {
			const list: any = [];
			list.item = () => null;
			return list;
		};
	}
	if (!Range.prototype.getBoundingClientRect) {
		Range.prototype.getBoundingClientRect = function getBoundingClientRect(): any {
			return {x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => ({})};
		};
	}
}
