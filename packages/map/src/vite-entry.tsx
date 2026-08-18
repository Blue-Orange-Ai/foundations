export { BlueOrangeMapWrapper } from './components/map/BlueOrangeMapWrapper';
export type { BlueOrangeMapHandle, BlueOrangeMapWrapperProps } from './components/map/BlueOrangeMapWrapper';

// ---------------------------------------------------------------------------
// Re-export the primitives map public API so consumers of
// @blue-orange-ai/foundations-map can describe markers, shapes, tracks, arcs,
// arrows and groups without taking a direct dependency on the primitives
// package. The map is driven imperatively through BlueOrangeMapHandle, so
// everything below is type-only (erased at build time).
// ---------------------------------------------------------------------------

export type {
	BlueOrangeMapOptions,
	BlueOrangeMapOptionsMarkers,
	BlueOrangeMapOptionsDefaultMarker,
	BlueOrangeMapShapePopupsOptions,
	BlueOrangeMapColors,
	BlueOrangeMapColorTriple,
	BlueOrangeMapDefaultMarker,
	BlueOrangeMapLayer,
	BlueOrangeMapControlItems,
	BlueOrangeMapControl,
	BlueOrangeMapMarker,
	BlueOrangeMapPopUp,
	BlueOrangeMapOffset,
	BlueOrangeMapShape,
	BlueOrangeMapTrack,
	BlueOrangeMapTrackDisplay,
	BlueOrangeMapTrackLine,
	BlueOrangeMapObservations,
	BlueOrangeMapGeoPoint,
	BlueOrangeMapState,
	BlueOrangeMapVisibleCoordinates,
	BlueOrangeMapSelectedObjects,
	BlueOrangeMapGroup,
	BlueOrangeMapGroupObjects,
	BlueOrangeMapCreateArcOptions,
	BlueOrangeMapCreateArrowOptions,
} from "@blue-orange-ai/primitives-map";
