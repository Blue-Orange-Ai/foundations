// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// jsdom has no layout, so it never implements scrollIntoView — components that
// keep a focused item in view call it on render and would throw without this.
// Guarded so tests that run without a DOM (server rendering) can share this setup.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = () => {};
}

// jsdom's Blob has no stream(); Shiki's inlined WASM loader reads its binary
// through one, as browsers allow. Back it with arrayBuffer().
if (typeof Blob !== 'undefined' && typeof Blob.prototype.stream !== 'function') {
	Blob.prototype.stream = function stream(this: Blob) {
		const blob = this;
		return new ReadableStream({
			async start(controller) {
				controller.enqueue(new Uint8Array(await blob.arrayBuffer()));
				controller.close();
			},
		});
	} as Blob['stream'];
}

// jsdom does no layout, so Range has no geometry. ProseMirror measures the
// selection to scroll it into view (TipTap 3 does so after commands such as
// clearing a submitted comment); an empty rect is all it needs.
if (typeof Range !== 'undefined') {
	const emptyRect = () => new DOMRect(0, 0, 0, 0);
	if (typeof Range.prototype.getBoundingClientRect !== 'function') {
		Range.prototype.getBoundingClientRect = emptyRect;
	}
	if (typeof Range.prototype.getClientRects !== 'function') {
		Range.prototype.getClientRects = () => {
			const rects: DOMRect[] = [];
			return Object.assign(rects, {item: (index: number) => rects[index] ?? null}) as unknown as DOMRectList;
		};
	}
}
