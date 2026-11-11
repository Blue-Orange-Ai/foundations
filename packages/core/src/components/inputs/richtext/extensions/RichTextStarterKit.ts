import {StarterKit} from '@tiptap/starter-kit'

// TipTap 3's StarterKit grew Link, Underline, TrailingNode and ListKeymap.
// The editors bring their own link mark (SafeLink), so the bundled one must be
// left out — two `link` marks would clash — and the other additions are kept
// off so stored documents and the editors' behaviour match TipTap 2's kit.
export const RichTextStarterKit = StarterKit.configure({
    link: false,
    underline: false,
    trailingNode: false,
    listKeymap: false,
})
