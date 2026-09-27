import React from 'react';
import {render} from '@testing-library/react';
import {RenderHtml} from './RenderHtml';

const root = (): HTMLElement => document.querySelector('.blue-orange-render-html') as HTMLElement;

describe('RenderHtml', () => {

	afterEach(() => {
		delete (window as any).__xss;
	});

	it('keeps formatting', () => {
		render(<RenderHtml html={'<p>Hello <b>bold</b> <a href="https://example.com">link</a> <span style="color: red">red</span></p>'}/>);
		expect(root().querySelector('b')!.textContent).toBe('bold');
		expect(root().querySelector('a')!.getAttribute('href')).toBe('https://example.com');
		expect(root().querySelector('span')!.getAttribute('style')).toContain('color: red');
	});

	it('never lets markup run', () => {
		render(<RenderHtml html={
			'<img src="x" onerror="window.__xss = 1">' +
			'<script>window.__xss = 1</script>' +
			'<a href="javascript:window.__xss = 1">x</a>' +
			'<iframe srcdoc="<script>window.__xss = 1</script>"></iframe>' +
			'<svg onload="window.__xss = 1"></svg>' +
			'<form action="https://attacker.example"><input name="password"></form>' +
			'<div style="position: fixed; inset: 0; z-index: 9999; background: url(https://attacker.example/x)">overlay</div>'
		}/>);
		expect(root().querySelector('script, iframe, form, input')).toBeNull();
		expect(root().querySelector('img')!.getAttribute('onerror')).toBeNull();
		expect(root().querySelector('svg')!.getAttribute('onload')).toBeNull();
		expect(root().querySelector('a')!.getAttribute('href')).toBeNull();
		const overlay = root().querySelector('div')!.getAttribute('style') ?? '';
		expect(overlay).not.toContain('fixed');
		expect(overlay).not.toContain('url(');
		expect(overlay).not.toContain('z-index');
		expect((window as any).__xss).toBeUndefined();
	});

	it('can drop styles for untrusted text', () => {
		render(<RenderHtml html={'<span style="color: red">red</span>'} sanitizeOptions={{allowStyles: false}}/>);
		expect(root().querySelector('span')!.getAttribute('style')).toBeNull();
	});

	it('follows a change of markup', () => {
		const {rerender} = render(<RenderHtml html={'<p>one</p>'}/>);
		expect(root().textContent).toBe('one');
		rerender(<RenderHtml html={'<p>two</p><img src=x onerror="window.__xss = 1">'}/>);
		expect(root().textContent).toBe('two');
		expect(root().querySelector('img')!.getAttribute('onerror')).toBeNull();
	});
});
