import { mergeAttributes, Node } from '@tiptap/core'
import { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'

export type EmojiMentionOptions = {
    HTMLAttributes: Record<string, any>
    /** @deprecated use renderText and renderHTML instead  */
    renderLabel?: (props: { options: EmojiMentionOptions; node: ProseMirrorNode }) => string
    renderText: (props: { options: EmojiMentionOptions; node: ProseMirrorNode }) => string
    renderHTML: (props: { options: EmojiMentionOptions; node: ProseMirrorNode }) => DOMOutputSpec
    deleteTriggerWithBackspace: boolean
    suggestion: Omit<SuggestionOptions, 'editor'>
}

export const MentionPluginKey = new PluginKey('emojimention')

export const EmojiMention = Node.create<EmojiMentionOptions>({
    name: 'emojimention',

    addOptions() {
        return {
            HTMLAttributes: {},
            renderText({ options, node }) {
                return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
            },
            deleteTriggerWithBackspace: false,
            renderHTML({ options, node }) {
                return [
                    'span',
                    mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
                    `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
                ]
            },
            suggestion: {
                char: '@',
                pluginKey: MentionPluginKey,
                command: ({ editor, range, props }: any) => {
                    // increase range.to by one when the next node is of type "text"
                    // and starts with a space character
                    const nodeAfter = editor.view.state.selection.$to.nodeAfter
                    const overrideSpace = nodeAfter?.text?.startsWith(' ')

                    if (overrideSpace) {
                        range.to += 1
                    }

                    editor
                        .chain()
                        .focus()
                        .insertContentAt(range, [
                            {
                                type: this.name,
                                attrs: props,
                            },
                            {
                                type: 'text',
                                text: ' ',
                            },
                        ])
                        .run()

                    window.getSelection()?.collapseToEnd()
                },
                allow: ({ state, range }: any) => {
                    const $from = state.doc.resolve(range.from)
                    const type = state.schema.nodes[this.name]
                    const allow = !!$from.parent.type.contentMatch.matchType(type)

                    return allow
                },
            },
        }
    },

    group: 'inline',

    inline: true,

    selectable: false,

    atom: true,

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => {
                    if (!attributes.id) {
                        return {}
                    }

                    return {
                        'data-id': attributes.id,
                    }
                },
            },

            label: {
                default: null,
                parseHTML: element => element.getAttribute('data-label'),
                renderHTML: attributes => {
                    if (!attributes.label) {
                        return {}
                    }

                    return {
                        'data-label': attributes.label,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: `span[data-type="${this.name}"]`,
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        if (this.options.renderLabel !== undefined) {
            console.warn('renderLabel is deprecated use renderText and renderHTML instead')
            return [
                'span',
                mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
                this.options.renderLabel({
                    options: this.options,
                    node,
                }),
            ]
        }
        const mergedOptions = { ...this.options }

        mergedOptions.HTMLAttributes = mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes)
        const html = this.options.renderHTML({
            options: mergedOptions,
            node,
        })

        if (typeof html === 'string') {
            return [
                'span',
                mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
                html,
            ]
        }
        return html
    },

    renderText({ node }) {
        if (this.options.renderLabel !== undefined) {
            console.warn('renderLabel is deprecated use renderText and renderHTML instead')
            return this.options.renderLabel({
                options: this.options,
                node,
            })
        }
        return this.options.renderText({
            options: this.options,
            node,
        })
    },

    addKeyboardShortcuts() {
        return {
            Backspace: () => this.editor.commands.command(({ tr, state }) => {
                let isMention = false
                const { selection } = state
                const { empty, anchor } = selection

                if (!empty) {
                    return false
                }

                state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                    if (node.type.name === this.name) {
                        isMention = true
                        tr.insertText(
                            this.options.deleteTriggerWithBackspace ? '' : this.options.suggestion.char || '',
                            pos,
                            pos + node.nodeSize,
                        )

                        return false
                    }
                })

                return isMention
            }),
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})