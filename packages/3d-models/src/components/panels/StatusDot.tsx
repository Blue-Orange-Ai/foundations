import React from 'react';
import { Status } from '../../core/types';
import { STATUS_STYLES } from '../../core/statusTheme';

import './StatusDot.css';

interface Props {
	status?: Status;
	pulse?: boolean;
	style?: React.CSSProperties;
}

/** A small coloured dot indicating a component's status, shared across panels. */
export const StatusDot: React.FC<Props> = ({ status = 'ok', pulse, style = {} }) => {
	const theme = STATUS_STYLES[status];
	const shouldPulse = pulse ?? theme.pulse;
	return (
		<span
			className={'foundations-3d-status-dot' + (shouldPulse ? ' foundations-3d-status-dot-pulse' : '')}
			style={{ backgroundColor: theme.color, ...style }}
		/>
	);
};
