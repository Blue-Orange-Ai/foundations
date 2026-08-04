import React from "react";

import { namedForwardRef } from "../common/namedForwardRef";
import { SVGIconContainer } from "../components/svg-icon-container/SVGIconContainer";
import type { IconName } from "../generated/iconNames";
import type { IconPaths } from "./iconTypes";
import type { SVGIconComponent, SVGIconProps } from "./svgIconProps";

/**
 * Builds a component which renders a single, statically known glyph. This is
 * what every component in `src/generated/components` is made of.
 *
 * Each generated call is annotated `@__PURE__` so that bundlers can drop the
 * icons an application never references; keeping the whole set out of a
 * consumer's bundle depends on this factory staying free of side effects.
 */
export function createIcon(displayName: string, iconName: IconName, paths: IconPaths): SVGIconComponent {
    return namedForwardRef<Element, SVGIconProps>(displayName, (props, ref) => (
        <SVGIconContainer iconName={iconName} ref={ref} {...props}>
            {paths.map((d, index) => (
                <path d={d} fillRule="evenodd" key={index} />
            ))}
        </SVGIconContainer>
    ));
}
