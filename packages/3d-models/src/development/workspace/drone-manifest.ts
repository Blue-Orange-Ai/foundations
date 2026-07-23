import { defineManifest } from '../../core/manifest';

/**
 * The drone running-example manifest. Component ids must match the node names
 * baked into `model.glb` during asset preparation. Layers group components for
 * the visibility UI.
 */
export const DRONE_MANIFEST = defineManifest({
	motor_fl: { label: 'Motor — Front Left', layer: 'propulsion', description: 'Front-left brushless motor.' },
	motor_fr: { label: 'Motor — Front Right', layer: 'propulsion', description: 'Front-right brushless motor.' },
	motor_rl: { label: 'Motor — Rear Left', layer: 'propulsion', description: 'Rear-left brushless motor.' },
	motor_rr: { label: 'Motor — Rear Right', layer: 'propulsion', description: 'Rear-right brushless motor.' },
	esc_fl: { label: 'ESC — Front Left', layer: 'propulsion', description: 'Front-left electronic speed controller.' },
	esc_fr: { label: 'ESC — Front Right', layer: 'propulsion', description: 'Front-right electronic speed controller.' },
	esc_rl: { label: 'ESC — Rear Left', layer: 'propulsion', description: 'Rear-left electronic speed controller.' },
	esc_rr: { label: 'ESC — Rear Right', layer: 'propulsion', description: 'Rear-right electronic speed controller.' },
	flight_controller: { label: 'Flight Controller', layer: 'avionics', description: 'Autopilot / IMU stack.' },
	gps: { label: 'GPS Module', layer: 'avionics', description: 'GNSS receiver and compass.' },
	battery: { label: 'Battery', layer: 'payload', description: 'Main LiPo battery pack.' },
	arm_fl: { label: 'Arm — Front Left', layer: 'frame' },
	arm_fr: { label: 'Arm — Front Right', layer: 'frame' },
	arm_rl: { label: 'Arm — Rear Left', layer: 'frame' },
	arm_rr: { label: 'Arm — Rear Right', layer: 'frame' },
});

export type DroneComponentId = keyof typeof DRONE_MANIFEST;
