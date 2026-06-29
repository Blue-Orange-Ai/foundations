// Dev-only: keep CRA's runtime error overlay from interrupting on a known,
// benign error thrown deep inside the primitives bubble toolbar.
//
// When a selection spans multiple blocks and one endpoint state can't be
// resolved, `BlockEditor.toolbarGetEditor(s)` is called with an undefined
// `s`; its own catch block then rethrows on `s.uuid`, surfacing as:
//
//   Uncaught TypeError: Cannot read properties of undefined (reading 'uuid')
//       at BlockEditor.toolbarGetEditor (...)
//
// The editor recovers and the operation completes — but the uncaught error
// trips the dev overlay. Until it's fixed upstream in primitives, we swallow
// just this signature (matched by the originating frame) and log it instead.
//
// This lives under src/development and is only imported by the CRA dev entry,
// so it is never part of the published library build.

const SUPPRESSED_FRAME = "toolbarGetEditor";

function isBenignEditorError(error: unknown): boolean {
	if (!error) {
		return false;
	}
	const stack = (error as { stack?: string }).stack ?? "";
	return stack.indexOf(SUPPRESSED_FRAME) !== -1;
}

export function installBenignEditorErrorSuppressor(): void {
	if (typeof window === "undefined") {
		return;
	}

	// Capture phase + stopImmediatePropagation runs before — and prevents —
	// CRA's (bubble-phase) overlay listener on window.
	window.addEventListener(
		"error",
		(event: ErrorEvent) => {
			if (isBenignEditorError(event.error)) {
				event.preventDefault();
				event.stopImmediatePropagation();
				// eslint-disable-next-line no-console
				console.warn(
					"[block-editor] suppressed benign toolbar error:",
					event.error?.message
				);
			}
		},
		true
	);

	window.addEventListener(
		"unhandledrejection",
		(event: PromiseRejectionEvent) => {
			if (isBenignEditorError(event.reason)) {
				event.preventDefault();
				event.stopImmediatePropagation();
				// eslint-disable-next-line no-console
				console.warn(
					"[block-editor] suppressed benign toolbar rejection:",
					event.reason?.message
				);
			}
		},
		true
	);
}
