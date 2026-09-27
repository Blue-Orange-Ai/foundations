import {htmlToText, sanitizeHtml, sanitizeStyle} from './SanitizeHtml';

// Renders the sanitized markup into a live container, the way RenderHtml does,
// so the assertions look at what the browser would actually hold.
const mount = (html: string): HTMLElement => {
	const container = document.createElement('div');
	container.innerHTML = sanitizeHtml(html);
	document.body.appendChild(container);
	return container;
};

const hasEventHandler = (root: Element): boolean =>
	Array.from(root.querySelectorAll('*')).some(element =>
		Array.from(element.attributes).some(attribute => attribute.name.toLowerCase().startsWith('on')));

describe('sanitizeHtml', () => {

	afterEach(() => {
		document.body.innerHTML = '';
		delete (window as any).__xss;
	});

	const payloads: Array<[string, string]> = [
		['script tag', '<script>window.__xss = 1</script>'],
		['img onerror', '<img src="x" onerror="window.__xss = 1">'],
		['svg onload', '<svg onload="window.__xss = 1"></svg>'],
		['svg script', '<svg><script>window.__xss = 1</script></svg>'],
		['body onload', '<body onload="window.__xss = 1">'],
		['details ontoggle', '<details open ontoggle="window.__xss = 1"></details>'],
		['iframe srcdoc', '<iframe srcdoc="<script>window.__xss = 1</script>"></iframe>'],
		['iframe javascript', '<iframe src="javascript:window.__xss = 1"></iframe>'],
		['object data', '<object data="javascript:window.__xss = 1"></object>'],
		['embed', '<embed src="javascript:window.__xss = 1">'],
		['meta refresh', '<meta http-equiv="refresh" content="0;url=javascript:window.__xss = 1">'],
		['base href', '<base href="javascript:/">'],
		['form action', '<form action="javascript:window.__xss = 1"><button>go</button></form>'],
		['formaction', '<button formaction="javascript:window.__xss = 1">go</button>'],
		['svg animate href', '<svg><a><animate attributeName="href" values="javascript:window.__xss = 1"/><text>x</text></a></svg>'],
		['math href', '<math><mtext><a href="javascript:window.__xss = 1">x</a></mtext></math>'],
		['noscript mxss', '<noscript><p title="</noscript><img src=x onerror=window.__xss=1>">'],
		['template', '<template><img src=x onerror="window.__xss = 1"></template>'],
		['style tag', '<style>body { display: none }</style>'],
		['link stylesheet', '<link rel="stylesheet" href="https://example.com/x.css">'],
	];

	it.each(payloads)('removes anything executable: %s', (_name, payload) => {
		const container = mount(payload);
		expect(container.querySelector('script, iframe, object, embed, meta, base, form, button, style, link, template, animate')).toBeNull();
		expect(hasEventHandler(container)).toBe(false);
		expect(container.innerHTML.toLowerCase()).not.toContain('javascript:');
		expect((window as any).__xss).toBeUndefined();
	});

	it.each([
		'javascript:window.__xss = 1',
		'JaVaScRiPt:window.__xss = 1',
		' javascript:window.__xss = 1',
		'java\tscript:window.__xss = 1',
		'java&#x09;script:window.__xss = 1',
		'&#106;avascript:window.__xss = 1',
		'vbscript:msgbox(1)',
		'data:text/html,<script>window.__xss = 1</script>',
	])('drops a link that would run script: %s', (href) => {
		const container = mount(`<a href="${href}">click</a>`);
		const link = container.querySelector('a');
		expect(link).not.toBeNull();
		expect(link!.getAttribute('href')).toBeNull();
	});

	it('keeps ordinary formatting', () => {
		const html = '<p>Hello <strong>bold</strong> <em>it</em> <a href="https://example.com">link</a></p><ul><li>one</li></ul>';
		expect(sanitizeHtml(html)).toBe(html);
	});

	it('keeps mention data attributes', () => {
		const html = '<span data-type="mention" class="mention" data-id="Ann" data-user-id="u1">@Ann</span>';
		expect(sanitizeHtml(html)).toBe(html);
	});

	it('keeps an inline svg icon', () => {
		const container = mount('<svg viewBox="0 0 10 10"><path d="M0 0L10 10"></path></svg>');
		expect(container.querySelector('svg path')).not.toBeNull();
	});

	it('drops svg when asked to', () => {
		expect(sanitizeHtml('<svg viewBox="0 0 10 10"><path d="M0 0"></path></svg>x', {allowSvg: false})).toBe('x');
	});

	it('drops media when asked to', () => {
		expect(sanitizeHtml('<img src="https://example.com/a.png">x', {allowMedia: false})).toBe('x');
	});

	it('drops styles when asked to', () => {
		expect(sanitizeHtml('<span style="color: red">x</span>', {allowStyles: false})).toBe('<span>x</span>');
	});

	it('removes the library\'s own class names', () => {
		const container = mount('<div class="blue-orange-modal-window note bo-llm-graph-node">x</div><p class="blue-orange-toast">y</p>');
		expect(container.querySelector('div')!.getAttribute('class')).toBe('note');
		expect(container.querySelector('p')!.getAttribute('class')).toBeNull();
	});

	it('keeps other class names, such as code highlighting', () => {
		expect(sanitizeHtml('<span class="line hljs-keyword">x</span>')).toBe('<span class="line hljs-keyword">x</span>');
	});

	it('drops classes when asked to', () => {
		expect(sanitizeHtml('<p class="fixed inset-0 z-50">x</p>', {allowClasses: false})).toBe('<p>x</p>');
	});

	it('adds noopener to links that open a new window', () => {
		const container = mount('<a href="https://example.com" target="_blank" rel="nofollow">x</a>');
		const rel = container.querySelector('a')!.getAttribute('rel')!.split(' ');
		expect(rel).toEqual(expect.arrayContaining(['nofollow', 'noopener', 'noreferrer']));
	});

	it('drops a named link target that could take over another window', () => {
		const container = mount('<a href="https://example.com" target="payments">x</a>');
		expect(container.querySelector('a')!.getAttribute('target')).toBeNull();
	});

	it('returns an empty string for nothing', () => {
		expect(sanitizeHtml(undefined)).toBe('');
		expect(sanitizeHtml(null)).toBe('');
		expect(sanitizeHtml('')).toBe('');
	});
});

