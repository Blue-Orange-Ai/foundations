/**
 * The two sizes the icon set is designed to be rendered at. Any pixel size is
 * accepted by the `size` prop; these are the two that line up with the rest of
 * the foundations components.
 */
export enum IconSize {
    STANDARD = 16,
    LARGE = 20,
}

/** The `<path d="...">` data which makes up an icon. */
export type IconPaths = string[];

/**
 * The pixel grid every glyph in the set is drawn on. Icons are scaled to the
 * requested `size` through the `<svg>` element's width and height.
 */
export const ICON_VIEWBOX_SIZE = 24;

/** An element, or one of the falsy values that stand in for "render nothing". */
export type MaybeElement = React.JSX.Element | false | null | undefined;
