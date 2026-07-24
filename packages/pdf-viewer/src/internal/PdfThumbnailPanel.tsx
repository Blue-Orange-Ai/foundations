/**
 * Thumbnail strip. Renders the virtualized thumbnail pane from
 * @embedpdf/plugin-thumbnail, highlights the current page, navigates on click,
 * and — when page reordering is enabled — lets the user drag a thumbnail to a
 * new position (which rebuilds the document at the engine level).
 */
import React, { useState } from 'react';

import { ThumbnailsPane, ThumbImg } from '@embedpdf/plugin-thumbnail/react';
import { useScroll } from '@embedpdf/plugin-scroll/react';

import { usePdfViewerContext } from './context';

export const PdfThumbnailPanel: React.FC = () => {
	const { documentId, config, apiRef } = usePdfViewerContext();
	const docId = documentId ?? '';
	const scroll = useScroll(docId);
	const currentPage = scroll.state?.currentPage ?? 1;

	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [overIndex, setOverIndex] = useState<number | null>(null);

	if (!documentId) return null;

	const reorderEnabled = config.enablePageReorder;

	const handleDrop = (targetIndex: number) => {
		if (dragIndex !== null && dragIndex !== targetIndex) {
			apiRef.current?.movePage(dragIndex, targetIndex);
		}
		setDragIndex(null);
		setOverIndex(null);
	};

	return (
		<div className="blue-orange-pdf-thumbnails">
			<ThumbnailsPane documentId={documentId} style={{ width: '100%' }}>
				{(meta) => {
					const isActive = meta.pageIndex + 1 === currentPage;
					const isDragging = dragIndex === meta.pageIndex;
					const isOver = overIndex === meta.pageIndex && dragIndex !== meta.pageIndex;
					return (
						<div
							key={meta.pageIndex}
							className={[
								'blue-orange-pdf-thumb',
								isActive ? 'is-active' : '',
								isDragging ? 'is-dragging' : '',
								isOver ? 'is-drop-target' : '',
							]
								.filter(Boolean)
								.join(' ')}
							style={{
								position: 'absolute',
								top: meta.top,
								left: '50%',
								transform: 'translateX(-50%)',
								width: meta.width,
								height: meta.wrapperHeight,
							}}
							draggable={reorderEnabled}
							onClick={() => scroll.provides?.scrollToPage({ pageNumber: meta.pageIndex + 1 })}
							onDragStart={() => reorderEnabled && setDragIndex(meta.pageIndex)}
							onDragOver={(e) => {
								if (!reorderEnabled) return;
								e.preventDefault();
								setOverIndex(meta.pageIndex);
							}}
							onDrop={(e) => {
								if (!reorderEnabled) return;
								e.preventDefault();
								handleDrop(meta.pageIndex);
							}}
							onDragEnd={() => {
								setDragIndex(null);
								setOverIndex(null);
							}}
						>
							<ThumbImg
								documentId={documentId}
								meta={meta}
								style={{ width: meta.width, height: meta.height, display: 'block' }}
							/>
							<span className="blue-orange-pdf-thumb-label">{meta.pageIndex + 1}</span>
						</div>
					);
				}}
			</ThumbnailsPane>
		</div>
	);
};
