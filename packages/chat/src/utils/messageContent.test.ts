import { isMessageContentEmpty, messagePreview, serializeMessageContent, trimTrailingEmptyParagraphs } from './messageContent';

describe('messageContent', () => {

    afterEach(() => {
        delete (window as any).__xss;
    });

    it('previews legacy html as text without running it', () => {
        // jsdom never loads images, so the payload would not fire here either
        // way; what matters is that it never reaches an innerHTML sink.
        const setter = vi.spyOn(Element.prototype, 'innerHTML', 'set');
        expect(messagePreview('<p>Hello <b>there</b><img src="x" onerror="window.__xss = 1"></p>')).toBe('Hello there');
        expect(setter.mock.calls.some(call => String(call[0]).includes('onerror'))).toBe(false);
        setter.mockRestore();
    });

    it('truncates a preview', () => {
        expect(messagePreview('<p>abcdefghij</p>', 4)).toBe('abcd...');
    });

    it('knows an empty message', () => {
        expect(isMessageContentEmpty({ type: 'doc', content: [{ type: 'paragraph' }, { type: 'paragraph', content: [{ type: 'hardBreak' }] }] })).toBe(true);
        expect(isMessageContentEmpty('<p> </p>')).toBe(true);
        expect(isMessageContentEmpty('<p>x</p>')).toBe(false);
    });

    it('trims trailing empty paragraphs from the stored document', () => {
        const document = { type: 'doc' as const, content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'x' }] },
            { type: 'paragraph' },
            { type: 'paragraph', content: [{ type: 'text', text: '  ' }] },
        ] };
        expect(trimTrailingEmptyParagraphs(document).content).toHaveLength(1);
        expect(JSON.parse(serializeMessageContent(document)).content).toHaveLength(1);
    });

    it('keeps one block for a message that is only an attachment', () => {
        expect(JSON.parse(serializeMessageContent(''))).toEqual({ type: 'doc', content: [{ type: 'paragraph' }] });
    });
});
