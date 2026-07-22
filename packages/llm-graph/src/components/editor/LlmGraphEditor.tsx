import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BlueOrangeGraphWrapper, GraphRelativePos } from '@blue-orange-ai/foundations-graph';
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
import { NodeFactory } from '../../services/NodeFactory';
import { NodeHtml } from '../../services/NodeHtml';
import { GraphOptionsBuilder } from '../../services/GraphOptionsBuilder';
import { WorkflowSerializer } from '../../services/WorkflowSerializer';
import { useLlmGraphConfig } from '../providers/LlmGraphProvider';
import { EditorToolbar } from '../toolbar/EditorToolbar';
import { NodePalette } from '../palette/NodePalette';
import { NodeConfigDrawer } from '../config/NodeConfigDrawer';
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
}

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

/**
 * The node-based workflow editor. Wraps the foundations graph canvas and keeps a
 * {@link WorkflowDefinition} in sync with it: the canvas owns the topology
 * (nodes and `depends_on` links), while node config is authored in the drawer.
 * A graph drawn here serialises directly to a definition the llm-agent runs.
 */
export const LlmGraphEditor: React.FC<LlmGraphEditorProps> = ({
    initialDefinition, onChange, onSave, onRun, onExport, runState,
}) => {
    const config = useLlmGraphConfig();
    const [definition, setDefinitionState] = useState<WorkflowDefinition>(
        () => initialDefinition || NodeFactory.emptyDefinition());
    const [focusNodeId, setFocusNodeId] = useState<string | undefined>(undefined);
    const [paletteOpen, setPaletteOpen] = useState<boolean>(false);
    const [issues, setIssues] = useState<Array<WorkflowValidationIssue>>([]);
    const [showIssues, setShowIssues] = useState<boolean>(false);
    const [running, setRunning] = useState<boolean>(false);

    const graphInstance = useRef<BlueOrangeGraph | undefined>(undefined);
    // Graph event handlers are registered once at mount and close over stale
    // state, so they read/write the definition through this ref + functional
    // setState (never the `definition` binding directly).
    const definitionRef = useRef<WorkflowDefinition>(definition);

    const setDefinition = useCallback((updater: (prev: WorkflowDefinition) => WorkflowDefinition) => {
        setDefinitionState((prev) => {
            const next = updater(prev);
            definitionRef.current = next;
            if (onChange) onChange(next);
            return next;
        });
    }, [onChange]);

    const graphOptions = useRef<any>(GraphOptionsBuilder.build({ onAddNode: () => setPaletteOpen(true) }));

    // -- Graph lifecycle ---------------------------------------------------
    const handleInstance = useCallback((graph: BlueOrangeGraph) => {
        graphInstance.current = graph;
        // Draw the initial dependency links between the mounted nodes.
        WorkflowSerializer.logicalEdges(definitionRef.current).forEach((edge) => {
            try {
                const source = (graph as any).getNodeById(edge.source);
                const target = (graph as any).getNodeById(edge.target);
                if (source && target) {
                    (graph as any).createEdgeSimple(source, target, 'bezier', undefined, '', '#b9c0d4', false);
                }
            } catch (error) {
                // A missing endpoint just means no link is drawn.
            }
        });
        try { graph.centre(); } catch (error) { /* empty canvas */ }
    }, []);

    // -- Canvas → model reconciliation ------------------------------------
    const handleChange = useCallback((nodes: Array<GraphNode>, edges: Array<GraphEdge>) => {
        setDefinition((prev) => WorkflowSerializer.reconcile(prev, nodes as any, edges as any));
    }, [setDefinition]);

    const handleNodeCreated = useCallback((
        _x: number, _y: number,
        _startingNode: GraphNode, createdNode: GraphNode,
    ) => {
        // Give the drag-created node a proper card and open its config.
        setDefinition((prev) => {
            const node = prev.nodes[createdNode.id]
                || NodeFactory.create('task', prev, createdNode.x, createdNode.y, createdNode.id);
            const graph = graphInstance.current;
            if (graph) {
                graph.updateNode(
                    node.id, createdNode.border, createdNode.borderSelected, createdNode.borderRadius,
                    createdNode.backgroundColour, createdNode.width, createdNode.height,
                    NodeHtml.build(node), createdNode.movable, createdNode.deletable);
            }
            return { ...prev, nodes: { ...prev.nodes, [node.id]: node } };
        });
        setFocusNodeId(createdNode.id);
    }, [setDefinition]);

    const openNodeConfig = useCallback((node: GraphNode) => {
        setFocusNodeId(node.id);
    }, []);

    // -- Palette: place a fresh node --------------------------------------
    const addNode = useCallback((type: WorkflowNodeType) => {
        setPaletteOpen(false);
        const graph = graphInstance.current;
        const count = Object.keys(definitionRef.current.nodes).length;
        const x = 120 + (count % 5) * 60;
        const y = 120 + (count % 5) * 60;
        const node = NodeFactory.create(type, definitionRef.current, x, y);
        setDefinition((prev) => ({ ...prev, nodes: { ...prev.nodes, [node.id]: node } }));
        if (graph) {
            graph.createNode(
                node.id, x, y, '1px solid #e0e1e2', '2px solid dodgerblue', 10, 'white',
                300, 92, NodeHtml.build(node), true, true, true);
        }
        setFocusNodeId(node.id);
    }, [setDefinition]);

    // -- Drawer: node config change ---------------------------------------
    const handleNodeConfigChange = useCallback((node: WorkflowNode) => {
        setDefinition((prev) => ({ ...prev, nodes: { ...prev.nodes, [node.id]: node } }));
        const graph = graphInstance.current;
        if (graph) {
            graph.updateNode(
                node.id, '1px solid #e0e1e2', '2px solid dodgerblue', 10, 'white',
                300, 92, NodeHtml.build(node), true, true);
        }
    }, [setDefinition]);

    const handleDeleteNode = useCallback((node: WorkflowNode) => {
        const graph = graphInstance.current;
        if (graph) {
            const graphNode = (graph as any).getNodeById(node.id);
            if (graphNode) graph.deleteNode(graphNode);
        }
        setDefinition((prev) => {
            const nodes = { ...prev.nodes };
            delete nodes[node.id];
            // Drop dangling dependencies on the removed node.
            Object.keys(nodes).forEach((id) => {
                const other = nodes[id];
                if (other.depends_on && other.depends_on.indexOf(node.id) !== -1) {
                    nodes[id] = { ...other, depends_on: other.depends_on.filter((dep) => dep !== node.id) };
                }
            });
            return { ...prev, nodes };
        });
        setFocusNodeId(undefined);
    }, [setDefinition]);

    // -- Toolbar actions ---------------------------------------------------
    const validate = useCallback(() => {
        const found = WorkflowSerializer.validate(definitionRef.current);
        setIssues(found);
        setShowIssues(true);
        return found;
    }, []);

    const autoLayout = useCallback(() => {
        const graph = graphInstance.current as any;
        if (!graph) return;
        graph.arrange('elk', 'layered', 'down', 120);
        graph.centre();
    }, []);

    const exportDefinition = useCallback(() => {
        const current = WorkflowSerializer.serialize(definitionRef.current);
        if (onExport) { onExport(current); return; }
        const blob = new Blob([WorkflowSerializer.toJson(current)], { type: 'application/json' });
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
        const graph = graphInstance.current;
        if (!graph || !runState) return;
        Object.keys(definitionRef.current.nodes).forEach((id) => {
            const node = definitionRef.current.nodes[id];
            graph.updateNode(
                id, '1px solid #e0e1e2', '2px solid dodgerblue', 10, 'white',
                300, 92, NodeHtml.build(node, statusFor(id, runState)), true, true);
        });
    }, [runState]);

    const focusNode = focusNodeId ? definition.nodes[focusNodeId] : undefined;
    const errorCount = issues.filter((issue) => issue.severity === 'error').length;
    const warningCount = issues.filter((issue) => issue.severity === 'warning').length;

    return (
        <div className="bo-llm-graph-editor">
            <EditorToolbar
                name={definition.name}
                onNameChange={(name) => setDefinition((prev) => ({ ...prev, name }))}
                nodeCount={Object.keys(definition.nodes).length}
                errorCount={errorCount}
                warningCount={warningCount}
                running={running}
                onAddNode={() => setPaletteOpen(true)}
                onAutoLayout={autoLayout}
                onValidate={validate}
                onExport={exportDefinition}
                onSave={saveHandler ? save : undefined}
                onRun={runHandler ? run : undefined}
            ></EditorToolbar>

            <div className="bo-llm-graph-canvas">
                <BlueOrangeGraphWrapper
                    nodes={WorkflowSerializer.toGraphNodes(definition)}
                    options={graphOptions.current}
                    instance={handleInstance}
                    onChange={handleChange}
                    nodeCreated={handleNodeCreated}
                    nodeClicked={(node: GraphNode) => openNodeConfig(node)}
                    nodeRightClick={(node: GraphNode) => openNodeConfig(node)}
                ></BlueOrangeGraphWrapper>

                {paletteOpen &&
                    <NodePalette onSelect={addNode} onClose={() => setPaletteOpen(false)}></NodePalette>}

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
                <NodeConfigDrawer
                    node={focusNode}
                    definition={definition}
                    onChange={handleNodeConfigChange}
                    onClose={() => setFocusNodeId(undefined)}
                    onDelete={handleDeleteNode}
                ></NodeConfigDrawer>}
        </div>
    );
};
