// Public API for @blue-orange-ai/foundations-3d-models
//
// Import the icon font once in your app if you are not already doing so:
//   import 'remixicon/fonts/remixicon.css';

// --- Core: types, orientation math, hooks ---
export * from './core/types';
export * from './core/orientation';
export * from './core/statusTheme';
export * from './core/manifest';
export * from './core/useOrientationSource';
export * from './core/useModelController';

// --- Scene ---
export * from './components/model-viewer/Model';
export * from './components/model-viewer/ModelScene';
export * from './components/model-viewer/ModelViewer';
export * from './components/model-viewer/Lights';
export * from './components/model-viewer/ReferenceFrame';
export * from './components/model-viewer/CanvasErrorBoundary';
export * from './components/model-viewer/sceneUtils';

// --- UI shell panels ---
export * from './components/panels/StatusDot';
export * from './components/panels/ComponentTreePanel';
export * from './components/panels/SelectedComponentPanel';
export * from './components/panels/OrientationReadout';
export * from './components/panels/ConnectionIndicator';

// --- Instruments & harness ---
export * from './components/instruments/ArtificialHorizon';
export * from './components/harness/OrientationHarness';
