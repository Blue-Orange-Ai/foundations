import Mention from '@tiptap/extension-mention';
import { Node } from '@tiptap/core';

const CustomMention = Mention.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            userId: {
                default: null,
                parseHTML: element => element.getAttribute('data-user-id'),
                renderHTML: attributes => {
                    return {
                        'data-user-id': attributes.userId,
                    };
                },
            },
        };
    },
});

export default CustomMention;