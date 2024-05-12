import {ReactRenderer} from "@tiptap/react";
import {MentionList} from "../mentionlist/MentionList";
import tippy from 'tippy.js'
import {MentionItem} from "../default/RichText";

export const fetchMentionItems = async (query: string): Promise<MentionItem[]> => {
    try {
        // const response = await axios.get('/api/users', {
        //     params: { search: query },
        // });
        // return response.data;
        const testUsers = [
            'Lea Thompson',
            'Cyndi Lauper',
            'Tom Cruise',
            'Madonna',
            'Jerry Hall',
            'Joan Collins',
            'Winona Ryder',
            'Christina Applegate',
            'Alyssa Milano',
            'Molly Ringwald',
            'Ally Sheedy',
            'Debbie Harry',
            'Olivia Newton-John',
            'Elton John',
            'Michael J. Fox',
            'Axl Rose',
            'Emilio Estevez',
            'Ralph Macchio',
            'Rob Lowe',
            'Jennifer Grey',
            'Mickey Rourke',
            'John Cusack',
            'Matthew Broderick',
            'Justine Bateman',
            'Lisa Bonet',
        ].filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5);
        return testUsers.map(item => {
            return {
                label: item,
                icon: false,
                image: false,
                src: ""
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
                theme: "blue-orange-rich-text-editor-mention-tippy"
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


