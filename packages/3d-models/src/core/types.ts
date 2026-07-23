// Shared domain types for the 3D model viewer.
//
// These types are intentionally domain-agnostic. The running example in the
// documentation is a drone attitude display, but the same structure applies to
// a robot arm, a vehicle chassis, a machine tool, or any assembly whose parts
// carry a status and can be shown/hidden.

/** Health/alert state a single component can report. */
export type Status = 'ok' | 'warn' | 'error' | 'offline';

/**
 * Identifier of a single component in the model. This MUST match the node name
 * baked into the exported `.glb` (see the asset-preparation step in the README).
 * Kept as a plain string so a manifest can be authored without a code change,
 * while a caller with a literal manifest still gets narrow union types via
 * `keyof typeof MANIFEST`.
 */
export type ComponentId = string;

/** Identifier of a logical layer/grouping of components (e.g. `propulsion`). */
export type LayerId = string;

/** A single entry in the component manifest. */
export interface ComponentManifestEntry {
	/** Human readable label shown in the UI. */
	label: string;
	/** The layer this component belongs to. Drives the layer visibility toggles. */
	layer: LayerId;
	/** Optional longer description shown in the selected-component detail panel. */
	description?: string;
}

/**
 * Declares every valid component id, its human readable label and its layer
 * grouping. This is the single source of truth mapping semantic ids onto the
 * node names baked into the model.
 */
export type ComponentManifest = Record<ComponentId, ComponentManifestEntry>;

/** Maps component ids to their current status. Absent id ⇒ treated as `ok`. */
export type ComponentStatusMap = Map<ComponentId, Status>;

/** How a hidden component is rendered. */
export type HiddenMode =
	/** `mesh.visible = false` — the part disappears entirely. */
	| 'hide'
	/** Swap to a transparent material so spatial context is retained. */
	| 'xray';
