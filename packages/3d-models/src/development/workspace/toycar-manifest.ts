import { defineManifest } from '../../core/manifest';

/**
 * Manifest matching the node names in the Khronos **ToyCar** sample asset, so
 * the demo shows real component highlighting, per-component visibility and
 * click-selection out of the box. Fetch the model with:
 *
 *   npm run fetch-demo-model
 *
 * (downloads ToyCar.glb → public/model.glb). See the README for other models.
 *
 * The ToyCar scene graph exposes three named meshes: `ToyCar` (body), `Fabric`
 * and `Glass`.
 */
export const TOYCAR_MANIFEST = defineManifest({
	ToyCar: { label: 'Body Shell', layer: 'body', description: 'Painted die-cast body of the toy car.' },
	Fabric: { label: 'Fabric / Interior', layer: 'interior', description: 'Soft fabric interior trim.' },
	Glass: { label: 'Glazing', layer: 'glazing', description: 'Transparent window glazing.' },
});

export type ToyCarComponentId = keyof typeof TOYCAR_MANIFEST;
