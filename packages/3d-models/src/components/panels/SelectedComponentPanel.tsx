import React from 'react';
import { GeneralHeading, Badge, ButtonIcon, ButtonSize } from '@blue-orange-ai/foundations-core';

import { ModelController } from '../../core/useModelController';
import { STATUS_LABEL } from '../../core/manifest';
import { StatusDot } from './StatusDot';

import './SelectedComponentPanel.css';

export interface SelectedComponentPanelProps {
	controller: ModelController;
	style?: React.CSSProperties;
}

/**
 * Detail panel for the currently selected component, driven by the selection
 * callback wired through the controller. Renders nothing when there is no
 * selection.
 */
export const SelectedComponentPanel: React.FC<SelectedComponentPanelProps> = ({ controller, style = {} }) => {
	const { selected, manifest, statusMap, isHidden, toggleComponent, select } = controller;

	if (!selected || !manifest[selected]) {
		return null;
	}

	const entry = manifest[selected];
	const status = statusMap.get(selected) ?? 'ok';
	const hidden = isHidden(selected);

	return (
		<div className="foundations-3d-detail" style={style}>
			<div className="foundations-3d-detail-header">
				<GeneralHeading style={{ margin: 0 }}>{entry.label}</GeneralHeading>
				<ButtonIcon icon="ri-close-line" size={ButtonSize.SMALL} label="Close" onClick={() => select(null)} />
			</div>
			<div className="foundations-3d-detail-row">
				<Badge>{entry.layer}</Badge>
				<span className="foundations-3d-detail-status">
					<StatusDot status={status} />
					{STATUS_LABEL[status]}
				</span>
			</div>
			{entry.description && <p className="foundations-3d-detail-description">{entry.description}</p>}
			<div className="foundations-3d-detail-actions">
				<span onClick={(e) => e.stopPropagation()}>
					<ButtonIcon
						icon={hidden ? 'ri-eye-off-line' : 'ri-eye-line'}
						label={hidden ? 'Show component' : 'Hide component'}
						onClick={() => toggleComponent(selected)}
					/>
				</span>
			</div>
		</div>
	);
};
