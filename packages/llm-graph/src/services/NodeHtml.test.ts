import { NodeHtml } from './NodeHtml';

const node = (ui: any): any => ({
    id: 'n1',
    type: 'agent',
    name: 'Agent',
    metadata: { ui },
});

describe('NodeHtml', () => {

    afterEach(() => {
        delete (window as any).__xss;
    });

    it('sets the icon as a class, never as markup', () => {
        const html = NodeHtml.iconHtml(node({ icon: 'x"><img src=x onerror="window.__xss = 1">' }));
        const holder = document.createElement('template');
        holder.innerHTML = html;
        expect(holder.content.querySelector('img')).toBeNull();
        expect(holder.content.querySelector('i')!.getAttribute('class')).toBe(NodeHtml.iconClass(node({})));
        expect((window as any).__xss).toBeUndefined();
    });

    it('keeps a catalog icon as it is', () => {
        expect(NodeHtml.iconHtml(node({ icon: 'ri-robot-2-line' }))).toBe('<i class="ri-robot-2-line"></i>');
    });

    it('accepts colours and refuses anything that could add CSS', () => {
        expect(NodeHtml.accent(node({ color: '#ff0000' }))).toBe('#ff0000');
        expect(NodeHtml.accent(node({ color: 'rgb(1, 2, 3)' }))).toBe('rgb(1, 2, 3)');
        expect(NodeHtml.accent(node({ color: 'rebeccapurple' }))).toBe('rebeccapurple');
        const fallback = NodeHtml.accent(node({}));
        expect(NodeHtml.accent(node({ color: 'red; position: fixed; inset: 0' }))).toBe(fallback);
        expect(NodeHtml.accent(node({ color: 'url(https://attacker.example/x)' }))).toBe(fallback);
    });

    it('only takes remixicon classes from the node', () => {
        const fallback = NodeHtml.iconClass(node({}));
        expect(NodeHtml.iconClass(node({ icon: 'ri-robot-2-line ri-lg' }))).toBe('ri-robot-2-line ri-lg');
        expect(NodeHtml.iconClass(node({ icon: 'blue-orange-modal-window blue-orange-modal-window-open' }))).toBe(fallback);
        expect(NodeHtml.iconClass(node({ icon: 'ri-x fixed inset-0' }))).toBe(fallback);
    });
});
