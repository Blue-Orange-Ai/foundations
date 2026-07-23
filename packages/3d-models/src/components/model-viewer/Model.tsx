import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import { ComponentId, ComponentManifest, ComponentStatusMap, HiddenMode } from '../../core/types';
import { Orientation, OrientationConvention, NED, sourceToThree } from '../../core/orientation';
import { statusStyle } from '../../core/statusTheme';
import { indexModel, disposeIndex, resolveComponentId, ModelIndex } from './sceneUtils';

export interface ModelProps {
	/** URL of the pre-tessellated, node-named `.glb`. */
	url: string;
	/** Declares valid component ids, labels and layer groupings. */
	manifest: ComponentManifest;
	/** Live orientation, read every frame. Never a state value — always a ref. */
	orientationRef?: React.MutableRefObject<Orientation>;
	/** Coordinate convention of the orientation source. Defaults to NED. */
	convention?: OrientationConvention;
	/**
	 * Frame-rate-independent smoothing constant. Higher is more responsive;
	 * lower is smoother and hides jitter / dropped packets better.
	 */
	smoothing?: number;
	/** Current per-component status. */
	statusMap?: ComponentStatusMap;
	/** Hidden component ids. */
	hidden?: Set<ComponentId>;
	/** How hidden components render. */
	hiddenMode?: HiddenMode;
	/** Opacity used for x-ray'd components. */
	xrayOpacity?: number;
	/** Fired when a component is clicked. */
	onSelect?: (id: ComponentId | null) => void;
	/** Fired when the hovered component changes (null when nothing is hovered). */
	onHover?: (id: ComponentId | null) => void;
	/** The currently selected component (for selection highlight). */
	selected?: ComponentId | null;
}

const EMPTY_STATUS: ComponentStatusMap = new Map();
const EMPTY_HIDDEN: Set<ComponentId> = new Set();
const SELECTION_EMISSIVE = new THREE.Color('#3b82f6');
const HOVER_EMISSIVE = new THREE.Color('#93c5fd');

export const Model: React.FC<ModelProps> = ({
	url,
	manifest,
	orientationRef,
	convention = NED,
	smoothing = 12,
	statusMap = EMPTY_STATUS,
	hidden = EMPTY_HIDDEN,
	hiddenMode = 'hide',
	xrayOpacity = 0.12,
	onSelect,
	onHover,
	selected = null,
}) => {
	const { scene } = useGLTF(url);
	const groupRef = useRef<THREE.Group>(null);
	const [hovered, setHovered] = useState<ComponentId | null>(null);

	const knownIds = useMemo(() => new Set(Object.keys(manifest)), [manifest]);

	// Traverse once on load: clone materials, snapshot originals, build lookups.
	const index = useMemo<ModelIndex>(() => indexModel(scene, knownIds), [scene, knownIds]);

	// Dispose cloned materials when the model changes or the component unmounts.
	useEffect(() => {
		return () => disposeIndex(index);
	}, [index]);

	// Meshes whose current status pulses — recomputed only when status changes.
	const pulsing = useMemo(() => {
		const list: { mesh: THREE.Mesh; base: number }[] = [];
		statusMap.forEach((status, id) => {
			const style = statusStyle(status);
			if (style.pulse) {
				(index.componentMeshes.get(id) ?? []).forEach((mesh) =>
					list.push({ mesh, base: style.emissiveIntensity }),
				);
			}
		});
		return list;
	}, [statusMap, index]);

	// Reconcile the full visual state (status highlight + visibility + selection
	// + hover) whenever any of those inputs change. Low frequency, so an effect
	// is appropriate; the per-frame work is limited to the pulse below.
	useEffect(() => {
		index.snapshots.forEach((snap) => {
			const id = resolveComponentId(snap.mesh, knownIds);
			const status = id ? statusMap.get(id) : undefined;
			const isHidden = id ? hidden.has(id) : false;
			const isSelected = id != null && id === selected;
			const isHovered = id != null && id === hovered;

			snap.materials.forEach((material, i) => {
				const std = material as THREE.MeshStandardMaterial;

				// --- Emissive highlight (status wins, then selection, then hover) ---
				if (std.emissive && snap.originalEmissive[i]) {
					if (status && statusStyle(status).emissiveIntensity > 0) {
						std.emissive.set(statusStyle(status).color);
						std.emissiveIntensity = statusStyle(status).emissiveIntensity;
					} else if (isSelected) {
						std.emissive.copy(SELECTION_EMISSIVE);
						std.emissiveIntensity = 0.5;
					} else if (isHovered) {
						std.emissive.copy(HOVER_EMISSIVE);
						std.emissiveIntensity = 0.3;
					} else {
						std.emissive.copy(snap.originalEmissive[i] as THREE.Color);
						std.emissiveIntensity = snap.originalEmissiveIntensity[i];
					}
				}

				// --- Visibility ---
				if (isHidden && hiddenMode === 'hide') {
					snap.mesh.visible = false;
				} else {
					snap.mesh.visible = true;
					if (isHidden && hiddenMode === 'xray') {
						std.transparent = true;
						std.opacity = xrayOpacity;
						std.depthWrite = false;
					} else {
						std.transparent = snap.originalTransparent[i];
						std.opacity = snap.originalOpacity[i];
						std.depthWrite = true;
					}
				}
				std.needsUpdate = true;
			});
		});
	}, [index, knownIds, statusMap, hidden, hiddenMode, xrayOpacity, selected, hovered]);

	// Drive orientation and the emissive pulse every frame.
	useFrame((_, delta) => {
		// Orientation: the model rotates within a fixed world; the camera orbits
		// independently (OrbitControls), so the viewer sees the object move
		// against a stationary reference frame.
		if (groupRef.current && orientationRef) {
			const { roll, pitch, yaw } = orientationRef.current;
			const target = sourceToThree(roll, pitch, yaw, convention);
			// 1 - exp(-k·dt) gives identical behaviour at 30fps and 144fps.
			groupRef.current.quaternion.slerp(target, 1 - Math.exp(-smoothing * delta));
		}

		// Pulse: sine-driven emissive intensity, never via React state.
		if (pulsing.length > 0) {
			const t = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
			const wave = 0.5 + 0.5 * Math.sin(t * 6);
			pulsing.forEach(({ mesh, base }) => {
				const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
				mats.forEach((m) => {
					const std = m as THREE.MeshStandardMaterial;
					if (std.emissive) {
						std.emissiveIntensity = base * (0.4 + 0.6 * wave);
					}
				});
			});
		}
	});

	const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
		event.stopPropagation();
		const id = resolveComponentId(event.object, knownIds);
		if (onSelect) {
			onSelect(id);
		}
	};

	const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
		event.stopPropagation();
		const id = resolveComponentId(event.object, knownIds);
		if (id !== hovered) {
			setHovered(id);
			if (onHover) {
				onHover(id);
			}
		}
		if (typeof document !== 'undefined' && id) {
			document.body.style.cursor = 'pointer';
		}
	};

	const handlePointerOut = () => {
		if (hovered !== null) {
			setHovered(null);
			if (onHover) {
				onHover(null);
			}
		}
		if (typeof document !== 'undefined') {
			document.body.style.cursor = 'auto';
		}
	};

	return (
		<group
			ref={groupRef}
			onPointerDown={handlePointerDown}
			onPointerOver={handlePointerOver}
			onPointerOut={handlePointerOut}
		>
			<primitive object={scene} />
		</group>
	);
};
