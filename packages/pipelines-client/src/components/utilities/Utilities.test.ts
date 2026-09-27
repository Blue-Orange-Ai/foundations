import {Utilities} from './Utilities';

const payload = '<img src="x" onerror="window.__xss = 1">';

describe('Utilities', () => {

    afterEach(() => {
        delete (window as any).__xss;
    });

    it('builds a node whose text cannot carry markup', () => {
        const html = Utilities.generateGeneralNodeHtml('<i class="ri-archive-fill"></i>', '#393939', '#e0e1e2', payload, payload, '#393939');
        expect(Utilities.getNodeTitle(html)).toBe(payload);
        expect(Utilities.getNodeDescription(html)).toBe(payload);
        expect(Utilities.getNodeIcon(html)).toBe('<i class="ri-archive-fill"></i>');
        expect((window as any).__xss).toBeUndefined();
    });

    it('sanitizes the icon markup it is given', () => {
        const html = Utilities.generateGeneralNodeHtml(`<i class="ri-x"></i>${payload}`, '#000', '#fff', 't', 'd', '#000');
        expect(html).not.toContain('onerror');
        expect((window as any).__xss).toBeUndefined();
    });

    it('never parses saved node markup through innerHTML', () => {
        // jsdom never loads images, so the payload would not fire here either
        // way; what matters is that it never reaches an innerHTML sink.
        const setter = vi.spyOn(Element.prototype, 'innerHTML', 'set');
        const saved = `<div class="blue-orange-pipeline-editor-node"><div class="blue-orange-pipeline-editor-node-icon">${payload}</div>` +
            `<div class="blue-orange-pipeline-editor-node-body"><div class="blue-orange-pipeline-editor-node-body-title">T</div></div></div>`;
        Utilities.getNodeTitle(saved);
        Utilities.getNodeIcon(saved);
        Utilities.getNodeIconColor(saved);
        Utilities.generateGeneralNodeHtml(payload, '#000', '#fff', 't', 'd', '#000');
        expect(setter.mock.calls.some(call => String(call[0]).includes('onerror'))).toBe(false);
        setter.mockRestore();
    });

    it('reads saved node markup without running it', () => {
        const saved = `<div class="blue-orange-pipeline-editor-node" icon-color="#111"><div class="blue-orange-pipeline-editor-node-icon">${payload}<i class="ri-x"></i></div>` +
            `<div class="blue-orange-pipeline-editor-node-body"><div class="blue-orange-pipeline-editor-node-body-title">T</div></div></div>`;
        expect(Utilities.getNodeTitle(saved)).toBe('T');
        expect(Utilities.getNodeIconColor(saved)).toBe('#111');
        expect(Utilities.getNodeIcon(saved)).not.toContain('onerror');
        expect((window as any).__xss).toBeUndefined();
    });
});
