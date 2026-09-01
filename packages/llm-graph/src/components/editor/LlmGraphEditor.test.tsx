import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LlmGraphEditor } from './LlmGraphEditor';
import { WorkflowDefinition } from '../../interfaces/WorkflowGraph';

const SAMPLE: WorkflowDefinition = {
    name: 'Support',
    nodes: {
        triage: {
            id: 'triage', type: 'task', model: 'claude-sonnet-5', depends_on: [],
            tools: [{ name: 'lookup_order', description: 'Find an order by id.' }],
            metadata: { ui: { label: 'Triage' } },
        },
        reply: {
            id: 'reply', type: 'task', model: 'claude-sonnet-5', depends_on: ['triage'],
            metadata: { ui: { label: 'Reply' } },
        },
    },
};

/** The rendered box for a node, as the primitives graph mounts it. */
function box(nodeId: string): HTMLElement {
    const element = document.getElementById(nodeId);
    if (!element) throw new Error(`no box rendered for '${nodeId}'`);
    return element;
}

/** The tool rows inside a node's box (the memory row is not one). */
function toolRows(nodeId: string): Array<HTMLElement> {
    return Array.from(box(nodeId).querySelectorAll(
        '.bo-llm-graph-tool-row:not(.bo-llm-graph-memory-row)'));
}

/** The memory row inside a node's box, if it has one. */
function memoryRow(nodeId: string): HTMLElement | null {
    return box(nodeId).querySelector('.bo-llm-graph-memory-row');
}

function configPanel(): HTMLElement | null {
    return document.querySelector('.bo-llm-graph-config-panel');
}

/** Depth-annotated tool row names inside a box. */
function rowTree(nodeId: string): Array<[string, string | null]> {
    return toolRows(nodeId).map((row) => [
        (row.querySelector('.bo-llm-graph-tool-row-name') as HTMLElement).textContent || '',
        row.getAttribute('data-bo-depth'),
    ]);
}

describe('LlmGraphEditor', () => {

    it('renders a tool as a row inside its owner\'s box, not as a node of its own', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        // Only the two top-level nodes are canvas nodes.
        expect(document.querySelectorAll('[x-blue-orange-canvas-node]')).toHaveLength(2);
        expect(toolRows('triage')).toHaveLength(1);
        expect(toolRows('reply')).toHaveLength(0);
        expect(box('triage').textContent).toContain('lookup_order');
        expect(box('triage').textContent).toContain('1 tool');
    });

    it('makes the outer box taller so the tools sit inside it', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        const withTools = parseInt(box('triage').style.height, 10);
        const without = parseInt(box('reply').style.height, 10);
        expect(withTools).toBeGreaterThan(without);

        // Every tool row is contained by the box's own height.
        const row = toolRows('triage')[0];
        expect(row.offsetTop + row.clientHeight).toBeLessThanOrEqual(withTools);
    });

    it('attaches links to the outer box, not to anything inside it', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        const edges = document.querySelectorAll('.blue-orange-graph-edge');
        expect(edges).toHaveLength(1);
        expect(document.getElementById('bo-edge-triage--reply-edge-base')).toBeTruthy();
    });

    it('does not open the configuration pane on a single click', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.click(box('triage'));
        fireEvent.click(toolRows('triage')[0]);
        expect(configPanel()).toBeNull();
    });

    it('opens the configuration pane on a double click', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.dblClick(box('triage'));
        const panel = configPanel();
        expect(panel).toBeTruthy();
        expect(panel!.textContent).toContain('Triage');
        // It is a split pane beside the canvas, not an overlay drawer.
        expect(document.querySelector('.bo-llm-graph-split-pane')).toBeTruthy();
        expect(document.querySelector('.blue-orange-drawer')).toBeNull();
    });

    it('opens the tool\'s own configuration when its row is double clicked', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.dblClick(toolRows('triage')[0]);
        expect(configPanel()!.textContent).toContain('lookup_order');
        expect(configPanel()!.textContent).toContain('Belongs to');
        // The row reads as selected inside the box.
        expect(toolRows('triage')[0].getAttribute('data-bo-selected')).toBe('true');
    });

    it('closes the pane again from its close button', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.dblClick(box('reply'));
        expect(configPanel()).toBeTruthy();

        const close = configPanel()!.querySelector('.ri-close-line');
        fireEvent.click(close!.parentElement || close!);
        expect(configPanel()).toBeNull();
    });

    it('attaches a tool from the "+" button, growing the box', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        const before = parseInt(box('reply').style.height, 10);
        const add = box('reply').querySelector('[data-bo-action="add-tool"]');
        expect(add).toBeTruthy();
        fireEvent.click(add!);

        expect(toolRows('reply')).toHaveLength(1);
        expect(parseInt(box('reply').style.height, 10)).toBeGreaterThan(before);
        // Still only two canvas nodes — the tool did not become one.
        expect(document.querySelectorAll('[x-blue-orange-canvas-node]')).toHaveLength(2);
        expect(configPanel()!.textContent).toContain('Tool');
    });

    it('shrinks the box again when a tool is deleted', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        const before = parseInt(box('triage').style.height, 10);
        fireEvent.dblClick(toolRows('triage')[0]);
        fireEvent.click(screen.getByText('Delete'));

        expect(toolRows('triage')).toHaveLength(0);
        expect(parseInt(box('triage').style.height, 10)).toBeLessThan(before);
        // The pane falls back to the owner rather than closing.
        expect(configPanel()!.textContent).toContain('Triage');
    });

    it('serialises tools back onto their agent when saved', () => {
        let saved: WorkflowDefinition | undefined;
        render(
            <LlmGraphEditor initialDefinition={SAMPLE} onSave={(definition) => { saved = definition; }}></LlmGraphEditor>);

        fireEvent.click(screen.getByText('Save'));

        expect(saved).toBeTruthy();
        expect(Object.keys(saved!.nodes).sort()).toEqual(['reply', 'triage']);
        expect(saved!.nodes.triage.tools).toEqual([
            { name: 'lookup_order', description: 'Find an order by id.', parameters: [] },
        ]);
    });
});

