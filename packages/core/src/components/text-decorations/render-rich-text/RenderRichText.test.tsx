import React from 'react';
import {render} from '@testing-library/react';
import {RenderRichText} from './RenderRichText';
import {RichTextDocument, serializeRichTextDocument} from '../../inputs/richtext/document/RichTextDocument';

const root = (): HTMLElement => document.querySelector('.blue-orange-render-rich-text') as HTMLElement;

const hasEventHandler = (element: Element): boolean =>
	Array.from(element.querySelectorAll('*')).some(child =>
		Array.from(child.attributes).some(attribute => attribute.name.toLowerCase().startsWith('on')));

const formatted: RichTextDocument = {
	type: 'doc',
	content: [
		{type: 'heading', attrs: {level: 2}, content: [{type: 'text', text: 'Heading'}]},
		{
			type: 'paragraph',
			content: [
				{type: 'text', text: 'bold', marks: [{type: 'bold'}]},
				{type: 'text', text: ' '},
				{type: 'text', text: 'link', marks: [{type: 'link', attrs: {href: 'https://example.com'}}, {type: 'italic'}]},
				{type: 'hardBreak'},
				{type: 'mention', attrs: {id: 'Ann', label: 'Ann', userId: 'u1'}},
			]
		},
		{type: 'orderedList', attrs: {start: 3}, content: [{type: 'listItem', content: [{type: 'paragraph', content: [{type: 'text', text: 'three'}]}]}]},
		{type: 'codeBlock', attrs: {language: 'ts'}, content: [{type: 'text', text: 'const a = "<b>";'}]},
		{type: 'blockquote', content: [{type: 'paragraph', content: [{type: 'text', text: 'quote'}]}]},
		{type: 'horizontalRule'},
	]
};

describe('RenderRichText', () => {

	afterEach(() => {
		delete (window as any).__xss;
	});

	it('renders each block and mark the editor produces', () => {
		render(<RenderRichText content={formatted}/>);
		expect(root().querySelector('h2')!.textContent).toBe('Heading');
		expect(root().querySelector('strong')!.textContent).toBe('bold');
		const link = root().querySelector('a')!;
		expect(link.getAttribute('href')).toBe('https://example.com');
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toContain('noopener');
		expect(link.querySelector('em')!.textContent).toBe('link');
		expect(root().querySelector('br')).not.toBeNull();
		const mention = root().querySelector('.mention')!;
		expect(mention.textContent).toBe('@Ann');
		expect(mention.getAttribute('data-user-id')).toBe('u1');
		expect(root().querySelector('ol')!.getAttribute('start')).toBe('3');
		const code = root().querySelector('pre code')!;
		expect(code.className).toBe('language-ts');
		expect(code.textContent).toBe('const a = "<b>";');
		expect(root().querySelector('blockquote p')!.textContent).toBe('quote');
		expect(root().querySelector('hr')).not.toBeNull();
	});

	it('renders a serialized document', () => {
		render(<RenderRichText content={serializeRichTextDocument(formatted)}/>);
		expect(root().querySelector('h2')!.textContent).toBe('Heading');
	});

	it('renders text as text, never as markup', () => {
		const document: RichTextDocument = {
			type: 'doc',
			content: [{type: 'paragraph', content: [{type: 'text', text: '<img src=x onerror="window.__xss = 1">'}]}]
		};
		render(<RenderRichText content={document}/>);
		expect(root().querySelector('img')).toBeNull();
		expect(root().textContent).toBe('<img src=x onerror="window.__xss = 1">');
	});

	it.each([
		'javascript:window.__xss = 1',
		'JavaScript:window.__xss = 1',
		'java\tscript:window.__xss = 1',
		'data:text/html,<script>window.__xss = 1</script>',
		'vbscript:msgbox(1)',
		'\u00A0javascript:window.__xss = 1',
		'\uFEFFjavascript:window.__xss = 1',
		'\u3000javascript:window.__xss = 1',
		'\u2028data:text/html,<script>window.__xss = 1</script>',
	])('drops a link to %j but keeps its text', (href) => {
		const document: RichTextDocument = {
			type: 'doc',
			content: [{type: 'paragraph', content: [{type: 'text', text: 'click', marks: [{type: 'link', attrs: {href}}]}]}]
		};
		render(<RenderRichText content={document}/>);
		expect(root().querySelector('a')).toBeNull();
		expect(root().textContent).toBe('click');
	});

	it('ignores attributes a crafted document adds', () => {
		const document: any = {
			type: 'doc',
			content: [{
				type: 'paragraph',
				attrs: {onclick: 'window.__xss = 1', style: 'position: fixed', class: 'evil'},
				content: [
					{type: 'text', text: 'x', marks: [{type: 'link', attrs: {href: 'https://example.com', target: 'payments', onclick: 'x()'}}]},
					{type: 'mention', attrs: {id: 'Ann', label: 'Ann', userId: 'u1', onmouseover: 'x()'}},
				]
			}, {
				type: 'heading', attrs: {level: '1 onclick=x()'}, content: [{type: 'text', text: 'h'}]
			}, {
				type: 'codeBlock', attrs: {language: '" onmouseover="x()'}, content: [{type: 'text', text: 'c'}]
			}]
		};
		render(<RenderRichText content={document}/>);
		expect(hasEventHandler(root())).toBe(false);
		expect(root().querySelector('[style]')).toBeNull();
		expect(root().querySelector('.evil')).toBeNull();
		expect(root().querySelector('a')!.getAttribute('target')).toBe('_blank');
		expect(root().querySelector('h1')).not.toBeNull();
		expect(root().querySelector('pre code')!.getAttribute('class')).toBeNull();
	});

	it('shows the contents of node types it does not know, and nothing else', () => {
		const document: any = {
			type: 'doc',
			content: [
				{type: 'iframe', attrs: {src: 'javascript:window.__xss = 1'}},
				{type: 'details', content: [{type: 'paragraph', content: [{type: 'text', text: 'inside'}]}]},
				{type: 'text', text: 'loose', marks: [{type: 'textStyle', attrs: {color: 'red'}}]},
			]
		};
		render(<RenderRichText content={document}/>);
		expect(root().querySelector('iframe')).toBeNull();
		expect(root().textContent).toBe('insideloose');
		expect(root().querySelector('[style]')).toBeNull();
	});

	it('renders legacy html through the editor schema', () => {
		render(<RenderRichText content={'<p>Old <strong>comment</strong><img src="x" onerror="window.__xss = 1"><script>window.__xss = 1</script></p><a href="javascript:window.__xss = 1">x</a>'}/>);
		expect(root().querySelector('strong')!.textContent).toBe('comment');
		expect(root().querySelector('img, script')).toBeNull();
		expect(root().querySelector('a')).toBeNull();
		expect(hasEventHandler(root())).toBe(false);
		expect((window as any).__xss).toBeUndefined();
	});

	it('stops at a sensible depth instead of overflowing the stack', () => {
		let node: any = {type: 'text', text: 'deep'};
		for (let i = 0; i < 5000; i++) {
			node = {type: 'blockquote', content: [node]};
		}
		expect(() => render(<RenderRichText content={{type: 'doc', content: [node]}}/>)).not.toThrow();
	});

	it('renders nothing for no content', () => {
		render(<RenderRichText content={undefined}/>);
		expect(root().textContent).toBe('');
	});
});
