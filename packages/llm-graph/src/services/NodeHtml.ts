/**
 * Builds the HTML string rendered inside a graph node.
 *
 * The primitives graph renders each node from a raw `html` string
 * (`Node.html`), so — exactly like `pipelines-client`'s `Utilities` — we build
 * the card with the DOM API and hand back `outerHTML`. Text fields go through
 * `textContent` (never `innerHTML`) so a node's title/description can't inject
 * markup, while the icon is trusted markup from our own catalog.
 *
 * An agent that owns tools renders as an **outer box**: a header carrying the
 * agent itself, and a well below it holding one row per tool. The box is the
 * graph node, which is what makes the group behave as a single unit — links
 * attach to the box, dragging the box carries the tools with it, and a tool can
 * never be pulled outside it, because a tool is not a node of its own.
 *
 * A tool may scope tools of its own. Those render as further rows in the same
 * well, indented one step per level of nesting, so the whole tree stays inside
 * the one box. An agent's memory store, when it has one, is the first row in
 * that well.
 *
 * Rows inside the box are reached through `data-bo-*` attributes: the editor
 * reads the click target rather than binding listeners to injected markup.
 */
import { NodeRunStatus, WorkflowNode } from '../interfaces/WorkflowGraph';
import { canHostMemory, canHostTools, catalogFor } from '../interfaces/NodeCatalog';

/** Width of every node box on the canvas. */
export const NODE_WIDTH = 300;
/** Height of a plain card, and of the header row inside a box with tools. */
export const NODE_HEIGHT = 92;
/** Height of one tool row inside the well. */
export const TOOL_ROW_HEIGHT = 58;
/** Gap between tool rows. */
export const TOOL_ROW_GAP = 8;
/** Inset between the box edge and the tool rows inside it. */
export const WELL_PADDING = 12;
/** Extra left inset applied per level of tool nesting. */
export const TOOL_ROW_INDENT = 16;
/**
 * Indentation stops growing past this depth. Nesting itself is unbounded; this
 * only keeps a deeply scoped tool's name from being squeezed out of the box.
 */
export const MAX_INDENT_DEPTH = 4;

/** The `data-bo-action` value on the in-card "add tool" button. */
export const ADD_TOOL_ACTION = 'add-tool';
/** The `data-bo-action` value on the in-card "add memory" button. */
export const ADD_MEMORY_ACTION = 'add-memory';
/** The attribute every row in a well carries, holding the node id it maps to. */
export const ROW_NODE_ATTRIBUTE = 'data-bo-row';

/** One row in a box's well, at the depth it is nested to. */
export interface BoxRow {
    node: WorkflowNode;
    /** 0 for a node owned directly, 1 for a tool scoped to one of those, … */
    depth: number;
    /**
     * For each ancestor level, whether that ancestor has a later sibling — i.e.
     * whether its vertical tree line runs on past this row.
     */
    guides?: Array<boolean>;
    /** True when this row is the last child of its parent. */
    last?: boolean;
}

/** Optional extras when rendering a card. */
export interface NodeCardOptions {
    /** Live run status, used for the status dot and border. */
    status?: NodeRunStatus;
    /** Every row in this node's box: its memory store, then its tool tree. */
    rows?: Array<BoxRow>;
    /** Id of the nested node whose row should read as selected. */
    selectedRowId?: string;
}

export class NodeHtml {

    /** The card width used for a node. Every box is the same width. */
    public static width(_node?: WorkflowNode): number {
        return NODE_WIDTH;
    }

    /**
     * The height of a node's box: a plain card, or a header plus a well tall
     * enough for `rowCount` rows — the memory store plus every tool in the
     * tree, at any depth, since nesting indents rather than stacking elsewhere.
     */
    public static height(node: WorkflowNode, rowCount: number = 0): number {
        if (node.type === 'tool' || node.type === 'memory' || rowCount <= 0) return NODE_HEIGHT;
        return NODE_HEIGHT
            + WELL_PADDING * 2
            + rowCount * TOOL_ROW_HEIGHT
            + (rowCount - 1) * TOOL_ROW_GAP;
    }

