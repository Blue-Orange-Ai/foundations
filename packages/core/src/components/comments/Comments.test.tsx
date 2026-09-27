import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {Comment, CommentType} from '@blue-orange-ai/foundations-clients';
import {AddComment} from './add-comment/AddComment';
import {RenderComment} from './render-comment/RenderComment';
import {CommentsStore} from './comments-store/CommentsStore';
import {parseRichTextDocument} from '../inputs/richtext/document/RichTextDocument';

const memoryStore = (): CommentsStore & {created: Comment[]} => {
	const created: Comment[] = [];
	return {
		created,
		get: async () => created,
		create: async (comment: Comment) => {
			created.push(comment);
			return comment;
		},
		update: async (comment: Comment) => comment,
		delete: async () => undefined,
		isEditable: async () => false,
		currentUser: async () => ({name: 'Me'}),
		getUser: async () => ({name: 'Someone'}),
	};
};

const comment = (text: string): Comment => ({
	id: 'c1',
	topic: 't',
	referenceId: 'r',
	userId: 'u',
	tags: [],
	created: new Date(),
	edited: false,
	lastModified: new Date(),
	text: text,
	files: [],
	mentions: [],
	type: CommentType.CREATE
});

describe('comments', () => {

	afterEach(() => {
		delete (window as any).__xss;
	});

	it('stores a new comment as the editor\'s JSON document', async () => {
		const store = memoryStore();
		render(<AddComment topic="t" referenceId="r" store={store}></AddComment>);
		const editable = document.querySelector('.tiptap') as HTMLElement;
		await act(async () => {
			editable.innerHTML = '<p>Hello</p>';
		});
		await waitFor(() => expect(editable.textContent).toBe('Hello'));
		fireEvent.keyUp(editable, {key: 'o'});
		fireEvent.click(screen.getByText('Comment'));
		await waitFor(() => expect(store.created.length).toBe(1));
		const stored = parseRichTextDocument(store.created[0].text);
		expect(stored).toBeDefined();
		expect(JSON.stringify(stored)).toContain('Hello');
		expect(store.created[0].text).not.toContain('<p>');
	});

	it('does not send an empty comment', async () => {
		const store = memoryStore();
		render(<AddComment topic="t" referenceId="r" store={store}></AddComment>);
		const editable = document.querySelector('.tiptap') as HTMLElement;
		fireEvent.keyUp(editable, {key: 'Shift'});
		fireEvent.click(screen.getByText('Comment'));
		await new Promise(resolve => setTimeout(resolve, 0));
		expect(store.created.length).toBe(0);
	});

	it('renders a stored JSON comment', async () => {
		const store = memoryStore();
		const text = JSON.stringify({type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'Stored', marks: [{type: 'bold'}]}]}]});
		render(<RenderComment comment={comment(text)} store={store} onEditing={() => {}}></RenderComment>);
		const body = document.querySelector('.blue-orange-comments-render-body-cont') as HTMLElement;
		expect(body.querySelector('strong')!.textContent).toBe('Stored');
		await waitFor(() => expect(screen.getByText('Someone')).toBeInTheDocument());
	});

	it('renders a legacy HTML comment without running anything in it', async () => {
		const store = memoryStore();
		const text = '<p>Old <em>comment</em><img src="x" onerror="window.__xss = 1"></p><script>window.__xss = 1</script><a href="javascript:window.__xss = 1">click</a>';
		render(<RenderComment comment={comment(text)} store={store} onEditing={() => {}}></RenderComment>);
		const body = document.querySelector('.blue-orange-comments-render-body-cont') as HTMLElement;
		expect(body.querySelector('em')!.textContent).toBe('comment');
		expect(body.querySelector('img, script, a')).toBeNull();
		expect((window as any).__xss).toBeUndefined();
		await waitFor(() => expect(screen.getByText('Someone')).toBeInTheDocument());
	});
});
