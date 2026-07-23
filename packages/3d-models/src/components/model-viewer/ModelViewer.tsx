import React from 'react';

import { ComponentManifest, HiddenMode } from '../../core/types';
import { OrientationConvention, NED } from '../../core/orientation';
import { OrientationSource } from '../../core/useOrientationSource';
import { ModelController, useModelController } from '../../core/useModelController';

import { ModelScene } from './ModelScene';
import { ComponentTreePanel } from '../panels/ComponentTreePanel';
import { SelectedComponentPanel } from '../panels/SelectedComponentPanel';
import { OrientationReadout } from '../panels/OrientationReadout';
import { ConnectionIndicator } from '../panels/ConnectionIndicator';
import { ArtificialHorizon } from '../instruments/ArtificialHorizon';
import { OrientationHarness } from '../harness/OrientationHarness';

import './ModelViewer.css';

export interface ModelViewerProps {
	/** URL of the pre-tessellated, node-named `.glb`. */
	modelUrl: string;
	/** Declares valid component ids, labels and layer groupings. */
	manifest: ComponentManifest;

	/**
	 * Live orientation source. When supplied, the model is driven by it and the
	 * orientation-dependent overlays (readout, connection, horizon) are enabled.
	 * Omit for a static, orbit-only viewer.
	 */
	orientationSource?: OrientationSource;
	convention?: OrientationConvention;
	smoothing?: number;

	/**
	 * Externally-owned controller (status, visibility, selection). If omitted an
	 * internal one is created — useful for a self-contained viewer, but supply
	 * your own to push status updates from outside.
	 */
	controller?: ModelController;

	hiddenMode?: HiddenMode;
	grid?: boolean;
	axes?: boolean;

	/** Overlay toggles. */
	showComponentTree?: boolean;
	showSelectedDetail?: boolean;
	showReadout?: boolean;
	showConnection?: boolean;
	showHorizon?: boolean;
	/** Show the slider test harness (usually only during bring-up). */
	showHarness?: boolean;

	/** Extra numeric readouts appended after roll/pitch/yaw. */
	extraReadouts?: { label: string; value: string }[];
	staleAfterMs?: number;

	className?: string;
	style?: React.CSSProperties;
}

/**
 * Batteries-included interactive 3D model viewer: the WebGL scene plus the full
 * custom UI shell (component tree, selection detail, orientation readout,
 * connection state, artificial horizon and optional slider harness), all wired
 * to a {@link ModelController} and an optional {@link OrientationSource}.
 *
 * Everything outside the `<Canvas>` is ordinary React and CSS, so the shell is
 * fully restyleable — that is the whole reason for choosing React Three Fiber
 * over an off-the-shelf CAD viewer.
 */
export const ModelViewer: React.FC<ModelViewerProps> = ({
	modelUrl,
	manifest,
	orientationSource,
	convention = NED,
	smoothing = 12,
	controller: externalController,
	hiddenMode = 'hide',
	grid = true,
	axes = true,
	showComponentTree = true,
	showSelectedDetail = true,
	showReadout = true,
	showConnection = true,
	showHorizon = true,
	showHarness = false,
	extraReadouts = [],
	staleAfterMs = 1000,
	className = '',
	style = {},
}) => {
	// A hook must run unconditionally; use the internal controller only when no
	// external one is supplied.
	const internalController = useModelController(manifest);
	const controller = externalController ?? internalController;

	const hasOrientation = !!orientationSource;

	return (
		<div className={'foundations-3d-viewer ' + className} style={style}>
			<div className="foundations-3d-viewer-canvas">
				<ModelScene
					url={modelUrl}
					manifest={manifest}
					orientationRef={orientationSource?.ref}
					convention={convention}
					smoothing={smoothing}
					statusMap={controller.statusMap}
					hidden={controller.hidden}
					hiddenMode={hiddenMode}
					selected={controller.selected}
					onSelect={controller.select}
					grid={grid}
					axes={axes}
					loadingFallback={null}
				/>
			</div>

			{showConnection && hasOrientation && (
				<div className="foundations-3d-viewer-tl">
					<ConnectionIndicator source={orientationSource!} staleAfterMs={staleAfterMs} />
				</div>
			)}

			{showComponentTree && (
				<div className="foundations-3d-viewer-tr">
					<ComponentTreePanel controller={controller} />
				</div>
			)}

			<div className="foundations-3d-viewer-bl">
				{showReadout && hasOrientation && (
					<OrientationReadout source={orientationSource!} extra={extraReadouts} />
				)}
				{showHarness && hasOrientation && <OrientationHarness source={orientationSource!} />}
			</div>

			<div className="foundations-3d-viewer-br">
				{showSelectedDetail && <SelectedComponentPanel controller={controller} />}
				{showHorizon && hasOrientation && <ArtificialHorizon source={orientationSource!} />}
			</div>
		</div>
	);
};
