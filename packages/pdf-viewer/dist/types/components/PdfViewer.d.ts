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
import React from 'react';
import '../components/PdfViewer.css';
import type { PdfViewerApi, PdfViewerProps } from '../types';
export declare const PdfViewer: React.ForwardRefExoticComponent<PdfViewerProps & React.RefAttributes<PdfViewerApi>>;
