# @blue-orange-ai/foundations-icons

SVG icons for Foundations, with the API shape that [Blueprint](https://blueprintjs.com/docs/#core/components/icon)
uses: a generic `<Icon icon="…" />` component driven by a name, a statically
typed `IconNames` lookup, per-icon components, and standard sizes and intents.

The glyphs are [Remix Icon](https://remixicon.com) (Apache-2.0), the icon set
already used across the rest of Foundations — this package exposes them as
inline SVG rather than as an icon font, so they can be sized, coloured and
labelled per instance.

## Installation

```bash
npm install @blue-orange-ai/foundations-icons
```

The package has no runtime dependencies beyond React (`^18.2.0 || ^19.0.0`).
Import the stylesheet once, at the root of your application:

```ts
import '@blue-orange-ai/foundations-icons/dist/style.css';
```

The stylesheet is only needed for layout and the intent colours; glyphs are
filled with `currentColor` and inherit the surrounding text colour without it.

## Usage

### By name

```tsx
import { Icon, IconNames, IconSize, Intent } from '@blue-orange-ai/foundations-icons';

<Icon icon={IconNames.ADD_LINE} />
<Icon icon="delete-bin-line" intent={Intent.DANGER} size={IconSize.LARGE} />
<Icon icon="settings-3-line" color="#5c7080" title="Settings" />
```

`IconNames` is a plain object of every name in the set, so referencing icons
through it turns a renamed or removed glyph into a compile error. Raw strings
work too and are checked against the `IconName` union.

### As components

Every icon is also a component, which is the form to reach for when bundle size
matters — see [Bundle size](#bundle-size) below.

```tsx
import { AddLine, DeleteBinLine } from '@blue-orange-ai/foundations-icons';

<AddLine />
<DeleteBinLine size={20} color="#cd4246" />
```

Component names are the PascalCase form of the icon name. The handful of names
which start with a digit are prefixed with `Icon` so that they remain valid
identifiers: `24-hours-line` becomes `Icon24HoursLine`.

### As a prop on other components

`<Icon>` accepts either a name or an element, which lets other components take
a single `icon` prop and support both:

```tsx
interface ButtonProps {
    icon?: IconName | MaybeElement;
}

const Button: React.FC<ButtonProps> = ({ icon, children }) => (
    <button>
        <Icon icon={icon} intent={Intent.PRIMARY} size={IconSize.LARGE} />
        {children}
    </button>
);

<Button icon="add-line" />
<Button icon={<AddLine color="#2d72d2" />} />   // its own colour wins
```

When given an element, `className` and the intent class are merged onto it. If
the element is one of this package's icons, `size` and `color` are forwarded
too, with any value already set on the element taking precedence.

## Props

Both `<Icon>` and the per-icon components accept:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `16` | Rendered size in pixels. `IconSize.STANDARD` (16) and `IconSize.LARGE` (20) match the rest of Foundations, but any size works — the glyphs are vector. |
| `color` | `string` | — | Written to the `<svg>` as `fill`, so it overrides `intent` and inherited text colour. |
| `title` | `string \| false \| null` | — | Accessible description. Without one, the icon is treated as decorative and marked `aria-hidden`. |
| `htmlTitle` | `string` | — | Native browser tooltip on the wrapper element. |
| `tagName` | `keyof JSX.IntrinsicElements \| null` | `"span"` | Wrapper element. `null` renders the bare `<svg>` as the root. |
| `className` | `string` | — | Applied to the root element. |
| `svgProps` | `React.SVGAttributes<SVGElement>` | — | Applied to the `<svg>`. |

`<Icon>` additionally takes:

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `IconName \| MaybeElement` | The icon to render. Nullish or `false` renders nothing; an unknown name renders a blank icon which still occupies its space. |
| `intent` | `Intent` | One of `NONE`, `PRIMARY`, `SUCCESS`, `WARNING`, `DANGER`. |

Standard DOM attributes and a `ref` are forwarded to the root element. `<Icon>`
is generic over that element's type when you need attributes specific to it:

```tsx
<Icon<HTMLSpanElement> icon="drag-move-2-line" draggable={false} />
```

The per-icon components are not generic — see the note on `SVGIconComponent` in
`src/icons/svgIconProps.ts` for why.

## Rendered markup

```html
<span class="foundations-icon foundations-icon-add-line foundations-icon-standard" aria-hidden="true">
    <svg data-icon="add-line" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" role="img">
        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill-rule="evenodd"></path>
    </svg>
</span>
```

Every glyph is drawn on a 24px grid, so `viewBox` is always `0 0 24 24` and the
`size` prop is applied through the `<svg>` width and height. The class names are
exported as `Classes` (`Classes.ICON`, `Classes.iconClass(name)`,
`Classes.intentClass(intent)`) for styling hooks.

Intent colours can be overridden through the same CSS custom property scheme
used elsewhere in Foundations:

```css
:root {
    --blue-orange-light-icon-intent-danger-color: #b91c1c;
    --blue-orange-dark-icon-intent-danger-color: #fca5a5;
}
```

## Bundle size

The full set is about 2,600 icons. Importing individual icon components pulls in
only the glyphs you name — the generated declarations are annotated `@__PURE__`
so bundlers can drop the rest:

```tsx
import { AddLine } from '@blue-orange-ai/foundations-icons';   // ~2 kB
```

The name-based API cannot be narrowed this way, because any name may be looked
up at runtime. `<Icon icon="…" />` therefore brings the whole set (~430 kB
gzipped) with it. Both forms render identically, so use `<Icon>` where the icon
is dynamic and the components where it is not.

## Other exports

| Export | Description |
|--------|-------------|
| `IconSvgPaths` | Path data for every icon, keyed by name. |
| `getIconPaths(name)` | Path data for one icon, or `undefined` for an unknown name. |
| `isIconName(name)` | Type guard narrowing a string to `IconName`. |
| `IconCategories`, `IconCategoryNames` | The icons grouped into the categories they ship in. |
| `SVGIconContainer` | The shared `<svg>` wrapper, for rendering a glyph the set does not contain. |

## Development

```bash
npm install
npm start        # icon gallery: search, size, intent and theme controls
npm test
npm run build
```

### Regenerating the icon set

`src/generated/` is produced from the SVG sources in `remixicon` and is checked
in, so a normal build never needs to regenerate it. After bumping the
`remixicon` devDependency:

```bash
npm run generate
```

The generator asserts that every source glyph is a single `<path>` on a 24×24
grid with no presentation attributes, and that no two icons collide after name
conversion, so an upstream change that breaks those assumptions fails loudly
rather than silently producing broken icons.

## Differences from Blueprint

- Glyphs come from Remix Icon and are drawn on a single 24px grid, so `size` is
  a pure scale factor. Blueprint ships separate 16px and 20px artwork and picks
  between them.
- Icons are always available synchronously. Blueprint 5 loads path data through
  `Icons.load()` and a pluggable loader; there is no equivalent here.
- Class names use the `foundations-` prefix rather than `bp5-`, and there is no
  icon-font fallback.
