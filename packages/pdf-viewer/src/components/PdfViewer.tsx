/**
 * Foundations PDF Viewer.
 *
 * A headless-powered PDF viewer that wraps the @embedpdf/* engine and plugins
 * and renders its chrome entirely from `@blue-orange-ai/foundations-core`
 * components. Everything is exposed through props, callbacks and an imperative
 * handle ({@link PdfViewerApi}).
 *
 * @example
 * ```tsx
 * const ref = useRef<PdfViewerApi>(null);
 * <PdfViewer
 *   ref={ref}
 *   src="https://example.com/file.pdf"
 *   initialZoom="fit-width"
 *   onTextSelected={(s) => console.log(s.text, s.pages, s.rects)}
 * />
 * // ref.current?.goToPage(3); ref.current?.highlightSelection();
 * ```
 */
import React, { forwardRef, useEffect, useMemo, useState } from 'react';

import { usePdfiumEngine } from '@embedpdf/engines/react';
import { EmbedPDF } from '@embedpdf/core/react';

import '../components/PdfViewer.css';
import type { PdfTheme, PdfViewerApi, PdfViewerProps } from '../types';
import { resolveConfig } from '../internal/context';
import { buildPlugins } from '../internal/plugins';
import { PdfInner } from '../internal/PdfInner';

/**
 * Config keys that only affect the viewer chrome (not plugin registration).
 * They are stripped from the plugin-memo signature so toggling them — e.g.
 * flipping the theme — never tears down and rebuilds the engine/document.
 */
const UI_ONLY_CONFIG_KEYS = new Set([
	'theme',
	'showToolbar',
	'showSidePanel',
	'showPageControls',
	'showZoomControls',
	'showSpreadControls',
	'showHistoryControls',
	'defaultSidePanelTab',
	'defaultSidePanelOpen',
]);

/** Resolve `theme` to a concrete 'light' | 'dark', following the OS on 'auto'. */
const useResolvedTheme = (theme: PdfTheme): 'light' | 'dark' => {
	const systemDark = (): boolean =>
		typeof window !== 'undefined' &&
		!!window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches;

	const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
		systemDark() ? 'dark' : 'light',
	);

	useEffect(() => {
		if (theme !== 'auto' || typeof window === 'undefined' || !window.matchMedia) {
			return;
		}
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => setSystemTheme(mq.matches ? 'dark' : 'light');
		handler();
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, [theme]);

	return theme === 'auto' ? systemTheme : theme;
};

export const PdfViewer = forwardRef<PdfViewerApi, PdfViewerProps>((props, ref) => {
	const config = resolveConfig(props);
	const resolvedTheme = useResolvedTheme(config.theme);

	const { engine, isLoading, error } = usePdfiumEngine({
		wasmUrl: props.wasmUrl,
		worker: props.worker ?? true,
		fontFallback: props.disableFontFallback ? null : undefined,
	});

	// The plugin set must stay referentially stable across renders: <EmbedPDF>
	// destroys and rebuilds its entire PluginRegistry (unloading the active
	// document) whenever the `plugins` array identity changes. Callers pass inline
	// callbacks, so `props` — and therefore `config` — gets a new identity on every
	// parent render (e.g. onPageChange firing during scroll). Key the memo on the
	// plugin-affecting config *values* instead, so plugins only rebuild when a value
	// that actually affects registration changes (never on a theme/chrome toggle).
	const configSignature = JSON.stringify(config, (key, value) =>
		UI_ONLY_CONFIG_KEYS.has(key) ? undefined : value,
	);
	const plugins = useMemo(
		() => buildPlugins(config),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[configSignature],
	);

	// `dark` follows the foundation-system convention: a `.dark` ancestor class
	// switches every core component (and this viewer's own chrome) to dark mode.
	const rootClass = [
		'blue-orange-pdf-viewer',
		resolvedTheme === 'dark' ? 'dark' : '',
		props.className,
	]
		.filter(Boolean)
		.join(' ');
	const rootStyle: React.CSSProperties = { height: '100%', ...props.style };

	return (
		<div className={rootClass} style={rootStyle}>
			{error ? (
				<div className="blue-orange-pdf-status blue-orange-pdf-status-error">
					<i className="ri-error-warning-line" style={{ fontSize: 32 }} />
					<span>Failed to initialise the PDF engine: {error.message}</span>
				</div>
			) : isLoading || !engine ? (
				<div className="blue-orange-pdf-status">
					<i className="ri-loader-4-line" style={{ fontSize: 28 }} />
					<span>Loading PDF engine…</span>
				</div>
			) : (
				<EmbedPDF engine={engine} plugins={plugins}>
					<PdfInner props={props} engine={engine} externalRef={ref} />
				</EmbedPDF>
			)}
		</div>
	);
});

PdfViewer.displayName = 'PdfViewer';
