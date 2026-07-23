import { Status } from './types';

/**
 * Visual treatment for each status, shared between the three.js highlighting
 * (emissive colour + pulse) and the 2D UI (status dots). Keeping a single table
 * means a status always looks the same in the scene and in the panels.
 */
export interface StatusStyle {
	/** Hex colour (also used as the emissive colour in the 3D scene). */
	color: string;
	/** Base emissive intensity applied to a highlighted mesh. 0 ⇒ no highlight. */
	emissiveIntensity: number;
	/** Whether the highlight should pulse (driven by a sine wave in useFrame). */
	pulse: boolean;
}

export const STATUS_STYLES: Record<Status, StatusStyle> = {
	ok: { color: '#16a34b', emissiveIntensity: 0, pulse: false },
	warn: { color: '#f97317', emissiveIntensity: 0.6, pulse: true },
	error: { color: '#e11d48', emissiveIntensity: 0.9, pulse: true },
	offline: { color: '#71717a', emissiveIntensity: 0.35, pulse: false },
};

export function statusStyle(status: Status): StatusStyle {
	return STATUS_STYLES[status];
}
