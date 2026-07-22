/**
 * Builds the HTML string rendered inside a graph node.
 *
 * The primitives graph renders each node from a raw `html` string
 * (`Node.html`), so — exactly like `pipelines-client`'s `Utilities` — we build
 * the card with the DOM API and hand back `outerHTML`. Text fields go through
 * `innerText` (never `innerHTML`) so a node's title/description can't inject
 * markup, while the icon is trusted markup from our own catalog.
 */
import { NodeRunStatus, WorkflowNode } from '../interfaces/WorkflowGraph';
import { catalogFor } from '../interfaces/NodeCatalog';

export const NODE_WIDTH = 300;
export const NODE_HEIGHT = 92;

export class NodeHtml {

    /** Title shown on a node card: its label, else its id. */
    public static title(node: WorkflowNode): string {
        return (node.metadata && node.metadata.ui && node.metadata.ui.label) || node.id;
    }

    /** Subtitle: the human-facing summary line under the title. */
    public static subtitle(node: WorkflowNode): string {
        const ui = node.metadata && node.metadata.ui;
        if (ui && ui.description) return ui.description;
        if (node.type === 'task' || node.type === 'step' || node.type === 'router') {
            const model = node.model || 'model not set';
            return node.provider ? `${node.provider} · ${model}` : model;
        }
        if (node.type === 'gate') return node.condition ? node.condition : 'no condition set';
        if (node.type === 'loop') return node.until ? `until ${node.until}` : 'loop';
        if (node.type === 'end' || node.type === 'fail') return node.message || '';
        return '';
    }

    public static iconHtml(node: WorkflowNode): string {
        const ui = node.metadata && node.metadata.ui;
        const icon = (ui && ui.icon) || catalogFor(node.type).icon;
        return `<i class="${icon}"></i>`;
    }

    public static accent(node: WorkflowNode): string {
        const ui = node.metadata && node.metadata.ui;
        return (ui && ui.color) || catalogFor(node.type).color;
    }

    /** Build the node card markup for the given node and (optional) run status. */
    public static build(node: WorkflowNode, status?: NodeRunStatus): string {
        const accent = NodeHtml.accent(node);
        const catalog = catalogFor(node.type);

        const card = document.createElement('div');
        card.className = 'bo-llm-graph-node';
        card.setAttribute('data-node-type', node.type);
        card.setAttribute('data-status', status || 'idle');
        card.setAttribute('style', `--bo-node-accent: ${accent};`);

        // Accent rail down the left edge.
        const rail = document.createElement('div');
        rail.className = 'bo-llm-graph-node-rail';
        card.appendChild(rail);

        // Icon badge.
        const iconBox = document.createElement('div');
        iconBox.className = 'bo-llm-graph-node-icon';
        iconBox.innerHTML = NodeHtml.iconHtml(node);
        card.appendChild(iconBox);

        // Body: title + subtitle.
        const body = document.createElement('div');
        body.className = 'bo-llm-graph-node-body';

        const kind = document.createElement('div');
        kind.className = 'bo-llm-graph-node-kind';
        kind.innerText = catalog.label;
        body.appendChild(kind);

        const title = document.createElement('div');
        title.className = 'bo-llm-graph-node-title';
        title.innerText = NodeHtml.title(node);
        body.appendChild(title);

        const subtitle = document.createElement('div');
        subtitle.className = 'bo-llm-graph-node-subtitle';
        subtitle.innerText = NodeHtml.subtitle(node);
        body.appendChild(subtitle);

        card.appendChild(body);

        // Status dot (only meaningful during a run; CSS hides it when idle).
        const dot = document.createElement('div');
        dot.className = 'bo-llm-graph-node-status';
        card.appendChild(dot);

        return card.outerHTML;
    }
}
