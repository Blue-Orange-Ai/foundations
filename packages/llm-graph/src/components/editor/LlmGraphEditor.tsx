import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BlueOrangeGraphWrapper } from '@blue-orange-ai/foundations-graph';
import {
    BlueOrangeGraph,
    Edge as GraphEdge,
    Node as GraphNode,
} from '@blue-orange-ai/primitives-graph';
import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css';

import {
    NodeRunStatus,
    WorkflowDefinition,
    WorkflowNode,
    WorkflowNodeType,
    WorkflowRunState,
    WorkflowValidationIssue,
} from '../../interfaces/WorkflowGraph';
import { canHostMemory, canHostTools, isNestedNode } from '../../interfaces/NodeCatalog';
import { NodeFactory } from '../../services/NodeFactory';
import { ADD_MEMORY_ACTION, ADD_TOOL_ACTION, NodeHtml, ROW_NODE_ATTRIBUTE } from '../../services/NodeHtml';
import { GraphOptionsBuilder } from '../../services/GraphOptionsBuilder';
import { GraphPainter } from '../../services/GraphPainter';
import { WorkflowSerializer } from '../../services/WorkflowSerializer';
import { LayoutDirection, WorkflowLayout } from '../../services/WorkflowLayout';
import { useLlmGraphConfig } from '../providers/LlmGraphProvider';
import { EditorToolbar } from '../toolbar/EditorToolbar';
import { NodePalette } from '../palette/NodePalette';
import { NodeConfigPanel } from '../config/NodeConfigPanel';
import '../theme/llm-graph-theme.css';
import './LlmGraphEditor.css';

export interface LlmGraphEditorProps {
    /** The workflow to edit (used to seed the canvas on mount). */
    initialDefinition?: WorkflowDefinition;
    /** Notified after every edit with the up-to-date definition. */
    onChange?: (definition: WorkflowDefinition) => void;
    /** Persist the definition (overrides the provider's `onSave`). */
    onSave?: (definition: WorkflowDefinition) => void | Promise<void>;
    /** Run the workflow (overrides the provider's `onRun`). */
    onRun?: (definition: WorkflowDefinition) => void | Promise<void>;
    /** Custom export handler; defaults to downloading the definition JSON. */
    onExport?: (definition: WorkflowDefinition) => void;
    /** Live run state used to overlay per-node execution status. */
    runState?: WorkflowRunState;
    /** Which way the flow reads. Defaults to top-to-bottom. */
    direction?: LayoutDirection;
    /** Starting width of the configuration pane, in pixels. */
    configPanelWidth?: number;
}

/** Bounds the configuration pane can be dragged between. */
const MIN_PANEL_WIDTH = 320;
const MIN_CANVAS_WIDTH = 280;

/** Compute a node's run status from the agent's live run state. */
function statusFor(nodeId: string, runState?: WorkflowRunState): NodeRunStatus {
    if (!runState) return 'idle';
    if (runState.node_status && runState.node_status[nodeId]) return runState.node_status[nodeId];
    if ((runState.completed_nodes || []).indexOf(nodeId) !== -1) return 'succeeded';
    if (runState.current_node === nodeId) {
        return runState.status === 'FAILED' ? 'failed' : 'running';
    }
    return 'pending';
}

/** The `(x, y)` a node's card currently sits at, per the definition. */
function positionOf(node?: WorkflowNode): { x: number; y: number } {
    const ui = (node && node.metadata && node.metadata.ui) || {};
    return { x: typeof ui.x === 'number' ? ui.x : 0, y: typeof ui.y === 'number' ? ui.y : 0 };
}

/**
 * The node-based workflow editor. Wraps the foundations graph canvas and keeps a
 * {@link WorkflowDefinition} in sync with it: the canvas owns the topology
 * (nodes and `depends_on` links), while node config is authored in the
 * right-hand pane. A graph drawn here serialises directly to a definition the
 * llm-agent runs.
 *
 * Three rules shape the canvas:
 *
 *  - The flow reads **top-to-bottom** by default, and auto-layout arranges
 *    blocks down the canvas rather than across it.
 *  - Tools are drawn **inside** the box of the agent that owns them, as are any
 *    tools scoped to those tools. The box is the graph node, so links attach to
 *    the box, dragging it carries the whole tree with it, and a tool can never
 *    be pulled out of it.
 *  - A **single click selects** a node; only a **double click** opens its
 *    configuration, which appears as a split pane beside the canvas rather than
 *    as an overlay drawer, so the graph stays visible while it is edited.
 */
