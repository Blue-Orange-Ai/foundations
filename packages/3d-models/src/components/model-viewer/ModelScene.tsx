import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { Lights } from './Lights';
import { ReferenceFrame } from './ReferenceFrame';
import { Model, ModelProps } from './Model';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';

export interface ModelSceneProps extends ModelProps {
	/** Show the ground grid. */
	grid?: boolean;
	/** Show the RGB axis helper. */
	axes?: boolean;
	/** Initial camera position in world space. */
	cameraPosition?: [number, number, number];
	/** Node rendered inside Suspense while the `.glb` loads. */
	loadingFallback?: React.ReactNode;
	/** Node rendered if the WebGL context fails. */
	errorFallback?: React.ReactNode;
	/** Deselect when the empty background is clicked. Defaults to true. */
	deselectOnMiss?: boolean;
}

/**
 * The bare WebGL scene: `<Canvas>` with lights, the model, a fixed reference
 * frame and orbit controls, wrapped in a Suspense + error boundary. The camera
 * orbits the world; the model rotates within it.
 *
 * Use this directly when supplying your own surrounding UI, or use
 * {@link ModelViewer} for the batteries-included shell.
 */
export const ModelScene: React.FC<ModelSceneProps> = ({
	grid = true,
	axes = true,
	cameraPosition = [4, 3, 5],
	loadingFallback,
	errorFallback,
	deselectOnMiss = true,
	onSelect,
	...modelProps
}) => {
	return (
		<CanvasErrorBoundary fallback={errorFallback}>
			<Canvas
				camera={{ position: cameraPosition, fov: 50 }}
				onPointerMissed={() => {
					if (deselectOnMiss && onSelect) {
						onSelect(null);
					}
				}}
			>
				<Suspense fallback={loadingFallback ?? null}>
					<Lights />
					<ReferenceFrame grid={grid} axes={axes} />
					<Model {...modelProps} onSelect={onSelect} />
					<OrbitControls makeDefault enableDamping dampingFactor={0.1} />
				</Suspense>
			</Canvas>
		</CanvasErrorBoundary>
	);
};
