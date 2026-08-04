type OmittedDOMAttributes = "children" | "dangerouslySetInnerHTML";

/**
 * The DOM attributes assignable to the root element rendered by an icon
 * component. Deliberately narrow, because the root may be either an HTML
 * element or the `<svg>` itself depending on `tagName`.
 */
export type DefaultSVGIconAttributes = React.AriaAttributes &
    Omit<React.DOMAttributes<Element>, OmittedDOMAttributes> &
    Pick<React.HTMLAttributes<Element>, "id" | "style" | "tabIndex" | "role">;

/**
 * DOM attributes assignable to the root element rendered by an icon component.
 * Narrow it with a type parameter when you need attributes specific to the
 * element you are rendering:
 *
 * ```tsx
 * <Icon<HTMLSpanElement> icon="drag-move-2-line" draggable={false} />
 * ```
 */
export type SVGIconAttributes<T extends Element = Element> = T extends SVGElement
    ? Omit<React.SVGAttributes<T>, OmittedDOMAttributes>
    : T extends HTMLElement
      ? Omit<React.HTMLAttributes<T>, OmittedDOMAttributes>
      : DefaultSVGIconAttributes;

export interface SVGIconOwnProps {
    /** A space-delimited list of class names to pass along to the root element. */
    className?: string;

    /** Icon components do not support child nodes. */
    children?: never;

    /**
     * Colour of the icon. Applied as the `fill` attribute on the `<svg>`, so it
     * overrides both `intent` and any inherited CSS `color`. Omit it to inherit
     * the colour of the surrounding text.
     */
    color?: string;

    /** String for the `title` attribute on the root element, shown as a native browser tooltip. */
    htmlTitle?: string;

    /**
     * Size of the icon, in pixels.
     *
     * @default 16
     */
    size?: number;

    /** CSS style properties applied to the root element. */
    style?: React.CSSProperties;

    /**
     * HTML tag to render as the wrapper element. If `null`, no wrapper is
     * rendered and the `<svg>` becomes the root element.
     *
     * @default "span"
     */
    tagName?: keyof React.JSX.IntrinsicElements | null;

    /**
     * Accessible description of the icon, exposed to screen readers.
     *
     * When this is nullish, `false`, or an empty string the icon is assumed to
     * be decorative and `aria-hidden="true"` is applied — pass `aria-hidden`
     * explicitly to override that.
     */
    title?: string | false | null;

    /** Props to apply to the `<svg>` element. */
    svgProps?: React.SVGAttributes<SVGElement>;
}

/**
 * Props accepted by the statically generated icon components, which have their
 * name and path data baked in.
 */
export type SVGIconProps<T extends Element = Element> = React.RefAttributes<T> &
    SVGIconAttributes<T> &
    SVGIconOwnProps;

/**
 * `SVGIconProps` with its default type parameter, exported for documentation
 * purposes — prefer `SVGIconProps<T>`.
 */
export interface DefaultSVGIconProps extends React.RefAttributes<Element>, SVGIconAttributes<Element>, SVGIconOwnProps {
    // empty by design; see the comment above
}

/**
 * The type of a statically generated icon component.
 *
 * Unlike `<Icon>`, these components are not generic over their root element
 * type: type-checking a generic signature at each of the couple of thousand
 * call sites in `src/generated/components` costs minutes of compile time. Reach
 * for `<Icon icon="…" />` when you need to narrow the root element type.
 */
export type SVGIconComponent = React.ForwardRefExoticComponent<SVGIconProps<Element>>;
