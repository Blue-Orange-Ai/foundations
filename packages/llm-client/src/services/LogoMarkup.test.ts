import { logoMarkup } from './LogoMarkup';

describe('logoMarkup', () => {

    it('keeps a plain SVG inline, sanitized', () => {
        const markup = logoMarkup('<svg viewBox="0 0 10 10" onload="alert(1)"><rect fill="currentColor" width="10" height="10"/></svg>');
        expect('html' in markup).toBe(true);
        const html = (markup as { html: string }).html;
        expect(html).toContain('<rect');
        expect(html).not.toContain('onload');
    });

    it('keeps gradient fills that reference the same SVG', () => {
        const markup = logoMarkup('<svg><defs><linearGradient id="g"></linearGradient></defs><path style="fill:url(#g)" d="M0 0"/></svg>');
        expect((markup as { html: string }).html).toContain('url(');
    });

    it('shows an SVG that needs <style> or <use> as an image', () => {
        const svg = '<svg><style>.a{fill:#f60}</style><rect class="a"/><script>alert(1)</script></svg>';
        const markup = logoMarkup(svg);
        expect('src' in markup).toBe(true);
        const src = (markup as { src: string }).src;
        expect(src.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
        expect(decodeURIComponent(src.slice(src.indexOf(',') + 1))).toBe(svg);
    });
});