export const LlmGraphEditor: React.FC<LlmGraphEditorProps> = ({
    initialDefinition, onChange, onSave, onRun, onExport, runState,
    direction = 'vertical', configPanelWidth = 420,
}) => {
    const config = useLlmGraphConfig();
    const [definition, setDefinitionState] = useState<WorkflowDefinition>(
        () => WorkflowSerializer.expand(initialDefinition || NodeFactory.emptyDefinition()));
    const [focusNodeId, setFocusNodeId] = useState<string | undefined>(undefined);
    const [paletteOpen, setPaletteOpen] = useState<boolean>(false);
    const [issues, setIssues] = useState<Array<WorkflowValidationIssue>>([]);
    const [showIssues, setShowIssues] = useState<boolean>(false);
    const [running, setRunning] = useState<boolean>(false);
    const [panelWidth, setPanelWidth] = useState<number>(configPanelWidth);

    const splitRef = useRef<HTMLDivElement | null>(null);
    const resizing = useRef<boolean>(false);
    const graphInstance = useRef<BlueOrangeGraph | undefined>(undefined);
    // Graph event handlers are registered once at mount and close over stale
    // state, so they read/write the definition through this ref (never the
    // `definition` binding directly).
    const definitionRef = useRef<WorkflowDefinition>(definition);
    // Read by `paintNode`, which is registered once and must know which tool
    // row currently reads as selected.
    const focusIdRef = useRef<string | undefined>(undefined);
    focusIdRef.current = focusNodeId;
    const directionRef = useRef<LayoutDirection>(direction);
    directionRef.current = direction;

    /** Publish a definition the caller has already built. */
    const commit = useCallback((next: WorkflowDefinition) => {
        definitionRef.current = next;
        setDefinitionState(next);
        if (onChange) onChange(next);
    }, [onChange]);

    /** Publish a definition derived from the latest committed one. */
    const update = useCallback((updater: (prev: WorkflowDefinition) => WorkflowDefinition) => {
        commit(updater(definitionRef.current));
    }, [commit]);

    // -- Node cards --------------------------------------------------------
    /**
     * Re-render one box. Its height follows the tools it now holds, so this is
     * also what grows and shrinks a box as tools come and go.
     */
    const paintNode = useCallback((nodeId: string, status?: NodeRunStatus) => {
        const graph = graphInstance.current;
        const node = definitionRef.current.nodes[nodeId];
        if (!graph || !node || isNestedNode(node.type)) return;
        // The card has to be in the graph's model *and* on the page: the graph
        // reaches for the element by id and would throw on a missing one.
        if (!(graph as any).getNodeById(nodeId) || !document.getElementById(nodeId)) return;
        const rows = WorkflowLayout.boxRows(definitionRef.current, nodeId);
        try {
            graph.updateNode(
                nodeId, '1px solid #e0e1e2', '2px solid dodgerblue', 10, 'white',
                NodeHtml.width(node), NodeHtml.height(node, rows.length),
                NodeHtml.build(node, { status, rows, selectedRowId: focusIdRef.current }), true, true);
        } catch (error) {
            // Repainting a card is presentation only. It must never take down
            // the edit that asked for it — least of all opening the pane.
        }
    }, []);

    // -- Layout ------------------------------------------------------------
    const applyLayout = useCallback((layoutDirection: LayoutDirection, centre: boolean = true) => {
        const graph = graphInstance.current as any;
        if (!graph) return;
        const result = WorkflowLayout.compute(definitionRef.current, layoutDirection);
        // A node the definition knows about but the canvas hasn't mounted yet
        // has no index to arrange, so it is left out of this pass.
        const positions = result.positions.filter((position) => !!graph.getNodeById(position.id));
        if (positions.length === 0) return;
        graph.processArrangeLoc(positions);
        commit(WorkflowLayout.applyPositions(definitionRef.current, positions));
        if (centre) {
            try { graph.centre(); } catch (error) { /* empty canvas */ }
        }
    }, [commit]);

    // -- Graph lifecycle ---------------------------------------------------
    const graphOptions = useRef<any>(GraphOptionsBuilder.build({
        onAddNode: () => setPaletteOpen(true),
        onAutoLayout: (layoutDirection: LayoutDirection) => applyLayout(layoutDirection),
    }));

    const handleInstance = useCallback((graph: BlueOrangeGraph) => {
        graphInstance.current = graph;
        // Draw the links between the mounted boxes.
        WorkflowSerializer.logicalEdges(definitionRef.current).forEach((edge) => {
            GraphPainter.drawFlowEdge(graph, edge.source, edge.target, directionRef.current, edge.label);
        });
        // A definition arriving without positions is laid out for the author;
        // one that already has them is left exactly as it was saved.
        if (WorkflowLayout.needsLayout(definitionRef.current)) {
            applyLayout(directionRef.current);
        } else {
            try { graph.centre(); } catch (error) { /* empty canvas */ }
        }
    }, [applyLayout]);

    // -- Canvas → model reconciliation ------------------------------------
    const handleChange = useCallback((nodes: Array<GraphNode>, edges: Array<GraphEdge>) => {
        commit(WorkflowSerializer.reconcile(definitionRef.current, nodes as any, edges as any));
    }, [commit]);

    const handleNodeCreated = useCallback((
        _x: number, _y: number,
        _startingNode: GraphNode, createdNode: GraphNode,
    ) => {
        // Give the drag-created node a proper card and open its config.
        const current = definitionRef.current;
        const node = current.nodes[createdNode.id]
            || NodeFactory.create('task', current, createdNode.x, createdNode.y, createdNode.id);
        commit({ ...current, nodes: { ...current.nodes, [node.id]: node } });
        paintNode(node.id);
        setFocusNodeId(createdNode.id);
    }, [commit, paintNode]);

    // -- Tools -------------------------------------------------------------
    /**
     * Attach a fresh tool to `parentId` — an agent, or another tool, in which
     * case the new tool is scoped so only that tool can call it. Either way the
     * tool is a row rather than a canvas node, so all this takes is repainting
     * the box at the root of the chain, which grows to make room for the row.
     */
    const addTool = useCallback((parentId: string) => {
        const current = definitionRef.current;
        const parent = current.nodes[parentId];
        // A registry reference names a tool defined elsewhere, so there is
        // nothing here to scope a child to.
        if (!parent || !canHostTools(parent.type) || parent.tool_ref) return;

        const tool = NodeFactory.createTool(parentId, current);
        const next = { ...current, nodes: { ...current.nodes, [tool.id]: tool } };
        commit(next);
        // Focus is moved before the box is repainted, so the pane opens on the
        // new tool whatever happens while redrawing the card.
        focusIdRef.current = tool.id;
        setFocusNodeId(tool.id);
        const boxId = WorkflowLayout.boxIdOf(next, parentId);
        if (boxId) paintNode(boxId);
    }, [commit, paintNode]);

    // -- Memory ------------------------------------------------------------
    /**
     * Give `parentId` a memory store. Like a tool it is a row rather than a
     * canvas node, and an agent has at most one, so attaching to an agent that
     * already has memory just selects the memory it has.
     */
    const addMemory = useCallback((parentId: string) => {
        const current = definitionRef.current;
        const parent = current.nodes[parentId];
        if (!parent || !canHostMemory(parent.type)) return;

        const existing = WorkflowLayout.memoryOf(current, parentId);
        if (existing) { setFocusNodeId(existing.id); return; }

        const memory = NodeFactory.createMemory(parentId, current);
        commit({ ...current, nodes: { ...current.nodes, [memory.id]: memory } });
        // Focus is moved before the box is repainted, so the pane opens on the
        // new store whatever happens while redrawing the card.
        focusIdRef.current = memory.id;
        setFocusNodeId(memory.id);
        paintNode(parentId);
    }, [commit, paintNode]);

    // -- Palette: place a fresh node --------------------------------------
    const addNode = useCallback((type: WorkflowNodeType) => {
        setPaletteOpen(false);

        // The nested kinds attach to the selected node rather than landing on
        // the canvas of their own.
        if (type === 'tool' || type === 'memory') {
            const parentId = focusNodeId;
            const parent = parentId ? definitionRef.current.nodes[parentId] : undefined;
            if (!parentId || !parent) return;
            if (type === 'tool' && canHostTools(parent.type)) addTool(parentId);
            if (type === 'memory' && canHostMemory(parent.type)) addMemory(parentId);
            return;
        }

        const graph = graphInstance.current;
        const current = definitionRef.current;
        // Stack new nodes down the canvas, matching the default vertical flow.
        const count = WorkflowSerializer.topLevelIds(current).length;
        const x = 120;
        const y = 120 + count * (NodeHtml.height({ id: '', type }, 0) + 140);
        const node = NodeFactory.create(type, current, x, y);
        commit({ ...current, nodes: { ...current.nodes, [node.id]: node } });
        if (graph) {
            graph.createNode(
                node.id, x, y, '1px solid #e0e1e2', '2px solid dodgerblue', 10, 'white',
                NodeHtml.width(node), NodeHtml.height(node, 0), NodeHtml.build(node), true, true, true);
        }
        setFocusNodeId(node.id);
    }, [addMemory, addTool, commit, focusNodeId]);

    // -- Canvas interaction ------------------------------------------------
    /**
     * A single click selects only — it must never open the configuration pane.
     * The only things it acts on are the buttons drawn inside a box, which
     * attach a tool or a memory store to the node they name.
     */
    const handleNodeClicked = useCallback((node: GraphNode, clickEvent: any) => {
        const target = clickEvent && clickEvent.target;
        if (!target || !target.closest) return;
        const action = target.closest('[data-bo-action]');
        if (!action) return;
        if (clickEvent.stopPropagation) clickEvent.stopPropagation();
        const ownerId = action.getAttribute('data-bo-node') || node.id;
        const kind = action.getAttribute('data-bo-action');
        if (kind === ADD_TOOL_ACTION) addTool(ownerId);
        if (kind === ADD_MEMORY_ACTION) addMemory(ownerId);
    }, [addMemory, addTool]);

    /**
     * A double click is what opens the configuration pane — on the row it landed
     * on, if any, otherwise on the box itself.
     */
    const handleNodeDblClick = useCallback((node: GraphNode, clickEvent: any) => {
        const target = clickEvent && clickEvent.target;
        const row = target && target.closest ? target.closest(`[${ROW_NODE_ATTRIBUTE}]`) : null;
        const rowId = row ? row.getAttribute(ROW_NODE_ATTRIBUTE) : null;
        const nextId = rowId && definitionRef.current.nodes[rowId] ? rowId : node.id;
        setFocusNodeId(nextId);
    }, []);

    // Selecting a tool highlights its row, and that row lives inside a box, so
    // a selection change repaints the box it left and the box it landed on.
    const paintedFocus = useRef<string | undefined>(undefined);
    useEffect(() => {
        const boxOf = (id?: string) => WorkflowLayout.boxIdOf(definitionRef.current, id);
        const before = boxOf(paintedFocus.current);
        const after = boxOf(focusNodeId);
        paintedFocus.current = focusNodeId;
        if (before && before !== after) paintNode(before);
        if (after) paintNode(after);
    }, [focusNodeId, paintNode]);

    // -- Config pane: node config change ----------------------------------
    const handleNodeConfigChange = useCallback((node: WorkflowNode) => {
        const current = definitionRef.current;
        commit({ ...current, nodes: { ...current.nodes, [node.id]: node } });
        // Editing a tool changes a row inside a box, so it is the box at the
        // root of its chain that gets repainted either way.
        const boxId = WorkflowLayout.boxIdOf(definitionRef.current, node.id);
        if (boxId) paintNode(boxId);
    }, [commit, paintNode]);

    const handleDeleteNode = useCallback((node: WorkflowNode) => {
        const graph = graphInstance.current as any;
        const current = definitionRef.current;
        // Deleting anything takes everything nested inside it: an agent's memory
        // and tools go with the agent, and a tool's scoped tools go with the
        // tool, since they exist only to be called by it.
        const removed = [node.id].concat(WorkflowLayout.boxChildIds(current, node.id));
        const boxId = WorkflowLayout.boxIdOf(current, node.id);

        if (graph && node.type !== 'tool') {
            const graphNode = graph.getNodeById(node.id);
            if (graphNode) graph.deleteNode(graphNode);
        }

        const nodes = { ...current.nodes };
        removed.forEach((id) => { delete nodes[id]; });
        // Drop dangling dependencies on the removed node.
        Object.keys(nodes).forEach((id) => {
            const other = nodes[id];
            if (other.depends_on && other.depends_on.some((dep) => removed.indexOf(dep) !== -1)) {
                nodes[id] = { ...other, depends_on: other.depends_on.filter((dep) => removed.indexOf(dep) === -1) };
            }
        });

        // Removing a row leaves the pane on its owner; removing a box closes it.
        const ownerId = isNestedNode(node.type) ? node.parent : undefined;
        const nextFocus = removed.indexOf(focusIdRef.current || '') !== -1 ? ownerId : focusIdRef.current;

        commit({ ...current, nodes });
        focusIdRef.current = nextFocus;
        // The box shrinks back by however many rows went with it.
        if (isNestedNode(node.type) && boxId && nodes[boxId]) paintNode(boxId);
        setFocusNodeId(nextFocus);
    }, [commit, paintNode]);

    // -- Configuration pane resizing --------------------------------------
    useEffect(() => {
        const onMove = (event: MouseEvent) => {
            if (!resizing.current || !splitRef.current) return;
            const bounds = splitRef.current.getBoundingClientRect();
            const width = bounds.right - event.clientX;
            const maximum = Math.max(MIN_PANEL_WIDTH, bounds.width - MIN_CANVAS_WIDTH);
            setPanelWidth(Math.max(MIN_PANEL_WIDTH, Math.min(maximum, width)));
            event.preventDefault();
        };
        const onUp = () => {
            if (!resizing.current) return;
            resizing.current = false;
            document.body.classList.remove('bo-llm-graph-resizing');
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, []);

    const startResize = useCallback(() => {
        resizing.current = true;
        document.body.classList.add('bo-llm-graph-resizing');
    }, []);

    // -- Toolbar actions ---------------------------------------------------
    const validate = useCallback(() => {
        const found = WorkflowSerializer.validate(definitionRef.current);
        setIssues(found);
        setShowIssues(true);
        return found;
    }, []);

    const exportDefinition = useCallback(() => {
        const current = WorkflowSerializer.serialize(definitionRef.current);
        if (onExport) { onExport(current); return; }
        const blob = new Blob([JSON.stringify(current, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${(current.name || 'workflow').replace(/\s+/g, '-').toLowerCase()}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    }, [onExport]);

    const saveHandler = onSave || config.onSave;
    const runHandler = onRun || config.onRun;

    const save = useCallback(() => {
        if (saveHandler) saveHandler(WorkflowSerializer.serialize(definitionRef.current));
    }, [saveHandler]);

    const run = useCallback(async () => {
        if (!runHandler) return;
        const found = WorkflowSerializer.validate(definitionRef.current);
        const errors = found.filter((issue) => issue.severity === 'error');
        if (errors.length > 0) { setIssues(found); setShowIssues(true); return; }
        setRunning(true);
        try {
            await runHandler(WorkflowSerializer.serialize(definitionRef.current));
        } finally {
            setRunning(false);
        }
    }, [runHandler]);

    // -- Live run status overlay ------------------------------------------
    useEffect(() => {
        if (!graphInstance.current || !runState) return;
        WorkflowSerializer.topLevelIds(definitionRef.current).forEach((id) => {
            paintNode(id, statusFor(id, runState));
        });
    }, [paintNode, runState]);

    // The pane follows the focused node. Should that node ever go missing from
    // the definition, it falls back to the box the node lived in rather than
    // closing itself out from under the author mid-edit.
    const focusFallbackId = focusNodeId && !definition.nodes[focusNodeId]
        ? WorkflowLayout.boxIdOf(definition, focusNodeId)
        : focusNodeId;
    const focusNode = focusFallbackId ? definition.nodes[focusFallbackId] : undefined;
    const errorCount = issues.filter((issue) => issue.severity === 'error').length;
    const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
    const nestParent = focusNode
        && (canHostTools(focusNode.type) || canHostMemory(focusNode.type))
        && !focusNode.tool_ref
        ? focusNode : undefined;

    return (
        <div className="bo-llm-graph-editor">
            <EditorToolbar
                name={definition.name}
                onNameChange={(name) => update((prev) => ({ ...prev, name }))}
                nodeCount={WorkflowSerializer.topLevelIds(definition).length}
                errorCount={errorCount}
                warningCount={warningCount}
                running={running}
                onAddNode={() => setPaletteOpen(true)}
                onAutoLayout={() => applyLayout(direction)}
                onValidate={validate}
                onExport={exportDefinition}
                onSave={saveHandler ? save : undefined}
                onRun={runHandler ? run : undefined}
            ></EditorToolbar>

            {/*
              * The canvas and the configuration pane are siblings in a split
              * row, so opening the pane narrows the canvas instead of covering
              * it — and the graph instance is never unmounted by the pane
              * coming and going.
              */}
            <div className="bo-llm-graph-split" ref={splitRef}>
                <div className="bo-llm-graph-canvas">
                    <BlueOrangeGraphWrapper
                        nodes={WorkflowSerializer.toGraphNodes(definition)}
                        options={graphOptions.current}
                        instance={handleInstance}
                        onChange={handleChange}
                        nodeCreated={handleNodeCreated}
                        nodeClicked={handleNodeClicked}
                        nodeDblClick={handleNodeDblClick}
                    ></BlueOrangeGraphWrapper>

                    {paletteOpen &&
                        <NodePalette
                            onSelect={addNode}
                            allowNested={!!nestParent}
                            parentLabel={nestParent ? NodeHtml.title(nestParent) : undefined}
                            onClose={() => setPaletteOpen(false)}
                        ></NodePalette>}

                    {showIssues &&
                        <div className="bo-llm-graph-issues">
                            <div className="bo-llm-graph-issues-header">
                                <span>{issues.length === 0 ? 'No issues found' : `${issues.length} issue${issues.length === 1 ? '' : 's'}`}</span>
                                <i className="ri-close-line" onClick={() => setShowIssues(false)}></i>
                            </div>
                            {issues.map((issue, index) => (
                                <div className={`bo-llm-graph-issue bo-llm-graph-issue-${issue.severity}`} key={index}>
                                    <i className={issue.severity === 'error' ? 'ri-error-warning-line' : 'ri-alert-line'}></i>
                                    <span>{issue.nodeId ? `[${issue.nodeId}] ` : ''}{issue.message}</span>
                                </div>
                            ))}
                            {issues.length === 0 &&
                                <div className="bo-llm-graph-issue bo-llm-graph-issue-ok">
                                    <i className="ri-checkbox-circle-line"></i><span>This workflow is valid.</span>
                                </div>}
                        </div>}
                </div>

                {focusNode &&
                    <div className="bo-llm-graph-split-handle" onMouseDown={startResize}></div>}

                {focusNode &&
                    <div className="bo-llm-graph-split-pane" style={{ width: `${panelWidth}px` }}>
                        <NodeConfigPanel
                            key={focusNode.id}
                            node={focusNode}
                            definition={definition}
                            onChange={handleNodeConfigChange}
                            onClose={() => setFocusNodeId(undefined)}
                            onDelete={handleDeleteNode}
                            onAddTool={addTool}
                            onAddMemory={addMemory}
                            onSelectNode={setFocusNodeId}
                        ></NodeConfigPanel>
                    </div>}
            </div>
        </div>
    );
};
