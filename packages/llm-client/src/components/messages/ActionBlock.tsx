import React, { useState } from 'react';

import { DisplayActionType } from '../../interfaces/AgentProtocol';
import { ActionPart } from '../../interfaces/ChatInterfaces';
import './ActionBlock.css';

interface Props {
    part: ActionPart;
}

/** remixicon class per display-action type (matches the server's action taxonomy). */
const ACTION_ICON: Record<DisplayActionType, string> = {
    READ_FILE: 'ri-file-text-line',
    WRITE_FILE: 'ri-file-edit-line',
    GREP: 'ri-search-line',
    GLOB: 'ri-folder-search-line',
    WEB_SEARCH: 'ri-global-line',
    WEB_FETCH: 'ri-download-cloud-2-line',
    RUN_COMMAND: 'ri-terminal-box-line',
    DATABASE: 'ri-database-2-line',
    THINKING: 'ri-brain-line',
    CUSTOM: 'ri-tools-line',
};

const hasContent = (part: ActionPart): boolean =>
    Boolean((part.arguments && Object.keys(part.arguments).length) || part.detail);

/**
 * Renders a tool call / display action inline in the assistant message — icon,
 * title and a RUNNING → COMPLETE/ERROR status, expandable to show the call
 * arguments and returned result (the assistant-ui tool-call treatment).
 */
export const ActionBlock: React.FC<Props> = ({ part }) => {
    const [open, setOpen] = useState(false);
    const expandable = hasContent(part);
    const icon = ACTION_ICON[part.actionType] || ACTION_ICON.CUSTOM;

    const statusIcon =
        part.status === 'RUNNING'
            ? 'ri-loader-4-line blue-orange-llm-action-spin'
            : part.status === 'ERROR'
            ? 'ri-error-warning-line blue-orange-llm-action-error'
            : 'ri-check-line blue-orange-llm-action-done';

    return (
        <div className={`blue-orange-llm-action blue-orange-llm-action-${part.status.toLowerCase()}`}>
            <button
                type="button"
                className="blue-orange-llm-action-row"
                onClick={() => expandable && setOpen((o) => !o)}
                style={{ cursor: expandable ? 'pointer' : 'default' }}
            >
                <i className={`${icon} blue-orange-llm-action-icon`} />
                <span className="blue-orange-llm-action-title">{part.title}</span>
                <i className={statusIcon} />
                {expandable && (
                    <i
                        className={`ri-arrow-down-s-line blue-orange-llm-action-chevron${
                            open ? ' blue-orange-llm-action-chevron-open' : ''
                        }`}
                    />
                )}
            </button>
            {open && expandable && (
                <div className="blue-orange-llm-action-detail">
                    {part.arguments && Object.keys(part.arguments).length > 0 && (
                        <div className="blue-orange-llm-action-section">
                            <div className="blue-orange-llm-action-label">Arguments</div>
                            <pre className="blue-orange-llm-action-pre">
                                {JSON.stringify(part.arguments, null, 2)}
                            </pre>
                        </div>
                    )}
                    {part.detail && (
                        <div className="blue-orange-llm-action-section">
                            <div className="blue-orange-llm-action-label">
                                {part.status === 'ERROR' ? 'Error' : 'Result'}
                            </div>
                            <pre className="blue-orange-llm-action-pre">{part.detail}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
