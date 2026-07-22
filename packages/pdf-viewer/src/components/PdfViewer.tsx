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
import React, { forwardRef, useMemo } from 'react';

import { usePdfiumEngine } from '@embedpdf/engines/react';
import { EmbedPDF } from '@embedpdf/core/react';

import '../components/PdfViewer.css';
import type { PdfViewerApi, PdfViewerProps } from '../types';
import { resolveConfig } from '../internal/context';
import { buildPlugins } from '../internal/plugins';
import { PdfInner } from '../internal/PdfInner';

export const PdfViewer = forwardRef<PdfViewerApi, PdfViewerProps>((props, ref) => {
	const config = useMemo(() => resolveConfig(props), [props]);

	const { engine, isLoading, error } = usePdfiumEngine({
		wasmUrl: props.wasmUrl,
		worker: props.worker ?? true,
		fontFallback: props.disableFontFallback ? null : undefined,
	});

	const plugins = useMemo(() => buildPlugins(config), [config]);

	const rootClass = ['blue-orange-pdf-viewer', props.className].filter(Boolean).join(' ');
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
