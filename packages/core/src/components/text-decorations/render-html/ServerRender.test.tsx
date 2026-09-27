// @vitest-environment node
import React from 'react';
import {renderToString} from 'react-dom/server';
import {RenderHtml} from './RenderHtml';
import {RenderRichText} from '../render-rich-text/RenderRichText';
import {sanitizeHtml} from '../../utils/SanitizeHtml';

// A real server: no window, no DOM to sanitize or parse with.
describe('rendering on a server', () => {

	it('has no DOM here', () => {
		expect(typeof window).toBe('undefined');
	});

	it('fails closed when sanitizing without a DOM', () => {
		expect(sanitizeHtml('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
	});

	it('RenderHtml sends an empty box rather than markup or escaped markup', () => {
		const html = renderToString(<RenderHtml html={'<p><b>hi</b><img src="x" onerror="alert(1)"></p>'}/>);
		expect(html).toBe('<div class="blue-orange-render-html"></div>');
	});

	it('RenderRichText sends the words of legacy HTML', () => {
		const html = renderToString(<RenderRichText content={'<p>Old <strong>comment</strong><img src="x" onerror="alert(1)"></p>'}/>);
		expect(html).toContain('Old comment');
		expect(html).not.toContain('<img');
		expect(html).not.toContain('onerror');
	});

	it('RenderRichText renders a document fully', () => {
		const html = renderToString(<RenderRichText content={{type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: 'Hi', marks: [{type: 'bold'}]}]}]}}/>);
		expect(html).toContain('<strong>Hi</strong>');
	});
});
