// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// ---------------------------------------------------------------------------
// jsdom gaps
//
// The App smoke test mounts the real BlueOrangeMap (leaflet). Leaflet feature-
// detects SVG support with `svgCreate('svg').createSVGRect`, which jsdom does
// not implement, so without this shim leaflet concludes there is no renderer
// and crashes as soon as a vector shape (circle / polygon / polyline) is added.
// Installed only when genuinely missing so a real implementation is never
// clobbered.
// ---------------------------------------------------------------------------

const svgElementProto = (window as any).SVGSVGElement && (window as any).SVGSVGElement.prototype;
if (svgElementProto && !svgElementProto.createSVGRect) {
	svgElementProto.createSVGRect = function createSVGRect(): any {
		return {x: 0, y: 0, width: 0, height: 0};
	};
}
