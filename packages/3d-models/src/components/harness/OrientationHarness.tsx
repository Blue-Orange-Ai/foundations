import React, { useState } from 'react';
import { GeneralHeading, Button, ButtonType, ButtonSize } from '@blue-orange-ai/foundations-core';

import { OrientationSource } from '../../core/useOrientationSource';
import { toRadians, toDegrees } from '../../core/orientation';

import './OrientationHarness.css';

export interface OrientationHarnessProps {
	source: OrientationSource;
	title?: string;
	style?: React.CSSProperties;
}

interface Axis {
	key: 'roll' | 'pitch' | 'yaw';
	label: string;
	min: number;
	max: number;
}

const AXES: Axis[] = [
	{ key: 'roll', label: 'Roll', min: -180, max: 180 },
	{ key: 'pitch', label: 'Pitch', min: -90, max: 90 },
	{ key: 'yaw', label: 'Yaw', min: -180, max: 180 },
];

/**
 * A slider test harness that writes into the same {@link OrientationSource} as
 * the real feed. Build and validate the coordinate conversion against these
 * sliders **before** wiring the network transport — debugging an axis
 * convention and network parsing at the same time is significantly harder than
 * doing them separately. Keep the harness; it stays useful for debugging.
 */
export const OrientationHarness: React.FC<OrientationHarnessProps> = ({
	source,
	title = 'Orientation Harness',
	style = {},
}) => {
	const [angles, setAngles] = useState({
		roll: toDegrees(source.ref.current.roll),
		pitch: toDegrees(source.ref.current.pitch),
		yaw: toDegrees(source.ref.current.yaw),
	});

	const apply = (next: typeof angles) => {
		setAngles(next);
		source.push({
			roll: toRadians(next.roll),
			pitch: toRadians(next.pitch),
			yaw: toRadians(next.yaw),
		});
	};

	const reset = () => apply({ roll: 0, pitch: 0, yaw: 0 });

	return (
		<div className="foundations-3d-harness" style={style}>
			<GeneralHeading style={{ marginTop: 0 }}>{title}</GeneralHeading>
			{AXES.map((axis) => (
				<div className="foundations-3d-harness-axis" key={axis.key}>
					<div className="foundations-3d-harness-axis-header">
						<span>{axis.label}</span>
						<span className="foundations-3d-harness-value">{angles[axis.key].toFixed(0)}°</span>
					</div>
					<input
						type="range"
						min={axis.min}
						max={axis.max}
						step={1}
						value={angles[axis.key]}
						onChange={(e) => apply({ ...angles, [axis.key]: Number(e.target.value) })}
					/>
				</div>
			))}
			<Button text="Level" buttonType={ButtonType.SECONDARY} size={ButtonSize.SMALL} onClick={reset} />
		</div>
	);
};
