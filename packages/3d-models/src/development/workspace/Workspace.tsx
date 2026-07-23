// @ts-ignore
import React, { useEffect } from 'react';
import { Button, ButtonType, ButtonSize } from '@blue-orange-ai/foundations-core';

import { ModelViewer } from '../../components/model-viewer/ModelViewer';
import { useModelController } from '../../core/useModelController';
import { useOrientationSource } from '../../core/useOrientationSource';
import { toRadians, toDegrees, NED } from '../../core/orientation';
import { TOYCAR_MANIFEST } from './toycar-manifest';

import './Workspace.css';

// The demo model. Fetch it with `npm run fetch-demo-model` (downloads the
// Khronos ToyCar sample → public/model.glb, matching TOYCAR_MANIFEST). Absent,
// the canvas shows its error fallback while every panel and the slider harness
// still work. See the README for other droppable models.
const MODEL_URL = process.env.PUBLIC_URL + '/model.glb';

// The component ids to cycle faults across — must exist in the active manifest.
const FAULT_TARGETS = ['ToyCar', 'Fabric', 'Glass'] as const;

/**
 * Local development harness for the 3D model viewer. Demonstrates driving the
 * viewer from a controller + orientation source, wiring the slider harness, and
 * injecting component faults — all reusing foundations-core UI.
 */
export const Workspace: React.FC = () => {
	const controller = useModelController(TOYCAR_MANIFEST);
	const source = useOrientationSource();

	// Gentle idle motion so the demo is alive even without the real feed.
	useEffect(() => {
		let raf = 0;
		const start = typeof performance !== 'undefined' ? performance.now() : 0;
		const tick = () => {
			const t = ((typeof performance !== 'undefined' ? performance.now() : 0) - start) / 1000;
			source.push({
				roll: toRadians(20 * Math.sin(t * 0.6)),
				pitch: toRadians(10 * Math.sin(t * 0.9)),
				yaw: toRadians(15 * Math.sin(t * 0.3)),
			});
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [source]);

	const injectFault = () => {
		controller.setStatuses({ [FAULT_TARGETS[0]]: 'error', [FAULT_TARGETS[1]]: 'warn', [FAULT_TARGETS[2]]: 'offline' });
	};
	const clearFaults = () => {
		controller.setStatuses({ [FAULT_TARGETS[0]]: 'ok', [FAULT_TARGETS[1]]: 'ok', [FAULT_TARGETS[2]]: 'ok' });
	};

	return (
		<div className="workspace-main-window">
			<div className="workspace-toolbar">
				<Button text="Inject faults" buttonType={ButtonType.DANGER} size={ButtonSize.SMALL} onClick={injectFault} />
				<Button text="Clear faults" buttonType={ButtonType.SUCCESS} size={ButtonSize.SMALL} onClick={clearFaults} />
			</div>
			<div className="workspace-display-window">
				<ModelViewer
					modelUrl={MODEL_URL}
					manifest={TOYCAR_MANIFEST}
					controller={controller}
					orientationSource={source}
					convention={NED}
					hiddenMode="xray"
					showHarness={true}
					extraReadouts={[{ label: 'Heading', value: `${((toDegrees(source.ref.current.yaw) + 360) % 360).toFixed(0)}°` }]}
				/>
			</div>
		</div>
	);
};
