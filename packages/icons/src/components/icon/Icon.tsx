import React, { cloneElement, createElement, isValidElement } from "react";

import { classNames } from "../../common/classNames";
import { namedForwardRef } from "../../common/namedForwardRef";
import * as Classes from "../../common/classes";
import type { IntentProps } from "../../common/intent";
import { isFoundationsIconElement } from "../../common/utils";
import { type IconName, isIconName } from "../../generated/iconNames";
import { IconSvgPaths } from "../../generated/iconPaths";
import { IconSize, type MaybeElement } from "../../icons/iconTypes";
import type { SVGIconProps } from "../../icons/svgIconProps";
import { SVGIconContainer } from "../svg-icon-container/SVGIconContainer";
import "./Icon.css";

export interface IconOwnProps {
    /**
     * Name of an icon, or an icon element, to render. This prop determines the
     * content of the component, but it may be set to a falsy value to render
     * nothing.
     *
     * - `null`, `undefined` or `false` renders nothing.
     * - An `IconName` renders that glyph as an `<svg>`. An unrecognised name
     *   renders a blank icon which still occupies its usual space.
     * - An element is cloned with this component's `className` and intent class
     *   merged onto it. If it is one of this package's icon components, `size`
     *   and `color` are forwarded too, with the element's own values winning.
     *   Prefer rendering such an element directly; this form exists so that
     *   other components can accept `IconName | MaybeElement` for their own
     *   icon props.
     */
    icon: IconName | MaybeElement;
}

export type IconProps<T extends Element = Element> = IntentProps & SVGIconProps<T> & IconOwnProps;

/**
 * `IconProps` with its default type parameter, exported for documentation
 * purposes — prefer `IconProps<T>`.
 */
export interface DefaultIconProps extends IntentProps, SVGIconProps<Element>, IconOwnProps {
    // empty by design; see the comment above
}

export interface IconComponent extends React.FC<IconProps<Element>> {
    <T extends Element = Element>(props: IconProps<T>): React.ReactElement | null;
}

/**
 * Renders an icon by name.
 *
 * ```tsx
 * <Icon icon={IconNames.ADD_LINE} size={IconSize.LARGE} intent={Intent.PRIMARY} />
 * ```
 */
export const Icon: IconComponent = /* @__PURE__ */ namedForwardRef<any, IconProps>("Icon", (props, ref) => {
    const {
        className,
        color,
        htmlTitle,
        icon,
        intent,
        size = IconSize.STANDARD,
        svgProps,
        tagName = "span",
        title,
        ...htmlProps
    } = props;

    if (icon == null || typeof icon === "boolean") {
        return null;
    }

    if (typeof icon !== "string") {
        if (!isValidElement<SVGIconProps>(icon)) {
            return icon;
        }

        // The class names are merged onto any element, but size/color are only
        // meaningful to — and so only forwarded to — our own icon components.
        const mergedClassName = classNames(icon.props.className, className, Classes.intentClass(intent));
        if (!isFoundationsIconElement(icon)) {
            return cloneElement(icon, { className: mergedClassName } as Partial<SVGIconProps>);
        }

        const iconElementProps: SVGIconProps = { ...htmlProps, className: mergedClassName };
        const resolvedSize = icon.props.size ?? props.size;
        if (resolvedSize != null) {
            iconElementProps.size = resolvedSize;
        }
        const resolvedColor = icon.props.color ?? color;
        if (resolvedColor != null) {
            iconElementProps.color = resolvedColor;
        }
        return cloneElement(icon, iconElementProps);
    }

    if (!isIconName(icon)) {
        // Render an empty element of the right size so that an unknown name
        // does not shift the surrounding layout.
        if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
            console.error(`[foundations-icons] Unknown icon name "${icon}".`);
        }
        return createElement(tagName ?? "span", {
            "aria-hidden": true,
            ...htmlProps,
            className: classNames(
                Classes.ICON,
                Classes.iconClass(icon),
                Classes.iconSizeClass(size),
                Classes.intentClass(intent),
                className,
            ),
            "data-icon": icon,
            ref,
            style: { display: "inline-block", height: size, width: size, ...props.style },
            title: htmlTitle,
        });
    }

    return (
        <SVGIconContainer
            className={classNames(Classes.intentClass(intent), className)}
            color={color}
            htmlTitle={htmlTitle}
            iconName={icon}
            ref={ref}
            size={size}
            svgProps={svgProps}
            tagName={tagName}
            title={title}
            {...htmlProps}
        >
            {IconSvgPaths[icon].map((d, index) => (
                <path d={d} fillRule="evenodd" key={index} />
            ))}
        </SVGIconContainer>
    );
});
