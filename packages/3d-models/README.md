# Foundations 3D Models

`@blue-orange-ai/foundations-3d-models` — an interactive 3D model viewer for the
Blue Orange **Foundations** library.

It renders a 3D model (originating from CAD), orients it dynamically from a live
data source, highlights individual components by status, and gives full
layer/component visibility control — all with a fully custom React UI built on
[`@blue-orange-ai/foundations-core`](../core).

**Running example:** a drone attitude display — the model rotates with
roll/pitch/yaw telemetry and components (motors, ESCs, GPS, battery) highlight
when they report faults. The structure is domain-agnostic: a robot arm following
joint feedback, a vehicle chassis showing sensor health, a machine tool, or a
building-services model showing equipment alarms all map onto the same pieces.

## Stack

Built on [`three`](https://threejs.org),
[`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) and
[`@react-three/drei`](https://github.com/pmndrs/drei). React Three Fiber is a
declarative scene graph, so orientation, materials and visibility are all just
state you control — which is exactly what a live-driven viewer needs, and what
static CAD-viewer libraries make hard.

## Install

```bash
npm install @blue-orange-ai/foundations-3d-models
```

Import the icon font once in your app if you do not already:

```ts
import 'remixicon/fonts/remixicon.css';
```

## Quick start

```tsx
import {
  ModelViewer,
  useModelController,
  useOrientationSource,
  defineManifest,
  NED,
} from '@blue-orange-ai/foundations-3d-models';

const MANIFEST = defineManifest({
  motor_fl: { label: 'Motor — Front Left', layer: 'propulsion' },
  gps:      { label: 'GPS Module',          layer: 'avionics'   },
  battery:  { label: 'Battery',             layer: 'payload'    },
});

function AttitudeDisplay() {
  const controller = useModelController(MANIFEST);
  const source = useOrientationSource();

  // Wire your transport (WebSocket/MQTT/SSE). Write EVERY sample to the source;
  // it stores into a ref, so 10–50 Hz updates never thrash React.
  React.useEffect(() => {
    const ws = new WebSocket('wss://telemetry.example/attitude');
    ws.onmessage = (e) => {
      const { roll, pitch, yaw } = JSON.parse(e.data); // radians, NED
      source.push({ roll, pitch, yaw });
    };
    return () => ws.close();
  }, [source]);

  // Push status changes from anywhere:
  // controller.setStatus('motor_fl', 'error');

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ModelViewer
        modelUrl="/model.glb"
        manifest={MANIFEST}
        controller={controller}
        orientationSource={source}
        convention={NED}
      />
    </div>
  );
}
```

## Asset preparation (one-off, offline)

Every downstream feature keys on the node names in the `.glb`, so prepare the
asset carefully:

1. **Tessellate the source CAD to glTF (`.glb`)** — FreeCAD export, a Node
   script using `occt-import-js`, or Blender.
2. **Enforce a node naming convention before export.** Use `<type>_<position>`
   or `<subsystem>_<part>` (`motor_fl`, `esc_fr`, `gps`, `battery`, …). These
   names must match the manifest ids exactly.
3. **Normalise orientation and scale in the asset, not in code.** Bake the
   canonical forward/up axes into the export.
4. **Compress** with `gltf-pipeline` or `gltfpack` (Draco / meshopt).
5. **Verify the graph survived** — load the `.glb` and log the scene hierarchy;
   confirm your names are present.

Converting a fixed asset to glTF once, offline, keeps the multi-MB OpenCascade
WASM bundle out of your runtime entirely. Only add `occt-import-js` if users
genuinely upload their own STEP/IGES files.

## Architecture

The camera orbits the world; **the model rotates within it** — the viewer sees
the object move against a fixed reference frame (a drone banking against a
stationary horizon), never a camera trick.

| Concern | Where it lives |
|---|---|
| Coordinate conversion | `sourceToThree()` — the single source of truth, unit-tested against known orientations. Conventions: `NED` (default), `THREE_NATIVE`. |
| Live orientation | `useOrientationSource()` — stores samples in a **ref** (read every frame in `useFrame`), with a subscription channel for low-frequency 2D consumers. |
| Status / visibility / selection | `useModelController()` — React state; layer toggles resolve to components via the manifest. |
| Scene | `Model`, `ModelScene`, `Lights`, `ReferenceFrame`, `CanvasErrorBoundary`. |
| UI shell | `ComponentTreePanel`, `SelectedComponentPanel`, `OrientationReadout`, `ConnectionIndicator`, `ArtificialHorizon`, `OrientationHarness` — all plain DOM built on foundations-core. |

### Orientation is smoothed frame-rate-independently

```ts
group.quaternion.slerp(target, 1 - Math.exp(-SMOOTHING * delta));
```

`1 - exp(-k·delta)` behaves identically at 30 fps and 144 fps. Tune `smoothing`
(default 12): higher is more responsive, lower hides jitter and dropped packets.

### Build orientation first, against the slider harness

`OrientationHarness` writes into the same `OrientationSource` as the real feed.
Validate the coordinate conversion against the sliders **before** wiring the
network — debugging an axis convention and network parsing simultaneously is far
harder than doing them separately. Set `showHarness` on `ModelViewer` to enable
it.

## Component API

- **`ModelViewer`** — batteries-included viewer (scene + full UI shell).
- **`ModelScene`** — bare `<Canvas>` scene (bring your own UI).
- **`Model`** — the glTF node; applies orientation, status highlight, visibility
  and selection. Clones materials per-mesh (shared glTF materials would
  otherwise colour every motor at once) and disposes them on unmount.
- **`useModelController(manifest)`** — status / visibility / selection state.
- **`useOrientationSource()`** — ref-based live orientation + subscription.
- **`sourceToThree()`**, **`NED`**, **`THREE_NATIVE`** — coordinate conversion.
- **`defineManifest()`** — author a manifest with full type inference.

## Highlighting

Status highlighting uses **emissive** (not base colour), which reads clearly
regardless of scene lighting; `warn`/`error` pulse via a sine wave in
`useFrame`. Hidden components can either disappear (`hiddenMode="hide"`) or drop
to a transparent **x-ray** material (`hiddenMode="xray"`) that retains spatial
context.

## Hardening

- Suspense boundary for model loading + an error boundary around the canvas.
- Stale-feed detection (`ConnectionIndicator`) — showing stale telemetry as live
  is the dangerous failure mode, so it is flagged prominently.
- Cloned materials are disposed on unmount to avoid leaking GPU memory across
  route changes.

## Local development

```bash
cd packages/3d-models
npm install
npm run fetch-demo-model   # downloads a sample model → public/model.glb
npm start                  # dev harness at localhost:3000
npm test                   # orientation conversion unit tests
npm run build
```

## Example models to drop in

The viewer renders any glTF `.glb`. On load the model is auto-centred and scaled
(`autoFrame`), so it frames correctly whatever units it was authored in, and the
orientation demo (rotation against the fixed grid) works for **any** model.

Component highlighting, per-component visibility and click-selection additionally
require the model's **node names to match a manifest**. The Khronos glTF sample
assets are a convenient source:

| Model | Parts | Good for | Raw `.glb` |
|---|---|---|---|
| **ToyCar** | `ToyCar`, `Fabric`, `Glass` | Full demo — highlight, visibility, selection | [download](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF-Binary/ToyCar.glb) |
| **DamagedHelmet** | single part | Orientation / rotation only | [download](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb) |
| **AntiqueCamera** | `camera`, `tripod` | Two-component demo | [download](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb) |

The dev harness ships a manifest for **ToyCar** (`toycar-manifest.ts`), so:

```bash
npm run fetch-demo-model            # ToyCar (default) — full-featured demo
MODEL=DamagedHelmet npm run fetch-demo-model   # orientation-only demo
```

then `npm start`. Use the **Inject faults** button to see the body/fabric/glass
highlight (error / warn / offline), the component tree to toggle visibility
(x-ray in the demo), and click a part to select it.

Demo `.glb` files are **not** committed (`.gitignore`d) — fetch them locally. To
wire a different model, add a manifest whose ids match its node names (verify
them by logging the scene graph, per Phase 0) and pass it to `ModelViewer`.

Without a model in `public/`, the canvas shows its error fallback while every
panel and the slider harness still work.

### Full-asset workflow

For your own CAD-derived asset, follow the asset-preparation steps above: bake
node names that match your manifest, normalise orientation/scale, compress, and
drop the resulting `.glb` in `public/` (or serve it from anywhere and pass its
URL as `modelUrl`).
