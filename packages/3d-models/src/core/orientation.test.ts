import * as THREE from 'three';
import { NED, THREE_NATIVE, sourceToThree, toRadians, toDegrees } from './orientation';

// The model's canonical forward and up axes, per the asset-preparation
// convention documented in the README (nose along three -Z after conversion,
// up along +Y). We assert on where these axes point after a rotation rather
// than on raw quaternion components, so the tests are independent of
// quaternion double-cover sign.
const FORWARD = new THREE.Vector3(0, 0, -1);
const UP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);

function forwardAfter(q: THREE.Quaternion): THREE.Vector3 {
	return FORWARD.clone().applyQuaternion(q);
}
function upAfter(q: THREE.Quaternion): THREE.Vector3 {
	return UP.clone().applyQuaternion(q);
}

function expectVectorClose(a: THREE.Vector3, b: THREE.Vector3): void {
	expect(a.x).toBeCloseTo(b.x, 5);
	expect(a.y).toBeCloseTo(b.y, 5);
	expect(a.z).toBeCloseTo(b.z, 5);
}

describe('sourceToThree (NED convention)', () => {
	test('level flight leaves forward and up unchanged', () => {
		const q = sourceToThree(0, 0, 0, NED);
		expectVectorClose(forwardAfter(q), FORWARD);
		expectVectorClose(upAfter(q), UP);
	});

	test('heading east (yaw +90°) points the nose to three +X', () => {
		const q = sourceToThree(0, 0, toRadians(90), NED);
		// East is three +X. Up is preserved for a level heading change.
		expectVectorClose(forwardAfter(q), RIGHT);
		expectVectorClose(upAfter(q), UP);
	});

	test('nose up (pitch +90°) points forward toward world up', () => {
		const q = sourceToThree(0, toRadians(90), 0, NED);
		expectVectorClose(forwardAfter(q), UP);
	});

	test('90° roll right keeps the nose forward and banks up to the right', () => {
		const q = sourceToThree(toRadians(90), 0, 0, NED);
		// Rolling right about the forward axis must not move the nose...
		expectVectorClose(forwardAfter(q), FORWARD);
		// ...and rolls the up vector onto the right (+X).
		expectVectorClose(upAfter(q), RIGHT);
	});

	test('produces a normalised quaternion', () => {
		const q = sourceToThree(toRadians(30), toRadians(-15), toRadians(200), NED);
		expect(q.length()).toBeCloseTo(1, 6);
	});

	test('writes into the provided target and returns it', () => {
		const target = new THREE.Quaternion();
		const result = sourceToThree(0.1, 0.2, 0.3, NED, target);
		expect(result).toBe(target);
	});
});

describe('sourceToThree (three-native convention)', () => {
	test('level is identity', () => {
		const q = sourceToThree(0, 0, 0, THREE_NATIVE);
		expect(q.x).toBeCloseTo(0, 6);
		expect(q.y).toBeCloseTo(0, 6);
		expect(q.z).toBeCloseTo(0, 6);
		expect(q.w).toBeCloseTo(1, 6);
	});
});

describe('angle helpers', () => {
	test('round-trips degrees ↔ radians', () => {
		expect(toDegrees(toRadians(137))).toBeCloseTo(137, 6);
	});
});
