import { isValidElement } from "react";

/** Prefix applied to the display name of every component in this package. */
export const DISPLAY_NAME_PREFIX = "Foundations.";

/**
 * Whether the element was produced by one of this package's icon components,
 * and therefore understands the `size` and `color` props.
 */
export function isFoundationsIconElement(element: unknown): element is React.JSX.Element {
    if (!isValidElement(element)) {
        return false;
    }
    const displayName = (element.type as React.ComponentType | undefined)?.displayName;
    return typeof displayName === "string" && displayName.startsWith(DISPLAY_NAME_PREFIX);
}
