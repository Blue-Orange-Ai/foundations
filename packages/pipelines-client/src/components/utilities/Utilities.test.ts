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

    it('reads saved node markup without running it', () => {
        const saved = `<div class="blue-orange-pipeline-editor-node" icon-color="#111"><div class="blue-orange-pipeline-editor-node-icon">${payload}<i class="ri-x"></i></div>` +
            `<div class="blue-orange-pipeline-editor-node-body"><div class="blue-orange-pipeline-editor-node-body-title">T</div></div></div>`;
        expect(Utilities.getNodeTitle(saved)).toBe('T');
        expect(Utilities.getNodeIconColor(saved)).toBe('#111');
        expect(Utilities.getNodeIcon(saved)).not.toContain('onerror');
        expect((window as any).__xss).toBeUndefined();
    });
});