describe('sanitizeStyle', () => {

	it('keeps colours and typography', () => {
		const style = sanitizeStyle('color: red; font-weight: bold; background-color: #fff');
		expect(style).toContain('color: red');
		expect(style).toContain('font-weight: bold');
		expect(style).toContain('background-color');
	});

	it.each([
		'background-image: url(https://attacker.example/pixel)',
		'background: url("javascript:alert(1)")',
		'list-style-image: url(x)',
		'width: expression(alert(1))',
		'behavior: url(x.htc)',
		'-moz-binding: url(x)',
		'position: fixed',
		'position: absolute',
		'position: sticky',
		'z-index: 99999',
		'color: re\\64',
	])('drops %s', (declaration) => {
		expect(sanitizeStyle(declaration)).toBe('');
	});

	it('keeps a reference to something in the same document, such as an SVG gradient', () => {
		expect(sanitizeStyle('fill: url(#g1)')).toContain('url(');
		expect(sanitizeStyle('fill: url("#g1")')).toContain('url(');
	});

	it.each([
		'fill: url(#g1) url(https://attacker.example/x)',
		'background: url( https://attacker.example/x )',
		'fill: url(#a), url(//attacker.example/x)',
	])('drops %s once anything outside the document is named', (declaration) => {
		expect(sanitizeStyle(declaration)).toBe('');
	});

	it('keeps relative positioning', () => {
		expect(sanitizeStyle('position: relative; top: -0.2em')).toContain('position: relative');
	});
});

describe('htmlToText', () => {

	it('decodes entities without running the markup', () => {
		expect(htmlToText('&#x1F600;')).toBe('\u{1F600}');
		expect(htmlToText('<img src=x onerror="window.__xss = 1">hi')).toBe('hi');
		expect((window as any).__xss).toBeUndefined();
	});
});
