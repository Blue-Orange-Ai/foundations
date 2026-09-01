import { describe, expect, it } from 'vitest';
import { WorkflowDefinition, WorkflowNode } from '../interfaces/WorkflowGraph';
import { WorkflowSerializer } from './WorkflowSerializer';
import { WorkflowLayout } from './WorkflowLayout';
import { NodeHtml } from './NodeHtml';

/** An agent definition with one inline tool and one registry reference. */
function agentDefinition(): WorkflowDefinition {
    return {
        name: 'Support',
        nodes: {
            triage: {
                id: 'triage',
                type: 'task',
                provider: 'anthropic',
                model: 'claude-sonnet-5',
                depends_on: [],
                tools: [{
                    name: 'lookup_order',
                    description: 'Find an order by id.',
                    parameters: [{ name: 'order_id', type_expr: 'str', required: true }],
                }],
                tool_ids: ['send_email'],
            },
            reply: {
                id: 'reply', type: 'task', model: 'claude-sonnet-5', depends_on: ['triage'],
            },
        },
    };
}

describe('WorkflowSerializer tools', () => {

    it('expands an agent\'s tools into nested tool nodes', () => {
        const expanded = WorkflowSerializer.expand(agentDefinition());
        const tools = WorkflowSerializer.toolsOf(expanded, 'triage');

        expect(tools).toHaveLength(2);
        expect(tools.map((tool) => tool.name)).toEqual(['lookup_order', 'send_email']);
        expect(tools.every((tool) => tool.type === 'tool' && tool.parent === 'triage')).toBe(true);
        expect(tools[0].parameters).toEqual([{ name: 'order_id', type_expr: 'str', required: true }]);
        expect(tools[1].tool_ref).toBe('send_email');
        // The canvas nodes are the source of truth once expanded.
        expect(expanded.nodes.triage.tools).toEqual([]);
        expect(expanded.nodes.triage.tool_ids).toEqual([]);
    });

    it('leaves nodes that own no tools alone', () => {
        const expanded = WorkflowSerializer.expand(agentDefinition());
        expect(WorkflowSerializer.toolsOf(expanded, 'reply')).toHaveLength(0);
        expect(WorkflowSerializer.topLevelIds(expanded).sort()).toEqual(['reply', 'triage']);
    });

    it('round-trips back to the agent shape on serialise', () => {
        const original = agentDefinition();
        const serialized = WorkflowSerializer.serialize(WorkflowSerializer.expand(original));

        expect(Object.keys(serialized.nodes).sort()).toEqual(['reply', 'triage']);
        expect(serialized.nodes.triage.tools).toEqual(original.nodes.triage.tools);
        expect(serialized.nodes.triage.tool_ids).toEqual(['send_email']);
        expect(serialized.nodes.reply.depends_on).toEqual(['triage']);
    });

    it('is idempotent when expanding an already-expanded definition', () => {
        const once = WorkflowSerializer.expand(agentDefinition());
        const twice = WorkflowSerializer.expand(once);
        expect(WorkflowSerializer.toolsOf(twice, 'triage')).toHaveLength(2);
    });
});

describe('WorkflowSerializer reconcile', () => {

    it('keeps tools off the canvas and carries them across', () => {
        const expanded = WorkflowSerializer.expand(agentDefinition());
        const toolId = WorkflowSerializer.toolsOf(expanded, 'triage')[0].id;

        // Only top-level nodes are projected onto the graph.
        const graphNodes = WorkflowSerializer.toGraphNodes(expanded);
        expect(graphNodes.map((graphNode) => graphNode.id).sort()).toEqual(['reply', 'triage']);

        const reconciled = WorkflowSerializer.reconcile(
            expanded,
            graphNodes.map((graphNode) => ({ id: graphNode.id, x: 0, y: 0 })),
            [{ sourceId: 'triage', targetId: 'reply' }]);

        expect(reconciled.nodes.reply.depends_on).toEqual(['triage']);
        expect(reconciled.nodes[toolId]).toBeDefined();
        expect(reconciled.nodes[toolId].parent).toBe('triage');
    });

    it('drops a tool whose owner has left the canvas', () => {
        const expanded = WorkflowSerializer.expand(agentDefinition());
        const toolId = WorkflowSerializer.toolsOf(expanded, 'triage')[0].id;

        const reconciled = WorkflowSerializer.reconcile(expanded, [{ id: 'reply', x: 0, y: 0 }], []);

        expect(reconciled.nodes[toolId]).toBeUndefined();
        expect(reconciled.nodes.triage).toBeUndefined();
        expect(reconciled.nodes.reply).toBeDefined();
    });

    it('sizes an owner\'s graph node to fit the tools inside it', () => {
        const expanded = WorkflowSerializer.expand(agentDefinition());
        const nodes = WorkflowSerializer.toGraphNodes(expanded);
        const triage = nodes.filter((node) => node.id === 'triage')[0];
        const reply = nodes.filter((node) => node.id === 'reply')[0];

        expect(triage.height).toBeGreaterThan(reply.height);
        expect(triage.width).toBe(reply.width);
    });
});

