export interface DevicePreset {
    /** Stable identifier used for selection state. */
    id: string;
    /** Human readable label shown in the toolbar. */
    label: string;
    /** Remixicon class for the toolbar button (e.g. "ri-smartphone-line"). */
    icon: string;
    /** Viewport width in CSS pixels. `null` means "free / fill the pane". */
    width: number | null;
    /** Viewport height in CSS pixels. `null` means "free / fill the pane". */
    height: number | null;
}

/**
 * Default device presets covering the common responsive breakpoints.
 *
 * These are intentionally opinionated defaults — the library exposes no
 * breakpoint system of its own, so the preview tool defines its own set. Pass a
 * `presets` prop to {@link ResponsivePreview} to override them.
 */
export const DEFAULT_DEVICE_PRESETS: DevicePreset[] = [
    { id: "responsive", label: "Responsive", icon: "ri-fullscreen-line", width: null, height: null },
    { id: "mobile-s", label: "Mobile S", icon: "ri-smartphone-line", width: 320, height: 568 },
    { id: "mobile-l", label: "Mobile L", icon: "ri-smartphone-line", width: 414, height: 896 },
    { id: "tablet", label: "Tablet", icon: "ri-tablet-line", width: 768, height: 1024 },
    { id: "laptop", label: "Laptop", icon: "ri-macbook-line", width: 1366, height: 768 },
    { id: "desktop", label: "Desktop", icon: "ri-computer-line", width: 1920, height: 1080 },
];
