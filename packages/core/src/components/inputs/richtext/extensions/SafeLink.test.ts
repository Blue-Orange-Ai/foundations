import {Editor} from '@tiptap/core';
import {StarterKit} from '@tiptap/starter-kit';
import {SafeLink} from './SafeLink';

const clickHandler = (editor: Editor) => {
	const plugin = editor.state.plugins.find(item => (item as any).key.startsWith('safeLinkClick'));
	return plugin!.props.handleClick! as (view: any, pos: number, event: MouseEvent) => boolean;
};

const click = (target: Element, button: number = 0): MouseEvent => {
	const event = new MouseEvent('click', {button});
	Object.defineProperty(event, 'target', {value: target});
	return event;
};

describe('SafeLink', () => {

	let editor: Editor;

	afterEach(() => {
		editor?.destroy();
		vi.restoreAllMocks();
	});

	const create = (content: any) => {
		editor = new Editor({element: document.createElement('div'), extensions: [StarterKit, SafeLink], content});
		return editor;
	};

	it('opens a clicked link in a new tab without a handle back to the page', () => {
		const open = vi.spyOn(window, 'open').mockImplementation(() => null);
		create('<p><a href="https://example.com" target="payments">link</a></p>');
		const link = editor.view.dom.querySelector('a')!;
		expect(clickHandler(editor)(editor.view, 1, click(link))).toBe(true);
		expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
	});

	it('ignores clicks that are not on a link, or not the main button', () => {
		const open = vi.spyOn(window, 'open').mockImplementation(() => null);
		create('<p>text <a href="https://example.com">link</a></p>');
		const paragraph = editor.view.dom.querySelector('p')!;
		expect(clickHandler(editor)(editor.view, 1, click(paragraph))).toBe(false);
		expect(clickHandler(editor)(editor.view, 1, click(editor.view.dom.querySelector('a')!, 1))).toBe(false);
		expect(open).not.toHaveBeenCalled();
	});

	it('pins target and rel even when a JSON document says otherwise', () => {
		create({
			type: 'doc',
			content: [{type: 'paragraph', content: [{
				type: 'text',
				text: 'x',
				marks: [{type: 'link', attrs: {href: 'https://example.com', target: 'payments', rel: 'opener', class: 'evil'}}]
			}]}]
		});
		const link = editor.view.dom.querySelector('a')!;
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow');
		expect(link.getAttribute('class')).toBeNull();
		expect(editor.getHTML()).not.toContain('payments');
	});

	it('does not render a script link from a JSON document', () => {
		const open = vi.spyOn(window, 'open').mockImplementation(() => null);
		create({
			type: 'doc',
			content: [{type: 'paragraph', content: [{
				type: 'text',
				text: 'x',
				marks: [{type: 'link', attrs: {href: 'javascript:alert(1)'}}]
			}]}]
		});
		const link = editor.view.dom.querySelector('a')!;
		expect((link.getAttribute('href') ?? '').toLowerCase()).not.toContain('javascript');
		clickHandler(editor)(editor.view, 1, click(link));
		expect(open).not.toHaveBeenCalled();
	});
});
