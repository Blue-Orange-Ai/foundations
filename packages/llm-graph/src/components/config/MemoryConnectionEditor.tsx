import React from 'react';
import {
    Dropdown,
    DropdownItemText,
    Input,
    Toggle,
} from '@blue-orange-ai/foundations-core';
import { PostgresConnection, WorkflowMemory } from '../../interfaces/WorkflowGraph';
import './MemoryConnectionEditor.css';

interface Props {
    memory: WorkflowMemory;
    /** The node id the memories default to being scoped by. */
    defaultNamespace: string;
    onChange: (memory: WorkflowMemory) => void;
}

/** Providers offered for a memory store. Postgres is the one wired up today. */
const PROVIDERS: Array<{ value: string; label: string }> = [
    { value: 'postgres', label: 'PostgreSQL' },
];

/**
 * Edits a memory store: what the agent recalls and writes back, and the
 * connection to the database holding it.
 *
 * The connection can be given either as a single URI or as discrete fields.
 * Neither carries a password — a definition is saved and exported as plain
 * JSON, so the password is *named* here and resolved by the agent at run time.
 */
export const MemoryConnectionEditor: React.FC<Props> = ({ memory, defaultNamespace, onChange }) => {

    const connection: PostgresConnection = memory.postgres || {};

    const set = (patch: Partial<WorkflowMemory>) => onChange({ ...memory, ...patch });
    const setConnection = (patch: Partial<PostgresConnection>) =>
        onChange({ ...memory, postgres: { ...connection, ...patch } });

    const setPort = (value: string) => {
        const trimmed = value.trim();
        setConnection({ port: trimmed === '' ? undefined : Number(trimmed) });
    };

    const setRecall = (value: string) => {
        const trimmed = value.trim();
        set({ recall_limit: trimmed === '' ? undefined : Number(trimmed) });
    };

    // A URI carries the host, port, database and user, so the discrete fields
    // are hidden rather than shown as dead inputs alongside it.
    const usingUri = !!(connection.uri || '').trim();

    return (
        <div className="bo-llm-graph-memory-editor">
            <div className="bo-llm-graph-field">
                <div className="bo-llm-graph-field-label">Store</div>
                <Dropdown
                    placeholder={PROVIDERS.filter((p) => p.value === memory.provider).map((p) => p.label)[0] || 'PostgreSQL'}
                    contextWidth={'fit-content'}
                    onSelection={(item) => set({ provider: item.reference as WorkflowMemory['provider'] })}
                >
                    {PROVIDERS.map((provider) => (
                        <DropdownItemText
                            key={provider.value}
                            label={provider.label}
                            value={provider.value}
                            selected={memory.provider === provider.value}
                        ></DropdownItemText>
                    ))}
                </Dropdown>
            </div>

            <Input
                label={`Namespace (memories are scoped by this; defaults to '${defaultNamespace}')`}
                value={memory.namespace || ''}
                onChange={(value) => set({ namespace: value || undefined })}
            ></Input>
            <Input
                label={'Recall limit (how many prior memories to load)'}
                value={memory.recall_limit === undefined ? '' : String(memory.recall_limit)}
                isNumber={true}
                onChange={setRecall}
            ></Input>
            <div className="bo-llm-graph-field">
                <div className="bo-llm-graph-field-label">Write new memories back</div>
                <Toggle checked={memory.write !== false} onChange={(checked) => set({ write: checked })}></Toggle>
            </div>

            <div className="bo-llm-graph-memory-connection">
                <div className="bo-llm-graph-field-label">Connection</div>
                <Input
                    label={'Connection URI (e.g. postgresql://agent@db.internal:5432/memory)'}
                    value={connection.uri || ''}
                    onChange={(value) => setConnection({ uri: value || undefined })}
                ></Input>

                {!usingUri &&
                    <>
                        <Input label={'Host'} value={connection.host || ''} onChange={(value) => setConnection({ host: value || undefined })}></Input>
                        <Input label={'Port'} value={connection.port === undefined ? '' : String(connection.port)} isNumber={true} onChange={setPort}></Input>
                        <Input label={'Database'} value={connection.database || ''} onChange={(value) => setConnection({ database: value || undefined })}></Input>
                        <Input label={'User'} value={connection.user || ''} onChange={(value) => setConnection({ user: value || undefined })}></Input>
                    </>}

                <Input
                    label={'Password secret (the name of the secret, not the password)'}
                    value={connection.password_secret || ''}
                    onChange={(value) => setConnection({ password_secret: value || undefined })}
                ></Input>
                <div className="bo-llm-graph-memory-note">
                    <i className="ri-shield-keyhole-line"></i>
                    <span>
                        The workflow definition is saved and exported as plain JSON, so it holds
                        the name of the secret rather than the password itself.
                    </span>
                </div>

                <Input label={'Schema (defaults to public)'} value={connection.schema || ''} onChange={(value) => setConnection({ schema: value || undefined })}></Input>
                <Input label={'Table'} value={connection.table || ''} onChange={(value) => setConnection({ table: value || undefined })}></Input>
                <div className="bo-llm-graph-field">
                    <div className="bo-llm-graph-field-label">Require TLS</div>
                    <Toggle checked={!!connection.ssl} onChange={(checked) => setConnection({ ssl: checked })}></Toggle>
                </div>
            </div>
        </div>
    );
};
