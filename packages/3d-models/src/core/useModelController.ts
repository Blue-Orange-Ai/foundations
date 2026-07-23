import { useCallback, useMemo, useState } from 'react';
import { ComponentId, ComponentManifest, ComponentStatusMap, LayerId, Status } from './types';

/**
 * Owns the low-frequency UI state of a model: per-component status, which
 * components are hidden, and the current selection. Unlike orientation, these
 * change infrequently and live comfortably in React state.
 *
 * The hook is manifest-driven: layer visibility toggles resolve to the
 * underlying component ids via the manifest, keeping the UI semantic and the
 * mapping in one place.
 */
export interface ModelController {
	manifest: ComponentManifest;

	/** Current status per component. */
	statusMap: ComponentStatusMap;
	setStatus: (id: ComponentId, status: Status) => void;
	setStatuses: (statuses: Partial<Record<ComponentId, Status>>) => void;
	clearStatus: (id: ComponentId) => void;

	/** Set of currently hidden component ids. */
	hidden: Set<ComponentId>;
	isHidden: (id: ComponentId) => boolean;
	toggleComponent: (id: ComponentId) => void;
	setComponentHidden: (id: ComponentId, hidden: boolean) => void;

	/** Layer-level visibility (a layer is hidden iff all its components are). */
	isLayerHidden: (layer: LayerId) => boolean;
	toggleLayer: (layer: LayerId) => void;
	setLayerHidden: (layer: LayerId, hidden: boolean) => void;

	/** Currently selected component, or null. */
	selected: ComponentId | null;
	select: (id: ComponentId | null) => void;

	/** Layer id → component ids, derived from the manifest. */
	layers: Map<LayerId, ComponentId[]>;
}

function buildLayers(manifest: ComponentManifest): Map<LayerId, ComponentId[]> {
	const layers = new Map<LayerId, ComponentId[]>();
	(Object.keys(manifest) as ComponentId[]).forEach((id) => {
		const layer = manifest[id].layer;
		const list = layers.get(layer) ?? [];
		list.push(id);
		layers.set(layer, list);
	});
	return layers;
}

export function useModelController(manifest: ComponentManifest): ModelController {
	const [statusMap, setStatusMap] = useState<ComponentStatusMap>(() => new Map());
	const [hidden, setHidden] = useState<Set<ComponentId>>(() => new Set());
	const [selected, setSelected] = useState<ComponentId | null>(null);

	const layers = useMemo(() => buildLayers(manifest), [manifest]);

	const setStatus = useCallback((id: ComponentId, status: Status) => {
		setStatusMap((prev) => {
			const next = new Map(prev);
			next.set(id, status);
			return next;
		});
	}, []);

	const setStatuses = useCallback((statuses: Partial<Record<ComponentId, Status>>) => {
		setStatusMap((prev) => {
			const next = new Map(prev);
			(Object.keys(statuses) as ComponentId[]).forEach((id) => {
				const s = statuses[id];
				if (s) {
					next.set(id, s);
				}
			});
			return next;
		});
	}, []);

	const clearStatus = useCallback((id: ComponentId) => {
		setStatusMap((prev) => {
			if (!prev.has(id)) {
				return prev;
			}
			const next = new Map(prev);
			next.delete(id);
			return next;
		});
	}, []);

	const setComponentHidden = useCallback((id: ComponentId, hide: boolean) => {
		setHidden((prev) => {
			const has = prev.has(id);
			if (hide === has) {
				return prev;
			}
			const next = new Set(prev);
			if (hide) {
				next.add(id);
			} else {
				next.delete(id);
			}
			return next;
		});
	}, []);

	const toggleComponent = useCallback((id: ComponentId) => {
		setHidden((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const isHidden = useCallback((id: ComponentId) => hidden.has(id), [hidden]);

	const isLayerHidden = useCallback(
		(layer: LayerId) => {
			const ids = layers.get(layer) ?? [];
			return ids.length > 0 && ids.every((id) => hidden.has(id));
		},
		[layers, hidden],
	);

	const setLayerHidden = useCallback(
		(layer: LayerId, hide: boolean) => {
			const ids = layers.get(layer) ?? [];
			setHidden((prev) => {
				const next = new Set(prev);
				ids.forEach((id) => (hide ? next.add(id) : next.delete(id)));
				return next;
			});
		},
		[layers],
	);

	const toggleLayer = useCallback(
		(layer: LayerId) => {
			setLayerHidden(layer, !isLayerHidden(layer));
		},
		[setLayerHidden, isLayerHidden],
	);

	const select = useCallback((id: ComponentId | null) => setSelected(id), []);

	return {
		manifest,
		statusMap,
		setStatus,
		setStatuses,
		clearStatus,
		hidden,
		isHidden,
		toggleComponent,
		setComponentHidden,
		isLayerHidden,
		toggleLayer,
		setLayerHidden,
		selected,
		select,
		layers,
	};
}
