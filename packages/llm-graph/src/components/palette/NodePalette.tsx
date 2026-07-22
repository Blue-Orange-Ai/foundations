import React, { useState } from 'react';
import { WorkflowNodeType } from '../../interfaces/WorkflowGraph';
import { NODE_CATALOG_LIST, NODE_CATEGORIES } from '../../interfaces/NodeCatalog';
import './NodePalette.css';

interface Props {
    onSelect: (type: WorkflowNodeType) => void;
    onClose: () => void;
}

/**
 * The add-node menu: a searchable, categorised list of node kinds (from the
 * {@link NODE_CATALOG_LIST}) presented as an overlay. Picking a kind places a
 * fresh node of that type on the canvas.
 */
export const NodePalette: React.FC<Props> = ({ onSelect, onClose }) => {

    const [query, setQuery] = useState<string>('');

    const term = query.trim().toLowerCase();
    const matches = (label: string, description: string) =>
        term === '' || label.toLowerCase().indexOf(term) !== -1 || description.toLowerCase().indexOf(term) !== -1;

    return (
        <div className="bo-llm-graph-palette-backdrop" onClick={onClose}>
            <div className="bo-llm-graph-palette" onClick={(event) => event.stopPropagation()}>
                <div className="bo-llm-graph-palette-header">
                    <i className="ri-search-line"></i>
                    <input
                        className="bo-llm-graph-palette-search"
                        placeholder="Search nodes…"
                        autoFocus={true}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <i className="ri-close-line bo-llm-graph-palette-close" onClick={onClose}></i>
                </div>
                <div className="bo-llm-graph-palette-body">
                    {NODE_CATEGORIES.map((category) => {
                        const entries = NODE_CATALOG_LIST.filter(
                            (entry) => entry.category === category.id && matches(entry.label, entry.description));
                        if (entries.length === 0) return null;
                        return (
                            <div className="bo-llm-graph-palette-group" key={category.id}>
                                <div className="bo-llm-graph-palette-group-label">{category.label}</div>
                                {entries.map((entry) => (
                                    <div
                                        className="bo-llm-graph-palette-item"
                                        key={entry.type}
                                        onClick={() => onSelect(entry.type)}
                                    >
                                        <div
                                            className="bo-llm-graph-palette-item-icon"
                                            style={{ backgroundColor: entry.color }}
                                        >
                                            <i className={entry.icon}></i>
                                        </div>
                                        <div className="bo-llm-graph-palette-item-text">
                                            <div className="bo-llm-graph-palette-item-label">{entry.label}</div>
                                            <div className="bo-llm-graph-palette-item-desc">{entry.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