describe('WorkflowSerializer validate', () => {

    it('flags a tool with no name', () => {
        const expanded = WorkflowSerializer.expand(agentDefinition());
        const toolId = WorkflowSerializer.toolsOf(expanded, 'triage')[0].id;
        expanded.nodes[toolId] = { ...expanded.nodes[toolId], name: '' };

        const issues = WorkflowSerializer.validate(expanded);
        expect(issues.some((issue) => issue.nodeId === toolId && /no name/.test(issue.message))).toBe(true);
    });

    it('flags two tools on one agent claiming the same name', () => {
        const expanded = WorkflowSerializer.expand(agentDefinition());
        const [first, second] = WorkflowSerializer.toolsOf(expanded, 'triage');
        expanded.nodes[second.id] = { ...second, tool_ref: undefined, name: first.name };

        const issues = WorkflowSerializer.validate(expanded);
        expect(issues.some((issue) => /more than one tool named/.test(issue.message))).toBe(true);
    });

    it('flags a tool attached to a node that cannot own one', () => {
        const definition: WorkflowDefinition = {
            name: 'Bad',
            nodes: {
                check: { id: 'check', type: 'gate', condition: 'x', then: 'done' },
                done: { id: 'done', type: 'end' },
                stray: { id: 'stray', type: 'tool', parent: 'check', name: 'do_thing' },
            },
        };
        const issues = WorkflowSerializer.validate(definition);
        expect(issues.some((issue) => /only sit under an agent node/.test(issue.message))).toBe(true);
    });
});

/** An agent whose tool scopes a tool of its own, two levels deep. */
function nestedDefinition(): WorkflowDefinition {
    return {
        name: 'Nested',
        nodes: {
            triage: {
                id: 'triage', type: 'task', depends_on: [],
                tools: [{
                    name: 'research',
                    description: 'Research a question.',
                    tools: [
                        {
                            name: 'web_search',
                            description: 'Only research may call this.',
                            parameters: [{ name: 'query', type_expr: 'str', required: true }],
                            tools: [{ name: 'rank_results', description: 'Only web_search may call this.' }],
                        },
                        { name: 'summarise' },
                    ],
                    tool_ids: ['cache_lookup'],
                }],
            },
        },
    };
}