    /** Title shown on a node card: its label, else its id. */
    public static title(node: WorkflowNode): string {
        const label = node.metadata && node.metadata.ui && node.metadata.ui.label;
        if (label) return label;
        if (node.type === 'tool') return node.name || node.tool_ref || node.id;
        if (node.type === 'memory') return 'Memory';
        return node.id;
    }

    /** Subtitle: the human-facing summary line under the title. */
    public static subtitle(node: WorkflowNode): string {
        const ui = node.metadata && node.metadata.ui;
        if (ui && ui.description) return ui.description;
        if (node.type === 'tool') {
            if (node.description) return node.description;
            if (node.tool_ref) return `registry · ${node.tool_ref}`;
            const count = (node.parameters || []).length;
            return count === 0 ? 'no parameters' : `${count} parameter${count === 1 ? '' : 's'}`;
        }
        if (node.type === 'memory') return NodeHtml.memorySummary(node);
        if (node.type === 'task' || node.type === 'step' || node.type === 'router') {
            const model = node.model || 'model not set';
            return node.provider ? `${node.provider} · ${model}` : model;
        }
        if (node.type === 'gate') return node.condition ? node.condition : 'no condition set';
        if (node.type === 'loop') return node.until ? `until ${node.until}` : 'loop';
        if (node.type === 'end' || node.type === 'fail') return node.message || '';
        return '';
    }

    /** Where a memory node stores things, summarised for its row. */
    public static memorySummary(node: WorkflowNode): string {
        const memory = node.memory;
        if (!memory) return 'not configured';
        if (memory.provider !== 'postgres') return memory.provider;
        const connection = memory.postgres || {};
        if (connection.uri) return `postgres · ${NodeHtml.redact(connection.uri)}`;
        if (connection.host) {
            const database = connection.database ? `/${connection.database}` : '';
            return `postgres · ${connection.host}${database}`;
        }
        return 'postgres · connection not set';
    }