describe('LlmGraphEditor nested tools', () => {

    const NESTED: WorkflowDefinition = {
        name: 'Nested',
        nodes: {
            triage: {
                id: 'triage', type: 'task', model: 'claude-sonnet-5', depends_on: [],
                tools: [{
                    name: 'research',
                    tools: [{ name: 'web_search' }],
                }],
                metadata: { ui: { label: 'Triage' } },
            },
        },
    };

    it('renders a scoped tool as an indented row in the same box', () => {
        render(<LlmGraphEditor initialDefinition={NESTED}></LlmGraphEditor>);

        expect(rowTree('triage')).toEqual([['research', '0'], ['web_search', '1']]);
        // Still one canvas node: the whole tree lives in the one box.
        expect(document.querySelectorAll('[x-blue-orange-canvas-node]')).toHaveLength(1);
        // The header counts only what the agent itself may call.
        expect(box('triage').textContent).toContain('1 tool');
    });

    it('scopes a new tool to the row whose "+" was clicked', () => {
        render(<LlmGraphEditor initialDefinition={NESTED}></LlmGraphEditor>);

        const before = parseInt(box('triage').style.height, 10);
        const searchRow = toolRows('triage')[1];
        fireEvent.click(searchRow.querySelector('[data-bo-action="add-tool"]')!);

        const rows = rowTree('triage');
        expect(rows).toHaveLength(3);
        expect(rows[2][1]).toBe('2');
        expect(parseInt(box('triage').style.height, 10)).toBeGreaterThan(before);
        // The pane opens on the new tool, scoped to web_search.
        expect(configPanel()!.textContent).toContain('Scoped to');
    });

    it('deletes a tool together with everything scoped to it', () => {
        render(<LlmGraphEditor initialDefinition={NESTED}></LlmGraphEditor>);

        fireEvent.dblClick(toolRows('triage')[0]);
        fireEvent.click(screen.getByText('Delete'));

        expect(toolRows('triage')).toHaveLength(0);
        expect(configPanel()!.textContent).toContain('Triage');
    });

    it('serialises a scoped tool as the parent tool\'s own tools', () => {
        let saved: WorkflowDefinition | undefined;
        render(
            <LlmGraphEditor initialDefinition={NESTED} onSave={(definition) => { saved = definition; }}></LlmGraphEditor>);

        fireEvent.click(screen.getByText('Save'));

        const [research] = saved!.nodes.triage.tools!;
        expect(research.name).toBe('research');
        expect(research.tools!.map((tool) => tool.name)).toEqual(['web_search']);
    });
});

