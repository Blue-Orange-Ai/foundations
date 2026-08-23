/**
 * Builds the @embedpdf plugin registration list from the resolved viewer
 * configuration. Plugins are only registered when the corresponding feature is
 * enabled, keeping the runtime lean.
 */
import {
	createPluginRegistration,
	type PluginBatchRegistrations,
} from '@embedpdf/core';

import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager';
import { ViewportPluginPackage } from '@embedpdf/plugin-viewport';
import { ScrollPluginPackage } from '@embedpdf/plugin-scroll';
import { RenderPluginPackage } from '@embedpdf/plugin-render';
import { TilingPluginPackage } from '@embedpdf/plugin-tiling';
import { ZoomPluginPackage } from '@embedpdf/plugin-zoom';
import { RotatePluginPackage } from '@embedpdf/plugin-rotate';
import { SpreadPluginPackage } from '@embedpdf/plugin-spread';
import { PanPluginPackage } from '@embedpdf/plugin-pan';
import { DocumentManagerPluginPackage } from '@embedpdf/plugin-document-manager';
import { SelectionPluginPackage } from '@embedpdf/plugin-selection';
import { AnnotationPluginPackage } from '@embedpdf/plugin-annotation';
import { FormPluginPackage } from '@embedpdf/plugin-form';
import { SignaturePluginPackage, SignatureMode } from '@embedpdf/plugin-signature';
import { HistoryPluginPackage } from '@embedpdf/plugin-history';
import { SearchPluginPackage } from '@embedpdf/plugin-search';
import { BookmarkPluginPackage } from '@embedpdf/plugin-bookmark';
import { ThumbnailPluginPackage } from '@embedpdf/plugin-thumbnail';
import { ExportPluginPackage } from '@embedpdf/plugin-export';
import { PrintPluginPackage } from '@embedpdf/plugin-print';

import type { ResolvedConfig } from './context';
import {
	toZoomLevel,
	toRotation,
	toSpreadMode,
	toScrollStrategy,
} from './mappings';

export const buildPlugins = (config: ResolvedConfig) => {
	const needsSelection =
		config.enableSelection || config.enableAnnotations || config.enableSignatures;
	const needsAnnotation = config.enableAnnotations || config.enableSignatures;
	const needsHistory =
		config.enableAnnotations || config.enableForms || config.enableSignatures;

	const plugins: PluginBatchRegistrations = [
		createPluginRegistration(InteractionManagerPluginPackage, {}),
		createPluginRegistration(DocumentManagerPluginPackage, {}),
		createPluginRegistration(ViewportPluginPackage, { viewportGap: 12 }),
		createPluginRegistration(ScrollPluginPackage, {
			defaultStrategy: toScrollStrategy(config.scrollMode),
			defaultPageGap: 12,
		}),
		createPluginRegistration(RenderPluginPackage, {
			withAnnotations: config.enableAnnotations,
			withForms: config.enableForms,
		}),
		createPluginRegistration(TilingPluginPackage, {
			tileSize: 768,
			overlapPx: 2.5,
			extraRings: 1,
		}),
		createPluginRegistration(ZoomPluginPackage, {
			defaultZoomLevel: toZoomLevel(config.initialZoom),
			minZoom: config.minZoom,
			maxZoom: config.maxZoom,
			zoomStep: config.zoomStep,
		}),
		createPluginRegistration(SpreadPluginPackage, {
			defaultSpreadMode: toSpreadMode(config.initialSpread),
		}),
	];

	if (config.enableRotation) {
		plugins.push(
			createPluginRegistration(RotatePluginPackage, {
				defaultRotation: toRotation(config.initialRotation),
			}),
		);
	}

	if (config.enablePan) {
		plugins.push(createPluginRegistration(PanPluginPackage, {}));
	}

	if (needsSelection) {
		plugins.push(createPluginRegistration(SelectionPluginPackage, {}));
	}

	if (needsAnnotation) {
		plugins.push(createPluginRegistration(AnnotationPluginPackage, {}));
	}

	if (config.enableForms) {
		plugins.push(createPluginRegistration(FormPluginPackage, {}));
	}

	if (config.enableSignatures) {
		plugins.push(
			createPluginRegistration(SignaturePluginPackage, {
				mode: SignatureMode.SignatureAndInitials,
			}),
		);
	}

	if (needsHistory) {
		plugins.push(createPluginRegistration(HistoryPluginPackage, {}));
	}

	if (config.enableSearch) {
		plugins.push(createPluginRegistration(SearchPluginPackage, {}));
	}

	if (config.enableOutline) {
		plugins.push(createPluginRegistration(BookmarkPluginPackage, {}));
	}

	if (config.enableThumbnails || config.enablePageReorder) {
		plugins.push(
			createPluginRegistration(ThumbnailPluginPackage, {
				width: 140,
				gap: 12,
			}),
		);
	}

	if (config.enableDownload) {
		plugins.push(
			createPluginRegistration(ExportPluginPackage, {
				defaultFileName: config.fileName,
			}),
		);
	}

	if (config.enablePrint) {
		plugins.push(createPluginRegistration(PrintPluginPackage, {}));
	}

	return plugins;
};
