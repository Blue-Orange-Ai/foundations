import {
    isRichTextDocumentEmpty,
    RichTextContent,
    RichTextDocument,
    RichTextNode,
    richTextToPlainText,
    serializeRichTextDocument,
    toRichTextDocument,
} from '@blue-orange-ai/foundations-core';

// A message's content is the composer's TipTap JSON document, serialized — or,
// for messages sent before that, the composer's HTML. Either way it was written
// by another member (or by anyone who can call the chat API), so it is only
// ever read as a document: rendered with RenderRichText, previewed as plain
// text, and never handed to innerHTML.

const isBlankInline = (node: RichTextNode): boolean =>
    node.type === 'hardBreak' || (node.type === 'text' && (node.text ?? '').trim() === '');

const isEmptyParagraph = (node: RichTextNode | undefined): boolean =>
    !!node && node.type === 'paragraph' && (node.content ?? []).every(isBlankInline);

/** The document without the empty paragraphs Enter leaves at its end. */
export const trimTrailingEmptyParagraphs = (content: RichTextContent): RichTextDocument => {
    const document = toRichTextDocument(content);
    const blocks = [...(document.content ?? [])];
    while (blocks.length > 0 && isEmptyParagraph(blocks[blocks.length - 1])) {
        blocks.pop();
    }
    return { ...document, content: blocks };
};

/** What a message should be stored as: its trimmed document, serialized. */
export const serializeMessageContent = (content: RichTextContent): string =>
    serializeRichTextDocument(trimTrailingEmptyParagraphs(content));

/** True when the message holds no words, mentions or other visible content. */
export const isMessageContentEmpty = (content: RichTextContent): boolean => isRichTextDocumentEmpty(content);

/** A single line of the message's text, for previews and reply banners. */
export const messagePreview = (content: RichTextContent, maxLength?: number): string => {
    const text = richTextToPlainText(content).replace(/\s+/g, ' ').trim();
    if (maxLength === undefined || text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};
