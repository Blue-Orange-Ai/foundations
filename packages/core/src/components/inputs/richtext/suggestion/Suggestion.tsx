import {ReactRenderer} from "@tiptap/react";
import {MentionList} from "../mentionlist/MentionList";
import tippy from 'tippy.js'
import {MentionItem} from "../default/RichText";
import {TOOLTIP_Z_INDEX} from "../../../utils/ZIndex";
import passport from "../../../config/BlueOrangePassportConfig";
import {PublicUser, User, UserSearchPublicResult, UserSearchResult} from "@blue-orange-ai/foundations-clients";

const getDisplayName = (user: User | PublicUser) => {
    if (user.name == undefined || user.name == "") {
        return user.username;
    } else {
        return user.name;
    }
}

export const fetchMentionItems = async (query: string): Promise<MentionItem[]> => {
    try {
        var searchResult: UserSearchPublicResult = await passport.searchPublicUsers(
            {
                query: query,
                page: 0,
                size: 10
            });
        var users = searchResult.result;

        return users.map(user => {
            return {
                label: getDisplayName(user),
                icon: false,
                image: false,
                src: "",
                userId: user.id as string
            }
        })


    } catch (error) {
        console.error('Failed to fetch mention items:', error);
        return [];
    }
};

export const renderSuggestions = (props: any, fetchMentionItems: (query: string) => Promise<Array<MentionItem>>) => {
    let component: any;
    let popup: any;

    return {
        onStart: async (props: any) => {
            const items = await fetchMentionItems(props.query);
            component = new ReactRenderer(MentionList, {
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
                theme: "blue-orange-rich-text-editor-mention-tippy",
                zIndex: TOOLTIP_Z_INDEX
            });
        },
        onUpdate: async (props: any) => {
            const items = await fetchMentionItems(props.query);
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


