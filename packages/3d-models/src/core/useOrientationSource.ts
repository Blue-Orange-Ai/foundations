import { useMemo, useRef, useSyncExternalStore } from 'react';
import { Orientation } from './orientation';

/**
 * A live orientation source.
 *
 * Orientation arrives at 10–50 Hz. Writing every sample into React state would
 * thrash rendering, so the current value lives in a `useRef` that the render
 * loop (`useFrame`) reads directly — never in component state.
 *
 * A lightweight subscription channel is layered on top so that low-frequency
 * consumers (the numeric readout, the SVG artificial horizon, the connection
 * indicator) can be driven from the *same* ref without going through the three
 * scene. `push` notifies subscribers; the WebGL render loop ignores the
 * subscription entirely and just reads `ref.current`.
 */
export interface OrientationSource {
	/** Latest orientation. Read this from inside `useFrame`. */
	ref: React.MutableRefObject<Orientation>;
	/** Milliseconds since epoch of the most recent sample (0 if none yet). */
	lastUpdate: React.MutableRefObject<number>;
	/** Write a new sample. Updates the ref and notifies subscribers. */
	push: (orientation: Orientation, timestampMs?: number) => void;
	/** Subscribe to sample notifications. Returns an unsubscribe function. */
	subscribe: (listener: () => void) => () => void;
}

const ZERO: Orientation = { roll: 0, pitch: 0, yaw: 0 };

/**
 * Create an {@link OrientationSource}. Wire your transport (WebSocket, MQTT,
 * SSE, …) to call `push` for each incoming sample.
 */
export function useOrientationSource(initial: Orientation = ZERO): OrientationSource {
	const ref = useRef<Orientation>({ ...initial });
	const lastUpdate = useRef<number>(0);
	const listeners = useRef<Set<() => void>>(new Set());

	return useMemo<OrientationSource>(() => {
		const push = (orientation: Orientation, timestampMs?: number) => {
			ref.current = orientation;
			lastUpdate.current = timestampMs ?? Date.now();
			listeners.current.forEach((l) => l());
		};
		const subscribe = (listener: () => void) => {
			listeners.current.add(listener);
			return () => {
				listeners.current.delete(listener);
			};
		};
		return { ref, lastUpdate, push, subscribe };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

/**
 * Subscribe a React component to an {@link OrientationSource} for low-frequency
 * rendering (numeric readouts, SVG instruments). Returns the latest sample and
 * re-renders on each push. Do **not** use this to drive the three.js scene —
 * that reads `source.ref` directly in `useFrame`.
 */
export function useOrientationValue(source: OrientationSource): Orientation {
	return useSyncExternalStore(
		source.subscribe,
		() => source.ref.current,
		() => source.ref.current,
	);
}

/**
 * Connection freshness derived from an {@link OrientationSource}.
 *
 * Silently showing stale data as if it were live is the dangerous failure mode
 * for an attitude display, so callers should surface `stale` prominently.
 */
export interface ConnectionState {
	/** True once at least one sample has been received. */
	connected: boolean;
	/** True when the last sample is older than `staleAfterMs`. */
	stale: boolean;
	/** Age of the most recent sample in milliseconds (Infinity if none). */
	ageMs: number;
}

/**
 * Poll an {@link OrientationSource} for staleness. `nowMs` is injected (rather
 * than read from the clock internally) so the caller controls the cadence,
 * typically from a `setInterval` tick held in state.
 */
export function deriveConnectionState(
	source: OrientationSource,
	nowMs: number,
	staleAfterMs: number,
): ConnectionState {
	const last = source.lastUpdate.current;
	if (last === 0) {
		return { connected: false, stale: true, ageMs: Infinity };
	}
	const ageMs = Math.max(0, nowMs - last);
	return { connected: true, stale: ageMs > staleAfterMs, ageMs };
}
