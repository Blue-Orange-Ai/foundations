import {ReactRenderer} from "@tiptap/react";
import tippy from "tippy.js";
import UnicodeEmoji, {EmojiObj} from "../../emoji/data/UnicodeEmoji";
import {EmojiList} from "../emojilist/EmojiList";

export const fetchEmojiItems = (query: string): EmojiObj[] => {
    try {
        if (query == "") {
            return []
        }
        const flatEmojis = UnicodeEmoji.getFlat().filter(item => item.uuid.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5);
        return flatEmojis

    } catch (error) {
        console.error('Failed to fetch mention items:', error);
        return [];
    }
};

export const renderEmojiSuggestions = (props: any, fetchEmojiItems: (query: string) => Array<EmojiObj>) => {
    let component: any;
    let popup: any;

    return {
        onStart: async (props: any) => {
            const items = await fetchEmojiItems(props.query);
            component = new ReactRenderer(EmojiList, {
                props: { items, command: props.command },
                editor: props.editor,
            });
            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                theme: "blue-orange-rich-text-editor-mention-tippy"
            });
        },
        onUpdate: async (props: any) => {
            const items = fetchEmojiItems(props.query);
            component.updateProps({ items, command: props.command });
            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            });
        },
        onKeyDown: (props: any) => {
            try{
                if (props.event.key === 'Escape') {
                    popup[0].hide();
                    return true;
                }
                return (component.ref as any)?.onKeyDown(props);
            } catch (e) {
                console.error(e)
            }
        },
        onExit: () => {
            try{
                popup[0].destroy();
                component.destroy();
            } catch (e) {
                console.error(e)
            }

        },
    };
};