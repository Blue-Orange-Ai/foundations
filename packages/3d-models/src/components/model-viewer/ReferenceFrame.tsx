import React from 'react';
import { Grid } from '@react-three/drei';

export interface ReferenceFrameProps {
	/** Show the ground grid. */
	grid?: boolean;
	/** Show the RGB axis helper (X red, Y green, Z blue). */
	axes?: boolean;
	/** Half-extent of the grid / length of the axes. */
	size?: number;
}

/**
 * A fixed world reference frame — ground grid and axis markers — against which
 * the model's orientation is read. Critically this does **not** rotate with the
 * model: the viewer sees the object banking against a stationary horizon.
 */
export const ReferenceFrame: React.FC<ReferenceFrameProps> = ({
	grid = true,
	axes = true,
	size = 10,
}) => {
	return (
		<group>
			{grid && (
				<Grid
					args={[size * 2, size * 2]}
					cellSize={0.5}
					cellThickness={0.6}
					cellColor="#6b7280"
					sectionSize={2.5}
					sectionThickness={1}
					sectionColor="#9ca3af"
					fadeDistance={size * 3}
					fadeStrength={1}
					infiniteGrid
					position={[0, -1.5, 0]}
				/>
			)}
			{axes && <axesHelper args={[size * 0.5]} />}
		</group>
	);
};