describe('WorkflowSerializer nested tools', () => {

    it('expands a tool\'s own tools into nodes scoped to it', () => {
        const expanded = WorkflowSerializer.expand(nestedDefinition());

        const [research] = WorkflowSerializer.toolsOf(expanded, 'triage');
        expect(research.name).toBe('research');

        const scoped = WorkflowSerializer.toolsOf(expanded, research.id);
        expect(scoped.map((tool) => tool.name)).toEqual(['web_search', 'summarise', 'cache_lookup']);
        expect(scoped.every((tool) => tool.parent === research.id)).toBe(true);

        // Three levels down.
        const search = scoped.filter((tool) => tool.name === 'web_search')[0];
        expect(WorkflowSerializer.toolsOf(expanded, search.id).map((tool) => tool.name))
            .toEqual(['rank_results']);
        // A scoped tool is not visible to the agent that owns its parent.
        expect(WorkflowSerializer.toolsOf(expanded, 'triage')).toHaveLength(1);
    });

    it('round-trips the whole tree back to the agent shape', () => {
        const original = nestedDefinition();
        const serialized = WorkflowSerializer.serialize(WorkflowSerializer.expand(original));

        expect(Object.keys(serialized.nodes)).toEqual(['triage']);
        const [research] = serialized.nodes.triage.tools!;
        expect(research.name).toBe('research');
        expect(research.tool_ids).toEqual(['cache_lookup']);
        expect(research.tools!.map((tool) => tool.name)).toEqual(['web_search', 'summarise']);
        expect(research.tools![0].tools!.map((tool) => tool.name)).toEqual(['rank_results']);
        // A leaf carries no empty `tools` key.
        expect(research.tools![1].tools).toBeUndefined();
    });

    it('deletes a tool\'s scoped tools along with it', () => {
        const expanded = WorkflowSerializer.expand(nestedDefinition());
        const [research] = WorkflowSerializer.toolsOf(expanded, 'triage');

        const subtree = WorkflowLayout.toolSubtreeIds(expanded, research.id);
        expect(subtree).toHaveLength(4);
        expect(WorkflowLayout.toolSubtreeIds(expanded, 'triage')).toHaveLength(5);
    });

    it('flattens the tree depth-first with a depth per row', () => {
        const expanded = WorkflowSerializer.expand(nestedDefinition());
        const rows = WorkflowLayout.toolTree(expanded, 'triage');

        expect(rows.map((row) => [row.node.name, row.depth])).toEqual([
            ['research', 0],
            ['web_search', 1],
            ['rank_results', 2],
            ['summarise', 1],
            ['cache_lookup', 1],
        ]);
    });

    it('resolves the box a deeply scoped tool is drawn in', () => {
        const expanded = WorkflowSerializer.expand(nestedDefinition());
        const deepest = WorkflowLayout.toolTree(expanded, 'triage')
            .filter((row) => row.node.name === 'rank_results')[0];

        expect(WorkflowLayout.boxIdOf(expanded, deepest.node.id)).toBe('triage');
        expect(WorkflowLayout.boxIdOf(expanded, 'triage')).toBe('triage');
    });

    it('rejects tools scoped under a registry reference', () => {
        const expanded = WorkflowSerializer.expand(nestedDefinition());
        const research = WorkflowSerializer.toolsOf(expanded, 'triage')[0];
        const reference = WorkflowSerializer.toolsOf(expanded, research.id)
            .filter((tool) => tool.tool_ref)[0];
        expanded.nodes.stray = {
            id: 'stray', type: 'tool', parent: reference.id, name: 'nope',
        };

        const issues = WorkflowSerializer.validate(expanded);
        expect(issues.some((issue) => /cannot scope tools of its own/.test(issue.message))).toBe(true);
    });

    it('terminates on a parent chain that loops', () => {
        const definition: WorkflowDefinition = {
            name: 'Loop',
            nodes: {
                agent: { id: 'agent', type: 'task', depends_on: [] },
                a: { id: 'a', type: 'tool', parent: 'b', name: 'a' },
                b: { id: 'b', type: 'tool', parent: 'a', name: 'b' },
            },
        };
        expect(WorkflowLayout.toolTree(definition, 'agent')).toEqual([]);
        expect(WorkflowLayout.boxIdOf(definition, 'a')).toBeUndefined();
        expect(WorkflowSerializer.serialize(definition).nodes.agent).toBeDefined();
    });
});

/** An agent with a Postgres-backed memory store. */
function memoryDefinition(): WorkflowDefinition {
    return {
        name: 'Recall',
        nodes: {
            triage: {
                id: 'triage', type: 'task', depends_on: [],
                memory: {
                    provider: 'postgres',
                    namespace: 'support',
                    recall_limit: 20,
                    write: true,
                    postgres: {
                        host: 'db.internal',
                        port: 5432,
                        database: 'agent_memory',
                        user: 'agent',
                        password_secret: 'PG_AGENT_PASSWORD',
                        schema: 'public',
                        table: 'memories',
                        ssl: true,
                    },
                },
                tools: [{ name: 'lookup_order' }],
            },
        },
    };
}

