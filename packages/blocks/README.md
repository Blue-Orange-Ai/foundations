# @blue-orange-ai/foundations-blocks

**Blocks** are whole views assembled out of `core` components — the screens an
app needs but shouldn't have to compose from scratch. Where `core` ships a
button, blocks ships the settings page the button belongs on.

The first block is **Appearance**: a preferences page for the theme and the
default emoji skin tone.

## Install

```bash
npm install @blue-orange-ai/foundations-blocks
```

Import both stylesheets once in your app — blocks renders core components, so
core's styles are required alongside its own:

```ts
import '@blue-orange-ai/foundations-core/dist/style.css';
import '@blue-orange-ai/foundations-blocks/dist/style.css';
```

## Appearance

```tsx
import { Appearance } from '@blue-orange-ai/foundations-blocks';

function SettingsPage() {
  return <Appearance />;
}
```

That is the whole integration. The block reads its current state from cookies on
mount, applies it, and writes any change straight back — there is nothing to
wire up and no state to hold.

### Theme preference

Three choices: **Light**, **Dark** and **System**. They are stored across two
cookies:

| Cookie | Value | Written |
| --- | --- | --- |
| `theme` | `light` or `dark` | Always — it holds the **effective** theme, never the word "system" |
| `theme-system` | `light` or `dark` | Only while System is selected; it holds the scheme the operating system is reporting |

Splitting it this way means anything that only needs to know which way to paint
— your server rendering the first response, another component, a sibling app on
the same domain — reads `theme` and needs no knowledge of the system option at
all. The presence of `theme-system` is what marks the preference as "follow the
OS", and choosing an explicit Light or Dark deletes it.

While System is selected the block listens to `prefers-color-scheme` and
re-applies both cookies the moment the operating system flips, so a machine that
switches to dark at sunset carries the app with it.

Applying a theme means toggling the `dark` class on `<body>` — the signal the
rest of Foundations themes itself from.

Because a settings page is rarely the first screen a user lands on, call
`initialiseTheme()` when the app boots so the stored preference is in force
everywhere:

```ts
import { initialiseTheme } from '@blue-orange-ai/foundations-blocks';

// Returns a teardown function; also starts following the OS if that is the preference.
initialiseTheme();
```

### Emoji skin tone

Six options from the tone-less yellow default through the five Fitzpatrick
modifiers, stored in the `skinTone` cookie as `0`–`5`. This is the same cookie
core's emoji picker already reads, so a tone chosen here applies to every picker
in the app.

### Props

Every prop is optional — `<Appearance />` is a complete page.

| Prop | Default | Purpose |
| --- | --- | --- |
| `themePreference` / `onThemePreferenceChange` | — | Drive the theme choice from outside; omit to let the block track the cookies itself |
| `skinTone` / `onSkinToneChange` | — | Same, for the skin tone |
| `persist` | `true` | Set false to apply preferences without writing any cookies |
| `cookieOptions` | 1 year, `path: /`, `sameSite: lax` | Expiry, path, domain and friends for every cookie the page writes |
| `themeCookieName` | `theme` | |
| `systemThemeCookieName` | `theme-system` | |
| `skinToneCookieName` | `skinTone` | |
| `heading` | `true` | Set false to drop the page heading when embedding the block in an existing page |
| `padded` | `true` | Set false to render without page padding, e.g. inside a drawer or a tab |

The two selectors are exported on their own (`ThemePreferenceSelector`,
`EmojiSkinToneSelector`) for anyone assembling a different page, along with the
cookie helpers: `getThemePreference`, `applyThemePreference`, `resolveTheme`,
`getSystemTheme`, `watchSystemTheme`, `initialiseTheme`, `getEmojiSkinTone` and
`setEmojiSkinTone`.

## Theming

The selectable tiles read `--blue-orange-{light|dark}-appearance-option-*`
variables — border, hover border, selected border, background, text and muted
text. Each is declared with the default baked in as a `var()` fallback, so the
block looks right in an app that has not copied them into its `:root`; defining
them overrides it. `packages/blocks/src/index.css` carries the full set.

## Development

```bash
cd packages/blocks
npm start   # dev harness at src/development — the block, a live cookie read-out
            # and a real emoji picker to see the skin tone take effect
npm run build
npm test
```
