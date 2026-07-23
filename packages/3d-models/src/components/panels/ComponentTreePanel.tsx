import React from 'react';
import { GeneralHeading, Toggle, ButtonIcon, ButtonSize } from '@blue-orange-ai/foundations-core';

import { ModelController } from '../../core/useModelController';
import { ComponentId, LayerId } from '../../core/types';
import { StatusDot } from './StatusDot';

import './ComponentTreePanel.css';

export interface ComponentTreePanelProps {
	controller: ModelController;
	/** Panel heading. */
	title?: string;
	style?: React.CSSProperties;
}

function layerLabel(layer: LayerId): string {
	return layer.charAt(0).toUpperCase() + layer.slice(1);
}

/**
 * Per-layer and per-component visibility controls with status indicator dots.
 * Toggling a *layer* resolves to its underlying components via the manifest, so
 * the UI stays semantic and the mapping lives in one place (the controller).
 */
export const ComponentTreePanel: React.FC<ComponentTreePanelProps> = ({
	controller,
	title = 'Components',
	style = {},
}) => {
	const { manifest, layers, statusMap, isHidden, isLayerHidden, toggleComponent, setLayerHidden, select, selected } =
		controller;

	return (
		<div className="foundations-3d-tree-panel" style={style}>
			<GeneralHeading style={{ marginTop: 0 }}>{title}</GeneralHeading>
			<div className="foundations-3d-tree-body">
				{Array.from(layers.entries()).map(([layer, ids]) => {
					const layerHidden = isLayerHidden(layer);
					return (
						<div className="foundations-3d-tree-layer" key={layer}>
							<div className="foundations-3d-tree-layer-header">
								<span className="foundations-3d-tree-layer-name">{layerLabel(layer)}</span>
								<Toggle
									checked={!layerHidden}
									update={new Date()}
									onChange={(visible) => setLayerHidden(layer, !visible)}
								/>
							</div>
							{ids.map((id: ComponentId) => {
								const hidden = isHidden(id);
								const status = statusMap.get(id) ?? 'ok';
								const isSelected = id === selected;
								return (
									<div
										key={id}
										className={
											'foundations-3d-tree-item' +
											(isSelected ? ' foundations-3d-tree-item-selected' : '')
										}
										onClick={() => select(id)}
									>
										<StatusDot status={status} />
										<span
											className={
												'foundations-3d-tree-item-label' +
												(hidden ? ' foundations-3d-tree-item-hidden' : '')
											}
										>
											{manifest[id].label}
										</span>
										<span onClick={(e) => e.stopPropagation()}>
											<ButtonIcon
												icon={hidden ? 'ri-eye-off-line' : 'ri-eye-line'}
												size={ButtonSize.SMALL}
												label={hidden ? 'Show' : 'Hide'}
												onClick={() => toggleComponent(id)}
											/>
										</span>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};
