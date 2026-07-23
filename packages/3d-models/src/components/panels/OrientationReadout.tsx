import React from 'react';
import { OrientationSource, useOrientationValue } from '../../core/useOrientationSource';
import { toDegrees } from '../../core/orientation';

import './OrientationReadout.css';

export interface OrientationReadoutProps {
	source: OrientationSource;
	/** Extra domain readouts (drone: heading, altitude) rendered after r/p/y. */
	extra?: { label: string; value: string }[];
	style?: React.CSSProperties;
}

function fmt(radians: number): string {
	const deg = toDegrees(radians);
	const sign = deg > 0 ? '+' : '';
	return `${sign}${deg.toFixed(1)}°`;
}

/**
 * Numeric orientation readout. Driven from the orientation source's
 * subscription channel (not the three scene), so it stays in plain DOM.
 */
export const OrientationReadout: React.FC<OrientationReadoutProps> = ({ source, extra = [], style = {} }) => {
	const { roll, pitch, yaw } = useOrientationValue(source);

	const rows = [
		{ label: 'Roll', value: fmt(roll) },
		{ label: 'Pitch', value: fmt(pitch) },
		{ label: 'Yaw', value: fmt(yaw) },
		...extra,
	];

	return (
		<div className="foundations-3d-readout" style={style}>
			{rows.map((row) => (
				<div className="foundations-3d-readout-row" key={row.label}>
					<span className="foundations-3d-readout-label">{row.label}</span>
					<span className="foundations-3d-readout-value">{row.value}</span>
				</div>
			))}
		</div>
	);
};