describe('LlmGraphEditor memory', () => {

    const WITH_MEMORY: WorkflowDefinition = {
        name: 'Recall',
        nodes: {
            triage: {
                id: 'triage', type: 'task', model: 'claude-sonnet-5', depends_on: [],
                memory: {
                    provider: 'postgres',
                    namespace: 'support',
                    recall_limit: 20,
                    write: true,
                    postgres: { host: 'db.internal', database: 'agent_memory', table: 'memories' },
                },
                tools: [{ name: 'lookup_order' }],
                metadata: { ui: { label: 'Triage' } },
            },
        },
    };

    it('renders the memory store as the first row in the box', () => {
        render(<LlmGraphEditor initialDefinition={WITH_MEMORY}></LlmGraphEditor>);

        const row = memoryRow('triage');
        expect(row).toBeTruthy();
        expect(row!.textContent).toContain('db.internal/agent_memory');
        // Memory sits above the tools, and neither is a canvas node.
        const rows = Array.from(box('triage').querySelectorAll('[data-bo-row]'));
        expect(rows[0]).toBe(row);
        expect(document.querySelectorAll('[x-blue-orange-canvas-node]')).toHaveLength(1);
        // The header still counts only tools.
        expect(box('triage').textContent).toContain('1 tool');
    });

    it('attaches a memory store from the header button', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        expect(memoryRow('reply')).toBeNull();
        const before = parseInt(box('reply').style.height, 10);
        fireEvent.click(box('reply').querySelector('[data-bo-action="add-memory"]')!);

        expect(memoryRow('reply')).toBeTruthy();
        expect(parseInt(box('reply').style.height, 10)).toBeGreaterThan(before);
        expect(configPanel()!.textContent).toContain('Connection URI');
    });

    it('hides the attach button once an agent has memory', () => {
        render(<LlmGraphEditor initialDefinition={WITH_MEMORY}></LlmGraphEditor>);
        expect(box('triage').querySelector('[data-bo-action="add-memory"]')).toBeNull();
    });

    it('opens the store\'s configuration when its row is double clicked', () => {
        render(<LlmGraphEditor initialDefinition={WITH_MEMORY}></LlmGraphEditor>);

        fireEvent.dblClick(memoryRow('triage')!);
        const panel = configPanel()!;
        expect(panel.textContent).toContain('Memory for');
        expect(panel.textContent).toContain('Password secret');
        expect(memoryRow('triage')!.getAttribute('data-bo-selected')).toBe('true');
    });

    it('serialises the store back onto the agent as `memory`', () => {
        let saved: WorkflowDefinition | undefined;
        render(
            <LlmGraphEditor initialDefinition={WITH_MEMORY} onSave={(definition) => { saved = definition; }}></LlmGraphEditor>);

        fireEvent.click(screen.getByText('Save'));

        expect(Object.keys(saved!.nodes)).toEqual(['triage']);
        expect(saved!.nodes.triage.memory).toEqual(WITH_MEMORY.nodes.triage.memory);
    });

    it('removes the store with the agent it belongs to', () => {
        render(<LlmGraphEditor initialDefinition={WITH_MEMORY}></LlmGraphEditor>);

        fireEvent.dblClick(box('triage'));
        fireEvent.click(screen.getByText('Delete'));

        expect(document.getElementById('triage')).toBeNull();
        expect(document.querySelectorAll('[data-bo-row]')).toHaveLength(0);
    });
});

