// @ts-ignore
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IframeCanvas } from '../iframe-canvas/IframeCanvas';
import {
    DEFAULT_DEVICE_PRESETS,
    DevicePreset,
} from './devicePresets';
import './ResponsivePreview.css';

export interface ResponsivePreviewProps {
    /** The component to preview inside the resizable viewport. */
    children?: React.ReactNode;
    /** Override the built-in device presets. */
    presets?: DevicePreset[];
    /** Id of the preset to start on. Defaults to the first preset. */
    initialDeviceId?: string;
    /** Optional heading shown on the left of the toolbar. */
    title?: string;
}

const CUSTOM_ID = 'custom';
const ZOOM_STEPS = [100, 75, 50, 25];

/**
 * A Chrome-DevTools-style responsive preview harness. Renders `children` inside
 * an isolated iframe viewport (see {@link IframeCanvas}) with a toolbar to pick
 * device presets, type exact dimensions, rotate, zoom, and toggle dark mode.
 *
 * Because the content lives in an iframe, changing the width/height genuinely
 * re-triggers the component's CSS `@media` queries — the same behaviour you get
 * from a real device, which resizing a `<div>` cannot reproduce.
 */
export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
    children,
    presets = DEFAULT_DEVICE_PRESETS,
    initialDeviceId,
    title,
}) => {
    const initial = useMemo(
        () =>
            presets.find((p) => p.id === initialDeviceId) ?? presets[0],
        [presets, initialDeviceId]
    );

    const [deviceId, setDeviceId] = useState<string>(initial?.id ?? CUSTOM_ID);
    const [width, setWidth] = useState<number | null>(initial?.width ?? null);
    const [height, setHeight] = useState<number | null>(initial?.height ?? null);
    const [zoomMode, setZoomMode] = useState<'fit' | number>('fit');
    const [fitZoom, setFitZoom] = useState<number>(1);
    const [dark, setDark] = useState<boolean>(false);

    const paneRef = useRef<HTMLDivElement>(null);
    const responsive = width == null || height == null;

    const selectPreset = (preset: DevicePreset) => {
        setDeviceId(preset.id);
        setWidth(preset.width);
        setHeight(preset.height);
    };

    const applyDimension = (axis: 'width' | 'height', raw: string) => {
        const value = raw === '' ? null : Math.max(0, Math.round(Number(raw)));
        if (raw !== '' && Number.isNaN(value)) {
            return;
        }
        setDeviceId(CUSTOM_ID);
        if (axis === 'width') {
            setWidth(value);
            if (height == null) {
                setHeight(768);
            }
        } else {
            setHeight(value);
            if (width == null) {
                setWidth(1024);
            }
        }
    };

    const rotate = () => {
        if (responsive) {
            return;
        }
        setWidth(height);
        setHeight(width);
        setDeviceId(CUSTOM_ID);
    };

    // Recompute the "fit" zoom whenever the pane or logical size changes.
    useEffect(() => {
        if (zoomMode !== 'fit' || responsive) {
            return;
        }
        const pane = paneRef.current;
        if (!pane) {
            return;
        }

        const recompute = () => {
            const availableW = pane.clientWidth - 48;
            const availableH = pane.clientHeight - 48;
            if (!width || !height || availableW <= 0 || availableH <= 0) {
                setFitZoom(1);
                return;
            }
            setFitZoom(
                Math.min(availableW / width, availableH / height, 1)
            );
        };

        recompute();
        if (typeof ResizeObserver === 'undefined') {
            return;
        }
        const observer = new ResizeObserver(recompute);
        observer.observe(pane);
        return () => observer.disconnect();
    }, [zoomMode, responsive, width, height]);

    const effectiveZoom = responsive
        ? 1
        : zoomMode === 'fit'
          ? fitZoom
          : zoomMode / 100;

    const zoomLabel =
        zoomMode === 'fit'
            ? `Fit (${Math.round(effectiveZoom * 100)}%)`
            : `${zoomMode}%`;

    return (
        <div className={`bo-responsive-preview${dark ? ' dark' : ''}`}>
            <div className="bo-rp-toolbar">
                {title && <span className="bo-rp-title">{title}</span>}

                <div className="bo-rp-devices">
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            title={preset.label}
                            aria-pressed={deviceId === preset.id}
                            className={`bo-rp-device-btn${
                                deviceId === preset.id ? ' active' : ''
                            }`}
                            onClick={() => selectPreset(preset)}
                        >
                            <i className={preset.icon}></i>
                            <span>{preset.label}</span>
                        </button>
                    ))}
                </div>

                <div className="bo-rp-dimensions">
                    <input
                        type="number"
                        className="bo-rp-dim-input"
                        aria-label="Width"
                        placeholder="W"
                        value={width ?? ''}
                        onChange={(e) => applyDimension('width', e.target.value)}
                    />
                    <button
                        type="button"
                        className="bo-rp-icon-btn"
                        title="Rotate"
                        aria-label="Rotate"
                        disabled={responsive}
                        onClick={rotate}
                    >
                        <i className="ri-swap-line"></i>
                    </button>
                    <input
                        type="number"
                        className="bo-rp-dim-input"
                        aria-label="Height"
                        placeholder="H"
                        value={height ?? ''}
                        onChange={(e) => applyDimension('height', e.target.value)}
                    />
                </div>

                <div className="bo-rp-spacer"></div>

                <div className="bo-rp-zoom">
                    <i className="ri-zoom-in-line"></i>
                    <select
                        className="bo-rp-zoom-select"
                        aria-label="Zoom"
                        value={zoomMode === 'fit' ? 'fit' : String(zoomMode)}
                        disabled={responsive}
                        onChange={(e) =>
                            setZoomMode(
                                e.target.value === 'fit'
                                    ? 'fit'
                                    : Number(e.target.value)
                            )
                        }
                    >
                        <option value="fit">{zoomLabel}</option>
                        {ZOOM_STEPS.map((z) => (
                            <option key={z} value={z}>
                                {z}%
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    className={`bo-rp-icon-btn${dark ? ' active' : ''}`}
                    title={dark ? 'Switch to light' : 'Switch to dark'}
                    aria-label="Toggle dark mode"
                    aria-pressed={dark}
                    onClick={() => setDark((d) => !d)}
                >
                    <i className={dark ? 'ri-sun-line' : 'ri-moon-line'}></i>
                </button>

                <span className="bo-rp-readout">
                    {responsive
                        ? 'Responsive'
                        : `${width} × ${height}`}
                </span>
            </div>

            <div className="bo-rp-pane" ref={paneRef}>
                <IframeCanvas
                    width={width}
                    height={height}
                    zoom={effectiveZoom}
                    dark={dark}
                >
                    {children}
                </IframeCanvas>
            </div>
        </div>
    );
};
