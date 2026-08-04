import React, { createElement, useId } from "react";

import { classNames } from "../../common/classNames";
import { namedForwardRef } from "../../common/namedForwardRef";
import * as Classes from "../../common/classes";
import type { IconName } from "../../generated/iconNames";
import { ICON_VIEWBOX_SIZE, IconSize } from "../../icons/iconTypes";
import type { SVGIconProps } from "../../icons/svgIconProps";
import "./SVGIconContainer.css";

export type SVGIconContainerProps<T extends Element = Element> = Omit<SVGIconProps<T>, "children"> & {
    /** Name of the icon being rendered, used for the `data-icon` attribute and the modifier class. */
    iconName: IconName;

    /** The `<path>` elements which make up the glyph. */
    children: React.JSX.Element | React.JSX.Element[];
};

export interface SVGIconContainerComponent extends React.FC<SVGIconContainerProps<Element>> {
    <T extends Element = Element>(props: SVGIconContainerProps<T>): React.ReactElement | null;
}

/**
 * Renders the `<svg>` wrapper shared by every icon in the set. This is the
 * single place that knows about the pixel grid the glyphs are drawn on, so
 * callers only ever deal in rendered pixel sizes.
 */
export const SVGIconContainer: SVGIconContainerComponent = /* @__PURE__ */ namedForwardRef<
    any,
    SVGIconContainerProps
>("SVGIconContainer", (props, ref) => {
    const {
        children,
        className,
        color,
        htmlTitle,
        iconName,
        size = IconSize.STANDARD,
        svgProps,
        tagName = "span",
        title,
        ...htmlProps
    } = props;

    const titleId = useId();
    const sharedSvgProps: React.SVGProps<SVGSVGElement> = {
        // `currentColor` rather than a bare omission so that icons inherit the
        // surrounding text colour even when the stylesheet has not been loaded.
        fill: color ?? "currentColor",
        height: size,
        role: "img",
        viewBox: `0 0 ${ICON_VIEWBOX_SIZE} ${ICON_VIEWBOX_SIZE}`,
        width: size,
        ...svgProps,
    };

    if (tagName === null) {
        return (
            <svg
                aria-hidden={title ? undefined : true}
                aria-labelledby={title ? titleId : undefined}
                data-icon={iconName}
                ref={ref}
                {...sharedSvgProps}
                {...(htmlProps as React.SVGAttributes<SVGSVGElement>)}
                className={classNames(className, svgProps?.className)}
            >
                {title && <title id={titleId}>{title}</title>}
                {children}
            </svg>
        );
    }

    return createElement(
        tagName,
        {
            "aria-hidden": title ? undefined : true,
            ...htmlProps,
            className: classNames(Classes.ICON, Classes.iconClass(iconName), Classes.iconSizeClass(size), className),
            ref,
            title: htmlTitle,
        },
        <svg data-icon={iconName} {...sharedSvgProps} className={svgProps?.className}>
            {title && <title>{title}</title>}
            {children}
        </svg>,
    );
});
