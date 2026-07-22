import React, { createContext, useContext, useMemo } from 'react';
import { WorkflowDefinition, WorkflowTool } from '../../interfaces/WorkflowGraph';

/** A selectable provider/model pair offered in the node config forms. */
export interface ModelOption {
    provider: string;
    model: string;
    /** Optional display label (defaults to `provider · model`). */
    label?: string;
}

/** Editor-wide configuration supplied to the graph components. */
export interface LlmGraphConfig {
    /** Models offered in the agent-node config drawer. */
    models?: Array<ModelOption>;
    /** Registry tools that can be attached to a task/step by id. */
    tools?: Array<WorkflowTool>;
    /** Persist the definition (e.g. `POST /workflows`). */
    onSave?: (definition: WorkflowDefinition) => void | Promise<void>;
    /** Run the workflow (e.g. `POST /workflows/{id}/advance`). */
    onRun?: (definition: WorkflowDefinition) => void | Promise<void>;
}

const LlmGraphContext = createContext<LlmGraphConfig | null>(null);

export interface LlmGraphProviderProps extends LlmGraphConfig {
    children: React.ReactNode;
}

/**
 * Provides editor-wide configuration (available models, registry tools and the
 * save/run callbacks) to the graph components below it. Mirrors the
 * `LlmAgentProvider` pattern in `llm-client`.
 */
export const LlmGraphProvider: React.FC<LlmGraphProviderProps> = ({ children, models, tools, onSave, onRun }) => {
    const value = useMemo<LlmGraphConfig>(() => ({ models, tools, onSave, onRun }), [models, tools, onSave, onRun]);
    return <LlmGraphContext.Provider value={value}>{children}</LlmGraphContext.Provider>;
};

/** Read the editor config; returns an empty config when used without a provider. */
export function useLlmGraphConfig(): LlmGraphConfig {
    return useContext(LlmGraphContext) || {};
}

export function useModelOptions(): Array<ModelOption> {
    const config = useLlmGraphConfig();
    return config.models || [];
}