describe('LlmGraphEditor configuration pane', () => {

    /** A three-level tool tree with a sibling at each level. */
    const TREE: WorkflowDefinition = {
        name: 'Tree',
        nodes: {
            triage: {
                id: 'triage', type: 'task', depends_on: [],
                tools: [
                    { name: 'research', tools: [{ name: 'web_search', tools: [{ name: 'rank' }] }, { name: 'summarise' }] },
                    { name: 'reply_tool' },
                ],
                metadata: { ui: { label: 'Triage' } },
            },
        },
    };

    it('opens on the new store when memory is added from the pane', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.dblClick(box('reply'));
        fireEvent.click(screen.getByText('Add memory'));

        const panel = configPanel();
        expect(panel).toBeTruthy();
        expect(panel!.textContent).toContain('Connection URI');
        expect(memoryRow('reply')).toBeTruthy();
    });

    it('opens on the new tool when one is added from the pane', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.dblClick(box('reply'));
        fireEvent.click(screen.getByText('Add tool'));

        expect(configPanel()!.textContent).toContain('Tool name');
        expect(toolRows('reply')).toHaveLength(1);
    });

    it('stays open across a run of edits', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.dblClick(box('reply'));
        fireEvent.click(screen.getByText('Add memory'));
        expect(configPanel()).toBeTruthy();

        fireEvent.dblClick(box('reply'));
        fireEvent.click(screen.getByText('Add tool'));
        expect(configPanel()).toBeTruthy();

        fireEvent.click(screen.getByText('Add scoped tool'));
        expect(configPanel()).toBeTruthy();
        expect(toolRows('reply')).toHaveLength(2);
    });

    it('falls back to the box rather than closing if its node goes missing', () => {
        render(<LlmGraphEditor initialDefinition={SAMPLE}></LlmGraphEditor>);

        fireEvent.dblClick(toolRows('triage')[0]);
        expect(configPanel()!.textContent).toContain('lookup_order');

        // The graph re-emitting a state the tool is absent from must not take
        // the pane with it.
        const parent = document.querySelector('.blue-orange-graph-parent')!;
        parent.dispatchEvent(new (window as any).CustomEvent('blue-orange-graph-update-event', {
            detail: { nodes: [{ id: 'triage', x: 0, y: 0 }], edges: [] },
        }));

        expect(configPanel()).toBeTruthy();
    });

    it('draws tree lines joining a scoped tool to the tool that owns it', () => {
        render(<LlmGraphEditor initialDefinition={TREE}></LlmGraphEditor>);

        const rows = toolRows('triage');
        expect(rows.map((row) => row.getAttribute('data-bo-depth')))
            .toEqual(['0', '1', '2', '1', '0']);

        // Depth 0 rows sit at the root of the well and have no lines.
        expect(rows[0].querySelectorAll('.bo-llm-graph-row-elbow')).toHaveLength(0);
        // Every nested row is joined to its parent by exactly one elbow.
        [1, 2, 3].forEach((index) => {
            expect(rows[index].querySelectorAll('.bo-llm-graph-row-elbow')).toHaveLength(1);
        });
    });

    it('runs a line on past a row that has siblings below it', () => {
        render(<LlmGraphEditor initialDefinition={TREE}></LlmGraphEditor>);
        const rows = toolRows('triage');

        // web_search (depth 1) is followed by summarise, so its level continues.
        expect(rows[1].querySelectorAll('.bo-llm-graph-row-guide-below')).toHaveLength(1);
        // summarise closes that level, so it does not.
        expect(rows[3].querySelectorAll('.bo-llm-graph-row-guide-below')).toHaveLength(0);
        // rank (depth 2) still shows its grandparent's run, since summarise follows.
        const carried = Array.from(rows[2].querySelectorAll(
            '.bo-llm-graph-row-guide:not(.bo-llm-graph-row-guide-below)'));
        expect(carried).toHaveLength(1);
    });

    it('indents each level and places the lines in that level\'s gutter', () => {
        render(<LlmGraphEditor initialDefinition={TREE}></LlmGraphEditor>);
        const rows = toolRows('triage');

        expect(rows[0].style.marginLeft).toBe('0px');
        expect(rows[1].style.marginLeft).toBe('16px');
        expect(rows[2].style.marginLeft).toBe('32px');
        // The elbow reaches back half an indent, into the parent's column.
        expect((rows[1].querySelector('.bo-llm-graph-row-elbow') as HTMLElement).style.left).toBe('-8px');
        expect((rows[2].querySelector('.bo-llm-graph-row-elbow') as HTMLElement).style.left).toBe('-8px');
        // The carried line for depth 2 sits a further indent to the left.
        const carried = rows[2].querySelector(
            '.bo-llm-graph-row-guide:not(.bo-llm-graph-row-guide-below)') as HTMLElement;
        expect(carried.style.left).toBe('-24px');
    });
});