    /**
     * Strip credentials out of a connection URI before it is drawn on a card —
     * a canvas gets screen-shared and screenshotted.
     */
    public static redact(uri: string): string {
        return uri.replace(/\/\/[^/@]*@/, '//');
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

    /** Build the box markup for a node and everything nested inside it. */
    public static build(node: WorkflowNode, options: NodeCardOptions = {}): string {
        const rows = options.rows || [];
        const catalog = catalogFor(node.type);

        const card = document.createElement('div');
        card.className = rows.length > 0
            ? 'bo-llm-graph-node bo-llm-graph-node-boxed'
            : 'bo-llm-graph-node';
        card.setAttribute('data-node-type', node.type);
        card.setAttribute('data-status', options.status || 'idle');
        card.setAttribute('style', `--bo-node-accent: ${NodeHtml.accent(node)};`);

        // Accent rail down the left edge of the whole box.
        const rail = document.createElement('div');
        rail.className = 'bo-llm-graph-node-rail';
        card.appendChild(rail);

        const hasMemory = rows.some((row) => row.node.type === 'memory');
        // The header counts what this node itself may call — tools scoped to a
        // tool belong to that tool, not to the node.
        const directTools = rows.filter(
            (row) => row.depth === 0 && row.node.type === 'tool').length;
        card.appendChild(NodeHtml.header(node, catalog.label, directTools, hasMemory));

        if (rows.length > 0) {
            const well = document.createElement('div');
            well.className = 'bo-llm-graph-node-well';
            rows.forEach((row) => {
                const selected = row.node.id === options.selectedRowId;
                well.appendChild(row.node.type === 'memory'
                    ? NodeHtml.memoryRow(row.node, selected, options.status)
                    : NodeHtml.toolRow(row, selected, options.status));
            });
            card.appendChild(well);
        }

        return card.outerHTML;
    }

    // -- internals ---------------------------------------------------------

    /** The node's own row: icon, title block, and the "add" buttons. */
    private static header(
        node: WorkflowNode,
        label: string,
        toolCount: number,
        hasMemory: boolean,
    ): HTMLElement {
        const header = document.createElement('div');
        header.className = 'bo-llm-graph-node-header';

        const iconBox = document.createElement('div');
        iconBox.className = 'bo-llm-graph-node-icon';
        iconBox.innerHTML = NodeHtml.iconHtml(node);
        header.appendChild(iconBox);

        const body = document.createElement('div');
        body.className = 'bo-llm-graph-node-body';

        const kind = document.createElement('div');
        kind.className = 'bo-llm-graph-node-kind';
        kind.textContent = toolCount > 0
            ? `${label} · ${toolCount} tool${toolCount === 1 ? '' : 's'}`
            : label;
        body.appendChild(kind);

        const title = document.createElement('div');
        title.className = 'bo-llm-graph-node-title';
        title.textContent = NodeHtml.title(node);
        body.appendChild(title);

        const subtitle = document.createElement('div');
        subtitle.className = 'bo-llm-graph-node-subtitle';
        subtitle.textContent = NodeHtml.subtitle(node);
        body.appendChild(subtitle);

        header.appendChild(body);

        // An agent that has no memory store yet can attach one from here.
        if (canHostMemory(node.type) && !hasMemory) {
            header.appendChild(NodeHtml.actionButton(
                ADD_MEMORY_ACTION, node.id, 'Give this agent a memory store', 'ri-database-2-line'));
        }

        // Agent cards get an inline "add tool" button, matching the "+" that
        // sits inside the agent container on comparable workflow builders.
        if (canHostTools(node.type)) {
            header.appendChild(NodeHtml.actionButton(
                ADD_TOOL_ACTION, node.id, 'Add a tool to this agent', 'ri-add-line'));
        }

        // Status dot (only meaningful during a run; CSS hides it when idle).
        const dot = document.createElement('div');
        dot.className = 'bo-llm-graph-node-status';
        header.appendChild(dot);

        return header;
    }

    /**
     * One tool inside the well, indented for its nesting depth. Double-clicking
     * the row opens its config; its own "+" scopes a further tool to it.
     */
    private static toolRow(
        { node: tool, depth, guides, last }: BoxRow,
        selected: boolean,
        status?: NodeRunStatus,
    ): HTMLElement {
        const level = Math.min(depth, MAX_INDENT_DEPTH);
        const indent = level * TOOL_ROW_INDENT;

        const row = document.createElement('div');
        row.className = 'bo-llm-graph-tool-row';
        row.setAttribute(ROW_NODE_ATTRIBUTE, tool.id);
        row.setAttribute('data-status', status || 'idle');
        row.setAttribute('data-bo-depth', String(depth));
        if (selected) row.setAttribute('data-bo-selected', 'true');
        row.setAttribute('style', `--bo-tool-accent: ${NodeHtml.accent(tool)}; margin-left: ${indent}px;`);

        NodeHtml.guides(level, guides || [], last !== false)
            .forEach((guide) => row.appendChild(guide));

        const iconBox = document.createElement('div');
        iconBox.className = 'bo-llm-graph-tool-row-icon';
        iconBox.innerHTML = NodeHtml.iconHtml(tool);
        row.appendChild(iconBox);

        const body = document.createElement('div');
        body.className = 'bo-llm-graph-tool-row-body';

        const name = document.createElement('div');
        name.className = 'bo-llm-graph-tool-row-name';
        name.textContent = NodeHtml.title(tool);
        body.appendChild(name);

        const description = document.createElement('div');
        description.className = 'bo-llm-graph-tool-row-desc';
        description.textContent = NodeHtml.subtitle(tool);
        body.appendChild(description);

        row.appendChild(body);

        // Same action the header carries, pointed at this tool: the editor
        // reads `data-bo-node` for the owner, so nesting needs no new handler.
        // A registry reference is defined elsewhere, so it is not extended here.
        if (!tool.tool_ref) {
            const action = NodeHtml.actionButton(
                ADD_TOOL_ACTION, tool.id, 'Add a tool only this tool can call', 'ri-add-line');
            action.className += ' bo-llm-graph-tool-row-action';
            row.appendChild(action);
        }

        return row;
    }

    /** The agent's memory store, shown as the first row in the well. */
    private static memoryRow(
        memory: WorkflowNode,
        selected: boolean,
        status?: NodeRunStatus,
    ): HTMLElement {
        const row = document.createElement('div');
        row.className = 'bo-llm-graph-tool-row bo-llm-graph-memory-row';
        row.setAttribute(ROW_NODE_ATTRIBUTE, memory.id);
        row.setAttribute('data-status', status || 'idle');
        row.setAttribute('data-bo-depth', '0');
        if (selected) row.setAttribute('data-bo-selected', 'true');
        row.setAttribute('style', `--bo-tool-accent: ${NodeHtml.accent(memory)};`);

        const iconBox = document.createElement('div');
        iconBox.className = 'bo-llm-graph-tool-row-icon';
        iconBox.innerHTML = NodeHtml.iconHtml(memory);
        row.appendChild(iconBox);

        const body = document.createElement('div');
        body.className = 'bo-llm-graph-tool-row-body';

        const name = document.createElement('div');
        name.className = 'bo-llm-graph-tool-row-name';
        name.textContent = NodeHtml.title(memory);
        body.appendChild(name);

        const description = document.createElement('div');
        description.className = 'bo-llm-graph-tool-row-desc';
        description.textContent = NodeHtml.subtitle(memory);
        body.appendChild(description);

        row.appendChild(body);
        return row;
    }

    /**
     * The tree lines to the left of a nested row: a vertical run for every
     * ancestor that continues below, and an elbow joining this row to its
     * parent. Positions are relative to the row, which is itself already
     * indented, so each line lands in the gutter of the level it belongs to.
     */
    private static guides(level: number, guides: Array<boolean>, last: boolean): Array<HTMLElement> {
        const elements: Array<HTMLElement> = [];
        if (level <= 0) return elements;

        // A level's line runs half an indent to the left of its own column.
        const offsetFor = (ancestor: number) =>
            (ancestor + 0.5) * TOOL_ROW_INDENT - level * TOOL_ROW_INDENT;

        for (let ancestor = 0; ancestor < level - 1; ancestor += 1) {
            if (!guides[ancestor]) continue;
            const line = document.createElement('div');
            line.className = 'bo-llm-graph-row-guide';
            line.setAttribute('style', `left: ${offsetFor(ancestor)}px;`);
            elements.push(line);
        }

        // The elbow: down from the parent, then across into this row.
        const elbow = document.createElement('div');
        elbow.className = 'bo-llm-graph-row-elbow';
        elbow.setAttribute('style', `left: ${offsetFor(level - 1)}px;`);
        elements.push(elbow);

        // A row with siblings after it keeps its level's line running on down.
        if (!last) {
            const line = document.createElement('div');
            line.className = 'bo-llm-graph-row-guide bo-llm-graph-row-guide-below';
            line.setAttribute('style', `left: ${offsetFor(level - 1)}px;`);
            elements.push(line);
        }

        return elements;
    }

    /** A `data-bo-action` button the editor recognises from the click target. */
    private static actionButton(
        action: string,
        nodeId: string,
        title: string,
        icon: string,
    ): HTMLElement {
        const button = document.createElement('div');
        button.className = 'bo-llm-graph-node-action';
        button.setAttribute('data-bo-action', action);
        button.setAttribute('data-bo-node', nodeId);
        button.setAttribute('title', title);
        button.innerHTML = `<i class="${icon}"></i>`;
        return button;
    }
}
