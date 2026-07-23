import * as THREE from 'three';
import { ComponentId } from '../../core/types';

/** Every mesh material as a flat array (a mesh may carry a material array). */
export function materialsOf(mesh: THREE.Mesh): THREE.Material[] {
	return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

/**
 * Walk up the parent chain from a raycast hit until an object whose name is a
 * known component id is found. The hit is always the leaf mesh, which may be a
 * child of the node carrying the semantic name.
 */
export function resolveComponentId(
	object: THREE.Object3D | null,
	knownIds: Set<string>,
): ComponentId | null {
	let current: THREE.Object3D | null = object;
	while (current) {
		if (current.name && knownIds.has(current.name)) {
			return current.name;
		}
		current = current.parent;
	}
	return null;
}

/** A per-mesh snapshot captured at load time so any change can be reverted. */
export interface MeshSnapshot {
	mesh: THREE.Mesh;
	/** The cloned, per-mesh materials we own and must dispose on unmount. */
	materials: THREE.Material[];
	originalOpacity: number[];
	originalTransparent: boolean[];
	originalEmissive: (THREE.Color | null)[];
	originalEmissiveIntensity: number[];
}

/** Result of indexing a loaded glTF scene. */
export interface ModelIndex {
	/** Named component node → the meshes beneath it. */
	componentMeshes: Map<ComponentId, THREE.Mesh[]>;
	/** Per-mesh snapshots for every mesh belonging to a known component. */
	snapshots: MeshSnapshot[];
	/** Set of known component ids present in the scene. */
	presentIds: Set<ComponentId>;
}

/**
 * Traverse the scene **once**: clone each mesh's material so per-component
 * changes are isolated (glTF exports frequently share a material instance
 * across meshes — colouring one motor would otherwise colour all four), and
 * snapshot the original values so state can be restored later.
 */
export function indexModel(root: THREE.Object3D, knownIds: Set<string>): ModelIndex {
	const componentMeshes = new Map<ComponentId, THREE.Mesh[]>();
	const snapshots: MeshSnapshot[] = [];
	const presentIds = new Set<ComponentId>();

	root.traverse((object) => {
		const mesh = object as THREE.Mesh;
		if (!(mesh as THREE.Mesh).isMesh) {
			return;
		}
		const componentId = resolveComponentId(mesh, knownIds);
		if (!componentId) {
			return;
		}
		presentIds.add(componentId);

		// Clone materials per mesh so appearance can change independently.
		const cloned = materialsOf(mesh).map((m) => m.clone());
		mesh.material = cloned.length === 1 ? cloned[0] : cloned;

		const snapshot: MeshSnapshot = {
			mesh,
			materials: cloned,
			originalOpacity: cloned.map((m) => (m as THREE.MeshStandardMaterial).opacity ?? 1),
			originalTransparent: cloned.map((m) => m.transparent ?? false),
			originalEmissive: cloned.map((m) => {
				const std = m as THREE.MeshStandardMaterial;
				return std.emissive ? std.emissive.clone() : null;
			}),
			originalEmissiveIntensity: cloned.map(
				(m) => (m as THREE.MeshStandardMaterial).emissiveIntensity ?? 1,
			),
		};
		snapshots.push(snapshot);

		const list = componentMeshes.get(componentId) ?? [];
		list.push(mesh);
		componentMeshes.set(componentId, list);
	});

	return { componentMeshes, snapshots, presentIds };
}

/** Dispose cloned materials. three does not GC these automatically. */
export function disposeIndex(index: ModelIndex): void {
	index.snapshots.forEach((snap) => snap.materials.forEach((m) => m.dispose()));
}
