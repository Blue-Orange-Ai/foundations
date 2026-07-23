import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Single source of truth for coordinate convention.
//
// Orientation bugs are the classic time sink of a project like this, and they
// are far easier to diagnose when the conversion lives in exactly one place.
// Everything that turns an incoming (roll, pitch, yaw) sample into a three.js
// orientation goes through `sourceToThree`. When something looks wrong on
// screen, there is exactly one function to inspect and one set of unit tests to
// consult.
// ---------------------------------------------------------------------------

/** An orientation sample in the source convention. Angles are in **radians**. */
export interface Orientation {
	roll: number;
	pitch: number;
	yaw: number;
}

/**
 * Describes how the incoming (roll, pitch, yaw) triple maps onto three.js's
 * Y-up, right-handed world. A convention is the combination of:
 *
 *  - the Euler order used to assemble the source-frame rotation, and
 *  - a fixed basis-change quaternion that carries the source frame's axes onto
 *    three.js's axes.
 *
 * There are no per-axis sign flips scattered through the code — the sign of a
 * convention lives entirely in its `basis`.
 */
export interface OrientationConvention {
	/** Euler order used to build the rotation in the source frame. */
	eulerOrder: THREE.EulerOrder;
	/** Fixed quaternion mapping source-frame axes onto three.js axes. */
	basis: THREE.Quaternion;
}

/**
 * Basis change from a NED (North-East-Down) aerospace frame to three.js.
 *
 * NED, as used by ArduPilot / MAVLink:
 *   +X = North (forward), +Y = East (right), +Z = Down.
 *   roll about the forward axis, pitch about the right axis, yaw about down.
 *
 * three.js is Y-up and right-handed, with the camera looking down -Z, so:
 *   forward (away from camera) = -Z, right = +X, up = +Y.
 *
 * The columns of this basis are the images of the NED axes expressed in
 * three.js coordinates: North → -Z, East → +X, Down → -Y. The result is a
 * proper rotation (determinant +1), so it is representable as a quaternion.
 */
export const NED_TO_THREE: THREE.Quaternion = new THREE.Quaternion().setFromRotationMatrix(
	new THREE.Matrix4().makeBasis(
		new THREE.Vector3(0, 0, -1), // North (forward) → three -Z
		new THREE.Vector3(1, 0, 0),  // East  (right)   → three +X
		new THREE.Vector3(0, -1, 0), // Down            → three -Y
	),
);

/**
 * Aerospace / NED convention: yaw-pitch-roll (ZYX) intrinsic angles in a NED
 * frame, carried onto three.js. This is the sensible default for a flight
 * controller feed (drone, plane, gimbal).
 */
export const NED: OrientationConvention = {
	eulerOrder: 'ZYX',
	basis: NED_TO_THREE,
};

/**
 * Identity convention: the source already speaks three.js's language (Y-up,
 * right-handed) and supplies angles in XYZ order. Useful when the upstream
 * system was authored against three.js directly, or for the slider harness.
 */
export const THREE_NATIVE: OrientationConvention = {
	eulerOrder: 'XYZ',
	basis: new THREE.Quaternion(), // identity
};

// Scratch objects reused across calls so the hot path allocates nothing.
const _euler = new THREE.Euler();
const _source = new THREE.Quaternion();
const _basisInverse = new THREE.Quaternion();

/**
 * Convert a source-convention orientation into a three.js world quaternion.
 *
 * Steps:
 *   1. Build the rotation in the source frame from the raw angles.
 *   2. Conjugate it by the fixed basis change to re-express the *same physical
 *      rotation* in three.js's frame: `q_three = B · q_source · B⁻¹`.
 *
 * @param roll   radians, source convention
 * @param pitch  radians, source convention
 * @param yaw    radians, source convention
 * @param convention  coordinate convention of the source (defaults to NED)
 * @param target optional quaternion to write into (avoids allocation)
 */
export function sourceToThree(
	roll: number,
	pitch: number,
	yaw: number,
	convention: OrientationConvention = NED,
	target: THREE.Quaternion = new THREE.Quaternion(),
): THREE.Quaternion {
	// 1. Rotation in the source frame.
	_euler.set(roll, pitch, yaw, convention.eulerOrder);
	_source.setFromEuler(_euler);

	// 2. Change of basis: q_three = B · q_source · B⁻¹.
	_basisInverse.copy(convention.basis).invert();
	target.copy(convention.basis).multiply(_source).multiply(_basisInverse);
	return target;
}

/** Convenience overload accepting an {@link Orientation} object. */
export function orientationToThree(
	orientation: Orientation,
	convention: OrientationConvention = NED,
	target?: THREE.Quaternion,
): THREE.Quaternion {
	return sourceToThree(orientation.roll, orientation.pitch, orientation.yaw, convention, target);
}

/** Radians → degrees. */
export function toDegrees(radians: number): number {
	return (radians * 180) / Math.PI;
}

/** Degrees → radians. */
export function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}
