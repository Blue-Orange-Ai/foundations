import {Link} from '@tiptap/extension-link'
import {Plugin, PluginKey} from '@tiptap/pm/state'
import {isSafeUrl, sanitizeUrl} from '../../../utils/SanitizeUrl'

// The editors' link mark. TipTap's own link already refuses `javascript:` and
// other unsafe schemes, but it copies `target`, `rel` and `class` from whatever
// content it is given, and opens a clicked link with window.open without
// `noopener` — so a stored link could name another window to take over, or
// get a handle back to this page. Here every link opens in a new tab with
// `noopener noreferrer`, whatever the content says.

export const SAFE_LINK_REL = 'noopener noreferrer nofollow'

const SafeLinkClickKey = new PluginKey('safeLinkClick')

export const SafeLink = Link.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            // Clicks are handled below instead, with noopener.
            openOnClick: false,
            protocols: ['ftp', 'mailto'],
            // TipTap's own scheme check, and ours on top of it.
            isAllowedUri: (url: string, ctx: {defaultValidate: (url: string) => boolean}) =>
                ctx.defaultValidate(url) && isSafeUrl(url),
            HTMLAttributes: {
                target: '_blank',
                rel: SAFE_LINK_REL,
                class: null,
            },
        }
    },

    addAttributes() {
        return {
            ...this.parent?.(),
            target: {
                default: '_blank',
                parseHTML: () => '_blank',
                renderHTML: () => ({target: '_blank'}),
            },
            rel: {
                default: SAFE_LINK_REL,
                parseHTML: () => SAFE_LINK_REL,
                renderHTML: () => ({rel: SAFE_LINK_REL}),
            },
            class: {
                default: null,
                parseHTML: () => null,
                renderHTML: () => ({}),
            },
        }
    },

    addProseMirrorPlugins() {
        const plugins = this.parent?.() ?? []
        return [
            ...plugins,
            new Plugin({
                key: SafeLinkClickKey,
                props: {
                    handleClick: (view, _pos, event) => {
                        if (event.button !== 0 || !view.editable) {
                            return false
                        }
                        const target = event.target as HTMLElement | null
                        const anchor = target && typeof target.closest === 'function' ? target.closest('a') : null
                        if (!anchor || !view.dom.contains(anchor)) {
                            return false
                        }
                        const href = sanitizeUrl(anchor.getAttribute('href'))
                        if (!href) {
                            return false
                        }
                        window.open(href, '_blank', 'noopener,noreferrer')
                        return true
                    },
                },
            }),
        ]
    },
})
