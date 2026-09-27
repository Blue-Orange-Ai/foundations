import {isSafeUrl, sanitizeMediaUrl, sanitizeRedirect, sanitizeUrl} from './SanitizeUrl';

describe('sanitizeUrl', () => {

	it.each([
		'https://example.com/a?b=c#d',
		'http://example.com',
		'mailto:someone@example.com',
		'tel:+441234567890',
		'/relative/path',
		'relative/path',
		'#anchor',
		'?query=1',
		'//example.com/protocol-relative',
	])('lets %s through', (url) => {
		expect(sanitizeUrl(url)).toBe(url);
	});

	it.each([
		'javascript:alert(1)',
		'JAVASCRIPT:alert(1)',
		' javascript:alert(1)',
		'\u0000javascript:alert(1)',
		'java\tscript:alert(1)',
		'java\nscript:alert(1)',
		'vbscript:msgbox(1)',
		'data:text/html,<script>alert(1)</script>',
		'data:image/svg+xml,<svg onload=alert(1)>',
		'file:///etc/passwd',
		'',
		'   ',
	])('refuses %j', (url) => {
		expect(sanitizeUrl(url)).toBeUndefined();
		expect(isSafeUrl(url)).toBe(false);
	});

	it.each(['\u00A0', '\uFEFF', '\u1680', '\u2000', '\u2028', '\u2029', '\u202F', '\u205F', '\u3000', '\u200B', '\u00A0\uFEFF '])(
		'refuses a script link behind unicode whitespace %j', (prefix) => {
			expect(sanitizeUrl(prefix + 'javascript:alert(1)')).toBeUndefined();
			expect(sanitizeUrl(prefix + 'data:text/html,<script>alert(1)</script>')).toBeUndefined();
			expect(sanitizeUrl('javascript:alert(1)' + prefix)).toBeUndefined();
		});

	it('hands back exactly the url it checked', () => {
		expect(sanitizeUrl('  https://example.com/a  ')).toBe('https://example.com/a');
		expect(sanitizeUrl('\u00A0/path')).toBe('/path');
		expect(sanitizeUrl('https://exa\tmple.com')).toBe('https://example.com');
	});

	it('refuses anything that is not a string', () => {
		expect(sanitizeUrl(undefined)).toBeUndefined();
		expect(sanitizeUrl(null)).toBeUndefined();
		expect(sanitizeUrl({toString: () => 'https://example.com'})).toBeUndefined();
	});

	it('can refuse relative urls', () => {
		expect(sanitizeUrl('/path', {allowRelative: false})).toBeUndefined();
	});

	it('can narrow the schemes', () => {
		expect(sanitizeUrl('mailto:a@b.c', {protocols: ['https:']})).toBeUndefined();
		expect(sanitizeUrl('https://a.b', {protocols: ['https:']})).toBe('https://a.b');
	});
});

describe('sanitizeMediaUrl', () => {

	it('lets raster data images and blobs through', () => {
		expect(sanitizeMediaUrl('data:image/png;base64,iVBORw0KGgo=')).toBe('data:image/png;base64,iVBORw0KGgo=');
		expect(sanitizeMediaUrl('blob:https://example.com/1234')).toBe('blob:https://example.com/1234');
	});

	it('refuses svg data images and scripts', () => {
		expect(sanitizeMediaUrl('data:image/svg+xml;base64,PHN2Zz4=')).toBeUndefined();
		expect(sanitizeMediaUrl('javascript:alert(1)')).toBeUndefined();
	});
});

describe('sanitizeRedirect', () => {

	it('keeps a path on this site', () => {
		expect(sanitizeRedirect('/dashboard?tab=1#top')).toBe('/dashboard?tab=1#top');
	});

	it.each([
		'https://attacker.example',
		'//attacker.example',
		'/\\attacker.example',
		'https://attacker.example/path',
		'http://localhost.attacker.example/',
		'/\t/attacker.example',
		'javascript:alert(1)',
		'dashboard',
		'',
	])('falls back for %j', (url) => {
		expect(sanitizeRedirect(url, '/home')).toBe('/home');
	});

	it('falls back for anything that is not a string', () => {
		expect(sanitizeRedirect(undefined)).toBe('/');
	});

	it.each([
		'/..//attacker.example/x',
		'/../\\attacker.example',
		'/%2e%2e//attacker.example',
		'/./..//attacker.example',
	])('never hands back a path another host could be read from: %j', (url) => {
		const result = sanitizeRedirect(url, '/home');
		expect(result.startsWith('//')).toBe(false);
		expect(result.startsWith('/\\')).toBe(false);
		expect(new URL(result, window.location.origin).origin).toBe(window.location.origin);
	});

	it('reduces an absolute url on this site to its path', () => {
		expect(sanitizeRedirect(window.location.origin + '/settings?a=1#b')).toBe('/settings?a=1#b');
	});
});
