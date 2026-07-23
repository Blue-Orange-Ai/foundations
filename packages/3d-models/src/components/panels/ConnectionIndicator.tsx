import React, { useEffect, useState } from 'react';
import { deriveConnectionState, OrientationSource } from '../../core/useOrientationSource';

import './ConnectionIndicator.css';

export interface ConnectionIndicatorProps {
	source: OrientationSource;
	/** A sample older than this (ms) is treated as stale. Defaults to 1000ms. */
	staleAfterMs?: number;
	/** How often to re-evaluate freshness (ms). Defaults to 500ms. */
	pollMs?: number;
	style?: React.CSSProperties;
}

/**
 * Distinguishes "connected and live" from "disconnected / showing last known".
 * Silently presenting stale telemetry as live is the dangerous failure mode, so
 * a stale feed is flagged prominently.
 */
export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
	source,
	staleAfterMs = 1000,
	pollMs = 500,
	style = {},
}) => {
	const [now, setNow] = useState<number>(() => Date.now());

	useEffect(() => {
		const handle = setInterval(() => setNow(Date.now()), pollMs);
		return () => clearInterval(handle);
	}, [pollMs]);

	const state = deriveConnectionState(source, now, staleAfterMs);

	let variant: 'live' | 'stale' | 'offline';
	let text: string;
	if (!state.connected) {
		variant = 'offline';
		text = 'No signal';
	} else if (state.stale) {
		variant = 'stale';
		text = `Stale — ${(state.ageMs / 1000).toFixed(1)}s`;
	} else {
		variant = 'live';
		text = 'Live';
	}

	return (
		<div className={`foundations-3d-connection foundations-3d-connection-${variant}`} style={style}>
			<span className="foundations-3d-connection-dot" />
			<span className="foundations-3d-connection-text">{text}</span>
		</div>
	);
};
