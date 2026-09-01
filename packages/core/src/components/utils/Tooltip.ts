/**
 * Popper places an `absolute` popup in document coordinates: it takes the reference element's
 * viewport rect and adds the page scroll back on. A reference inside a `position: fixed` overlay —
 * an input in an open modal or drawer window — does not move with that scroll, so on a scrolled
 * page every tooltip landed a full page-scroll further down, below the modal it belongs to.
 *
 * The fixed strategy positions straight off the viewport rect, which is the correct answer both
 * inside an overlay and on the page, and popper keeps following the reference on scroll either way.
 *
 * Only for tooltips left on the default `appendTo` (the body). A tooltip appended into the caller's
 * own tree — AdvancedTooltip — must stay on the absolute strategy, because an ancestor there may
 * carry a transform and become the containing block a fixed popup would then be measured against.
 */
export const TOOLTIP_POPPER_OPTIONS = {
	strategy: "fixed" as const
};
