import React from 'react';
import { OrientationSource, useOrientationValue } from '../../core/useOrientationSource';
import { toDegrees } from '../../core/orientation';

import './ArtificialHorizon.css';

export interface ArtificialHorizonProps {
	source: OrientationSource;
	size?: number;
	style?: React.CSSProperties;
}

/**
 * A 2D artificial-horizon instrument, built as plain SVG driven from the same
 * orientation ref via its subscription — deliberately kept out of WebGL, where
 * a flat instrument is simpler and sharper. Roll rotates the horizon; pitch
 * slides it vertically.
 */
export const ArtificialHorizon: React.FC<ArtificialHorizonProps> = ({ source, size = 160, style = {} }) => {
	const { roll, pitch } = useOrientationValue(source);

	const rollDeg = toDegrees(roll);
	const pitchDeg = toDegrees(pitch);
	// Pixels of vertical travel per degree of pitch.
	const pitchOffset = Math.max(-size / 2, Math.min(size / 2, pitchDeg * 1.8));

	return (
		<div className="foundations-3d-horizon" style={{ width: size, height: size, ...style }}>
			<svg viewBox="-100 -100 200 200" width={size} height={size}>
				<defs>
					<clipPath id="foundations-3d-horizon-clip">
						<circle cx="0" cy="0" r="96" />
					</clipPath>
				</defs>
				<g clipPath="url(#foundations-3d-horizon-clip)">
					<g transform={`rotate(${-rollDeg})`}>
						<g transform={`translate(0 ${pitchOffset})`}>
							{/* Sky */}
							<rect x="-200" y="-400" width="400" height="400" fill="#3b82f6" />
							{/* Ground */}
							<rect x="-200" y="0" width="400" height="400" fill="#92603b" />
							{/* Horizon line */}
							<line x1="-200" y1="0" x2="200" y2="0" stroke="white" strokeWidth="2" />
							{/* Pitch ladder */}
							{[-20, -10, 10, 20].map((deg) => (
								<g key={deg} transform={`translate(0 ${-deg * 1.8})`}>
									<line x1="-24" y1="0" x2="24" y2="0" stroke="white" strokeWidth="1" />
									<text x="30" y="4" fill="white" fontSize="10" textAnchor="start">
										{Math.abs(deg)}
									</text>
								</g>
							))}
						</g>
					</g>
				</g>
				{/* Fixed aircraft reference marker */}
				<g stroke="#facc15" strokeWidth="3" fill="none">
					<line x1="-40" y1="0" x2="-14" y2="0" />
					<line x1="14" y1="0" x2="40" y2="0" />
					<circle cx="0" cy="0" r="3" fill="#facc15" stroke="none" />
				</g>
				{/* Bezel */}
				<circle cx="0" cy="0" r="96" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="8" />
			</svg>
		</div>
	);
};
