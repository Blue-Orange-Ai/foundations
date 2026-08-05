// Tippy appends its popups to <body> by default, so they do not nest inside the
// overlay that triggered them — they become siblings of the portalled modal and
// drawer windows and have to out-rank those on z-index to stay visible.
//
// Tippy's own default is 9999, which loses to the modal window (99999999) and left
// tooltips and dropdown popups painting behind an open modal.

/**
 * Tippy popups — tooltips, button dropdowns, richtext suggestions. Sits above the
 * modal and drawer windows (99999999, see Modal.css / Drawer.css) and below the
 * toast layer (2147483647, see ToastContext.css), which owns the top of the stack.
 */
export const TOOLTIP_Z_INDEX = 100000000;
