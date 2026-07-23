import { ComponentManifest, ComponentId, LayerId, Status } from './types';

/**
 * Identity helper for authoring a manifest with full type inference. Using this
 * instead of a bare object literal lets a caller keep narrow `keyof` component
 * ids while still satisfying {@link ComponentManifest}:
 *
 * ```ts
 * export const COMPONENTS = defineManifest({
 *   motor_fl: { label: 'Motor — Front Left', layer: 'propulsion' },
 *   gps:      { label: 'GPS Module',          layer: 'avionics'   },
 * });
 * export type DroneComponentId = keyof typeof COMPONENTS;
 * ```
 */
export function defineManifest<T extends ComponentManifest>(manifest: T): T {
	return manifest;
}

/** All distinct layer ids in a manifest, in first-seen order. */
export function layersOf(manifest: ComponentManifest): LayerId[] {
	const seen: LayerId[] = [];
	(Object.keys(manifest) as ComponentId[]).forEach((id) => {
		const layer = manifest[id].layer;
		if (!seen.includes(layer)) {
			seen.push(layer);
		}
	});
	return seen;
}

/** Component ids belonging to a layer. */
export function componentsInLayer(manifest: ComponentManifest, layer: LayerId): ComponentId[] {
	return (Object.keys(manifest) as ComponentId[]).filter((id) => manifest[id].layer === layer);
}

/** Human readable text for a status value. */
export const STATUS_LABEL: Record<Status, string> = {
	ok: 'OK',
	warn: 'Warning',
	error: 'Error',
	offline: 'Offline',
};
