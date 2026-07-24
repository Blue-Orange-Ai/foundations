/**
 * Side panel container. Shows the thumbnails, outline or search panel depending
 * on the active tab, with a small header (title + close) built from core.
 */
import React from 'react';
import { ButtonIcon, ButtonSize } from '@blue-orange-ai/foundations-core';

import { usePdfViewerContext } from './context';
import { PdfThumbnailPanel } from './PdfThumbnailPanel';
import { PdfOutlinePanel } from './PdfOutlinePanel';
import { PdfSearchPanel } from './PdfSearchPanel';

const titles: Record<string, string> = {
	thumbnails: 'Pages',
	outline: 'Outline',
	search: 'Search',
};

export const PdfSidePanel: React.FC = () => {
	const { activeSidePanelTab, setSidePanelOpen, config } = usePdfViewerContext();

	return (
		<div className="blue-orange-pdf-side-panel">
			<div className="blue-orange-pdf-side-panel-header">
				<span>{titles[activeSidePanelTab]}</span>
				<ButtonIcon
					icon="ri-close-line"
					label="Close panel"
					size={ButtonSize.SMALL}
					onClick={() => setSidePanelOpen(false)}
				/>
			</div>
			<div className="blue-orange-pdf-side-panel-body">
				{activeSidePanelTab === 'thumbnails' && config.enableThumbnails && (
					<PdfThumbnailPanel />
				)}
				{activeSidePanelTab === 'outline' && config.enableOutline && <PdfOutlinePanel />}
				{activeSidePanelTab === 'search' && config.enableSearch && <PdfSearchPanel />}
			</div>
		</div>
	);
};
