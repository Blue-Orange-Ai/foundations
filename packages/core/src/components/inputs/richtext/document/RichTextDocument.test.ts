import {
	htmlToRichTextDocument,
	isRichTextDocument,
	isRichTextDocumentEmpty,
	parseRichTextDocument,
	RichTextDocument,
	richTextMentions,
	richTextToPlainText,
	serializeRichTextDocument,
	toEditorContent,
	toRichTextDocument
} from './RichTextDocument';

const withMention: RichTextDocument = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{type: 'text', text: 'Hi '},
				{type: 'mention', attrs: {id: 'Ann', label: 'Ann', userId: 'u1'}},
				{type: 'text', text: ' and '},
				{type: 'mention', attrs: {id: 'Bob', label: 'Bob', userId: 'u2'}},
				{type: 'mention', attrs: {id: 'Ann', label: 'Ann', userId: 'u1'}},
			]
		}
	]
};

describe('RichTextDocument', () => {

	afterEach(() => {
		delete (window as any).__xss;
	});

	it('recognises a document', () => {
		expect(isRichTextDocument(withMention)).toBe(true);
		expect(isRichTextDocument({type: 'paragraph'})).toBe(false);
		expect(isRichTextDocument('{"type":"doc"}')).toBe(false);
		expect(isRichTextDocument(null)).toBe(false);
	});

	it('round trips through its serialized form', () => {
		const serialized = serializeRichTextDocument(withMention);
		expect(parseRichTextDocument(serialized)).toEqual(withMention);
		expect(toRichTextDocument(serialized)).toEqual(withMention);
	});

	it('does not mistake html or other json for a serialized document', () => {
		expect(parseRichTextDocument('<p>hi</p>')).toBeUndefined();
		expect(parseRichTextDocument('{"type":"paragraph"}')).toBeUndefined();
		expect(parseRichTextDocument('{not json')).toBeUndefined();
	});

	it('reads the mentioned user ids from the document, once each', () => {
		expect(richTextMentions(withMention)).toEqual(['u1', 'u2']);
	});

	it('reads mentions out of legacy html without running it', () => {
		const html = '<p><img src="x" onerror="window.__xss = 1"><span data-type="mention" class="mention" data-id="Ann" data-label="Ann" data-user-id="u1">@Ann</span></p>';
		expect(richTextMentions(html)).toEqual(['u1']);
		expect((window as any).__xss).toBeUndefined();
	});

	it('keeps only what the editor supports when converting legacy html', () => {
		const document = htmlToRichTextDocument(
			'<p>Hello <strong>there</strong><script>window.__xss = 1</script>' +
			'<a href="javascript:window.__xss = 1">bad</a> <a href="https://example.com" onclick="x()">good</a></p>' +
			'<iframe src="https://example.com"></iframe>'
		);
		const serialized = JSON.stringify(document);
		expect(serialized).not.toContain('script');
		expect(serialized).not.toContain('javascript');
		expect(serialized).not.toContain('onclick');
		expect(serialized).not.toContain('iframe');
		expect(serialized).toContain('"bold"');
		expect(serialized).toContain('https://example.com');
		expect((window as any).__xss).toBeUndefined();
	});

	it('pins link targets instead of copying them from the html', () => {
		const document = htmlToRichTextDocument('<p><a href="https://example.com" target="payments" rel="opener" class="x">x</a></p>');
		const mark = document.content![0].content![0].marks![0];
		expect(mark.attrs).toMatchObject({href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer nofollow', class: null});
	});

	it('gives the words of a document', () => {
		const document: RichTextDocument = {
			type: 'doc',
			content: [
				{type: 'heading', attrs: {level: 1}, content: [{type: 'text', text: 'Title'}]},
				{type: 'paragraph', content: [{type: 'text', text: 'One'}, {type: 'hardBreak'}, {type: 'text', text: 'Two'}]},
				{type: 'bulletList', content: [{type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'Item'}]}]}]},
			]
		};
		expect(richTextToPlainText(document)).toBe('Title\nOne\nTwo\nItem');
		expect(richTextToPlainText(withMention)).toBe('Hi @Ann and @Bob@Ann');
	});

	it('knows when a document is empty', () => {
		expect(isRichTextDocumentEmpty({type: 'doc', content: [{type: 'paragraph'}]})).toBe(true);
		expect(isRichTextDocumentEmpty('<p>   </p>')).toBe(true);
		expect(isRichTextDocumentEmpty('')).toBe(true);
		expect(isRichTextDocumentEmpty(withMention)).toBe(false);
		expect(isRichTextDocumentEmpty(serializeRichTextDocument(withMention))).toBe(false);
	});

	it('hands an editor json for a serialized document and html as it is', () => {
		expect(toEditorContent(serializeRichTextDocument(withMention))).toEqual(withMention);
		expect(toEditorContent('<p>hi</p>')).toBe('<p>hi</p>');
		expect(toEditorContent(undefined)).toBe('');
	});

	it('turns mentions into text for an editor without the mention extension', () => {
		const content = toEditorContent(withMention, {allowMentions: false}) as RichTextDocument;
		expect(JSON.stringify(content)).not.toContain('"mention"');
		expect(content.content![0].content![1]).toEqual({type: 'text', text: '@Ann'});
	});

	it('survives a document nested far deeper than anything typed', () => {
		let node: any = {type: 'text', text: 'deep'};
		for (let i = 0; i < 5000; i++) {
			node = {type: 'blockquote', content: [node]};
		}
		const document: RichTextDocument = {type: 'doc', content: [node]};
		expect(() => richTextMentions(document)).not.toThrow();
		expect(() => richTextToPlainText(document)).not.toThrow();
		expect(() => isRichTextDocumentEmpty(document)).not.toThrow();
	});
});
