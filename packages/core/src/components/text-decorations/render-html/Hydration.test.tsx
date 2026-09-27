import React from 'react';
import {act} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {RenderHtml} from './RenderHtml';
import {RenderRichText} from '../render-rich-text/RenderRichText';

// Server rendering has no DOM to sanitize or parse with. What the server sends
// must be safe, and identical to what the client renders while hydrating, so
// React neither keeps stale markup nor throws the render away.
const serverRenderThenHydrate = async (element: React.ReactElement): Promise<{container: HTMLElement, serverHtml: string, errors: any[]}> => {
	const serverHtml = renderToString(element);
	const container = document.createElement('div');
	container.innerHTML = serverHtml;
	document.body.appendChild(container);
	const errors: any[] = [];
	// Only hydration trouble counts, not unrelated test-environment warnings.
	const spy = vi.spyOn(console, 'error').mockImplementation((...args: any[]) => {
		if (/hydrat|did not match|server/i.test(args.map(String).join(' '))) {
			errors.push(args);
		}
	});
	await act(async () => {
		hydrateRoot(container, element, {onRecoverableError: (error) => errors.push(error)});
	});
	spy.mockRestore();
	return {container, serverHtml, errors};
};

describe('server rendering', () => {

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('RenderHtml sends an empty box and fills it in once hydrated', async () => {
		const {container, serverHtml, errors} = await serverRenderThenHydrate(
			<RenderHtml html={'<p><b>hi</b><img src="x" onerror="window.__xss = 1"></p>'}/>
		);
		expect(serverHtml).not.toContain('onerror');
		expect(serverHtml).not.toContain('&lt;p&gt;');
		expect(container.querySelector('b')!.textContent).toBe('hi');
		expect(container.querySelector('img')!.getAttribute('onerror')).toBeNull();
		expect(errors).toEqual([]);
	});

	it('RenderRichText sends the words of legacy HTML and adds the formatting once hydrated', async () => {
		const {container, serverHtml, errors} = await serverRenderThenHydrate(
			<RenderRichText content={'<p>Old <strong>comment</strong><img src="x" onerror="window.__xss = 1"></p>'}/>
		);
		expect(serverHtml).toContain('Old');
		expect(serverHtml).not.toContain('<img');
		expect(container.querySelector('strong')!.textContent).toBe('comment');
		expect(errors).toEqual([]);
	});

	it('RenderRichText renders a document the same on server and client', async () => {
		const document = {type: 'doc' as const, content: [{type: 'paragraph', content: [{type: 'text', text: 'Hi', marks: [{type: 'bold'}]}]}]};
		const {container, serverHtml, errors} = await serverRenderThenHydrate(<RenderRichText content={document}/>);
		expect(serverHtml).toContain('<strong>Hi</strong>');
		expect(container.querySelector('strong')!.textContent).toBe('Hi');
		expect(errors).toEqual([]);
	});
});
