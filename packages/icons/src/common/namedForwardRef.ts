import { forwardRef } from "react";

import { DISPLAY_NAME_PREFIX } from "./utils";

/**
 * Wraps a render function in `forwardRef` and gives the result a display name.
 *
 * Setting `displayName` on a component at the top level of a module reads as a
 * side effect to bundlers, which then have to keep the component — and
 * everything it references, up to and including the whole icon set — in every
 * consumer's bundle. Doing it inside a function instead lets each declaration
 * be marked `@__PURE__` and dropped when it goes unused.
 */
export function namedForwardRef<T, P>(
    displayName: string,
    render: React.ForwardRefRenderFunction<T, React.PropsWithoutRef<P>>,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> {
    const component = forwardRef<T, P>(render);
    component.displayName = `${DISPLAY_NAME_PREFIX}${displayName}`;
    return component;
}
