/**
 * Renders the actual pages: a scrollable viewport with a virtualized scroller,
 * and — per page — the render/tiling raster plus the optional interactive
 * layers (search highlight, text selection, annotations + form widgets).
 */
import React from 'react';

import { Viewport } from '@embedpdf/plugin-viewport/react';
import { Scroller } from '@embedpdf/plugin-scroll/react';
import { ZoomGestureWrapper } from '@embedpdf/plugin-zoom/react';
import { RenderLayer } from '@embedpdf/plugin-render/react';
import { TilingLayer } from '@embedpdf/plugin-tiling/react';
import { SearchLayer } from '@embedpdf/plugin-search/react';
import { SelectionLayer } from '@embedpdf/plugin-selection/react';
import { AnnotationLayer } from '@embedpdf/plugin-annotation/react';
import { formRenderers } from '@embedpdf/plugin-form/react';
import {
	GlobalPointerProvider,
	PagePointerProvider,
} from '@embedpdf/plugin-interaction-manager/react';

import { usePdfViewerContext } from './context';

const fill: React.CSSProperties = { position: 'absolute', inset: 0 };

export const PdfDocumentView: React.FC = () => {
	const { documentId, config } = usePdfViewerContext();
	if (!documentId) return null;

	return (
		<Viewport documentId={documentId} className="blue-orange-pdf-viewport">
			<GlobalPointerProvider documentId={documentId}>
				<ZoomGestureWrapper
					documentId={documentId}
					enablePinch={config.enablePinchZoom}
					enableWheel={config.enableWheelZoom}
				>
					<Scroller
						documentId={documentId}
						renderPage={({ pageIndex, width, height }) => (
							<div
								className="blue-orange-pdf-page"
								style={{ width, height }}
							>
								<PagePointerProvider
									documentId={documentId}
									pageIndex={pageIndex}
									style={fill}
								>
									<RenderLayer
										documentId={documentId}
										pageIndex={pageIndex}
										style={fill}
									/>
									<TilingLayer
										documentId={documentId}
										pageIndex={pageIndex}
										style={fill}
									/>
									{config.enableSearch && (
										<SearchLayer
											documentId={documentId}
											pageIndex={pageIndex}
											style={fill}
										/>
									)}
									{config.enableSelection && (
										<SelectionLayer
											documentId={documentId}
											pageIndex={pageIndex}
										/>
									)}
									{(config.enableAnnotations ||
										config.enableForms) && (
										<AnnotationLayer
											documentId={documentId}
											pageIndex={pageIndex}
											style={fill}
											annotationRenderers={
												config.enableForms
													? formRenderers
													: undefined
											}
										/>
									)}
								</PagePointerProvider>
							</div>
						)}
					/>
				</ZoomGestureWrapper>
			</GlobalPointerProvider>
		</Viewport>
	);
};