describe('WorkflowSerializer memory', () => {

    it('expands an agent\'s memory into a node attached to it', () => {
        const expanded = WorkflowSerializer.expand(memoryDefinition());
        const memory = WorkflowSerializer.memoryOf(expanded, 'triage');

        expect(memory).toBeDefined();
        expect(memory!.type).toBe('memory');
        expect(memory!.parent).toBe('triage');
        expect(memory!.memory!.postgres!.host).toBe('db.internal');
        // The memory node is the source of truth once expanded.
        expect(expanded.nodes.triage.memory).toBeUndefined();
        // It is not a top-level node, and not a tool.
        expect(WorkflowSerializer.topLevelIds(expanded)).toEqual(['triage']);
        expect(WorkflowSerializer.toolsOf(expanded, 'triage')).toHaveLength(1);
    });

    it('renders the store as the first row, above the tools', () => {
        const expanded = WorkflowSerializer.expand(memoryDefinition());
        const rows = WorkflowLayout.boxRows(expanded, 'triage');

        expect(rows.map((row) => row.node.type)).toEqual(['memory', 'tool']);
        expect(WorkflowLayout.boxChildIds(expanded, 'triage')).toHaveLength(2);
    });

    it('round-trips the store back onto the agent', () => {
        const original = memoryDefinition();
        const serialized = WorkflowSerializer.serialize(WorkflowSerializer.expand(original));

        expect(Object.keys(serialized.nodes)).toEqual(['triage']);
        expect(serialized.nodes.triage.memory).toEqual(original.nodes.triage.memory);
    });

    it('leaves an already-collapsed definition\'s memory untouched', () => {
        const once = WorkflowSerializer.serialize(memoryDefinition());
        const twice = WorkflowSerializer.serialize(once);
        expect(twice.nodes.triage.memory).toEqual(memoryDefinition().nodes.triage.memory);
    });

    it('flags a store with nowhere to connect', () => {
        const expanded = WorkflowSerializer.expand(memoryDefinition());
        const memory = WorkflowSerializer.memoryOf(expanded, 'triage')!;
        expanded.nodes[memory.id] = {
            ...memory, memory: { provider: 'postgres', postgres: {} },
        };

        const issues = WorkflowSerializer.validate(expanded);
        expect(issues.some((issue) => /needs a connection URI/.test(issue.message))).toBe(true);
        expect(issues.some((issue) => /no database set/.test(issue.message))).toBe(true);
    });

    it('accepts a connection URI in place of the discrete fields', () => {
        const expanded = WorkflowSerializer.expand(memoryDefinition());
        const memory = WorkflowSerializer.memoryOf(expanded, 'triage')!;
        expanded.nodes[memory.id] = {
            ...memory,
            memory: {
                provider: 'postgres',
                postgres: { uri: 'postgresql://agent@db.internal:5432/agent_memory', table: 'memories' },
            },
        };

        const issues = WorkflowSerializer.validate(expanded);
        expect(issues.filter((issue) => issue.nodeId === memory.id)).toEqual([]);
    });

    it('warns about a password embedded in the connection URI', () => {
        const expanded = WorkflowSerializer.expand(memoryDefinition());
        const memory = WorkflowSerializer.memoryOf(expanded, 'triage')!;
        expanded.nodes[memory.id] = {
            ...memory,
            memory: {
                provider: 'postgres',
                postgres: { uri: 'postgresql://agent:hunter2@db.internal/agent_memory', table: 'memories' },
            },
        };

        const issues = WorkflowSerializer.validate(expanded);
        const warning = issues.filter((issue) => /password inside its connection URI/.test(issue.message))[0];
        expect(warning).toBeDefined();
        expect(warning.severity).toBe('warning');
    });

    it('keeps credentials out of the row drawn on the canvas', () => {
        const node: WorkflowNode = {
            id: 'm', type: 'memory', parent: 'triage',
            memory: {
                provider: 'postgres',
                postgres: { uri: 'postgresql://agent:hunter2@db.internal/agent_memory' },
            },
        };
        expect(NodeHtml.subtitle(node)).toBe('postgres · postgresql://db.internal/agent_memory');
        expect(NodeHtml.subtitle(node)).not.toContain('hunter2');
    });

    it('flags a second memory store on the same agent', () => {
        const expanded = WorkflowSerializer.expand(memoryDefinition());
        expanded.nodes.extra = { id: 'extra', type: 'memory', parent: 'triage', memory: { provider: 'postgres' } };

        const issues = WorkflowSerializer.validate(expanded);
        expect(issues.some((issue) => /may only have one/.test(issue.message))).toBe(true);
    });

    it('flags a store attached to a node that cannot hold one', () => {
        const definition: WorkflowDefinition = {
            name: 'Bad',
            nodes: {
                check: { id: 'check', type: 'gate', condition: 'x' },
                stray: { id: 'stray', type: 'memory', parent: 'check', memory: { provider: 'postgres' } },
            },
        };
        const issues = WorkflowSerializer.validate(definition);
        expect(issues.some((issue) => /only sit under an agent node/.test(issue.message))).toBe(true);
    });
});
