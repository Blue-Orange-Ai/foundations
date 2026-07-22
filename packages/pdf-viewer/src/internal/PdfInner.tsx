/**
 * Everything that lives *inside* the <EmbedPDF> provider: the document loader,
 * the load/error watcher, the imperative controller, and the visual layout
 * (toolbar + side panel + document view + signature dialog + print/download
 * bridges).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';

import type { PdfEngine } from '@embedpdf/models';
import {
	useActiveDocument,
	useDocumentManagerCapability,
} from '@embedpdf/plugin-document-manager/react';
import { useDocumentState } from '@embedpdf/core/react';
import { PrintFrame } from '@embedpdf/plugin-print/react';
import { Download } from '@embedpdf/plugin-export/react';

import type { PdfViewerApi, PdfViewerProps, PdfSidePanelTab } from '../types';
import {
	PdfViewerProvider,
	resolveConfig,
	usePdfViewerContext,
	type PdfViewerContextValue,
} from './context';
import { usePdfViewerController } from './useController';
import { PdfToolbar } from './PdfToolbar';
import { PdfSidePanel } from './PdfSidePanel';
import { PdfDocumentView } from './PdfDocumentView';
import { PdfSignatureDialog } from './PdfSignatureDialog';

/* -------------------------------------------------------------------------- */
/*  Loader — opens the src / data source once the manager is ready            */
/* -------------------------------------------------------------------------- */
const PdfLoader: React.FC<{ props: PdfViewerProps }> = ({ props }) => {
	const documents = useDocumentManagerCapability();
	const lastSource = useRef<string | null>(null);

	useEffect(() => {
		const dm = documents.provides;
		if (!dm) return;
		const signature = props.src ?? (props.data ? `buffer:${props.data.byteLength}` : null);
		if (!signature || signature === lastSource.current) return;
		lastSource.current = signature;

		if (props.src) {
			dm.openDocumentUrl({
				url: props.src,
				name: props.fileName ?? props.src.split('/').pop() ?? 'document.pdf',
				password: props.password,
				autoActivate: true,
			});
		} else if (props.data) {
			dm.openDocumentBuffer({
				buffer: props.data,
				name: props.fileName ?? 'document.pdf',
				password: props.password,
				autoActivate: true,
			});
		}
	}, [documents.provides, props.src, props.data, props.fileName, props.password]);

	return null;
};

/* -------------------------------------------------------------------------- */
/*  Load / error watcher                                                      */
/* -------------------------------------------------------------------------- */
const PdfDocumentWatcher: React.FC<{ documentId: string; props: PdfViewerProps }> = ({
	documentId,
	props,
}) => {
	const state = useDocumentState(documentId);
	const firedFor = useRef<string | null>(null);

	useEffect(() => {
		if (!state) return;
		if (state.status === 'loaded' && firedFor.current !== documentId) {
			firedFor.current = documentId;
			props.onDocumentLoad?.({
				documentId,
				pageCount: state.document?.pageCount ?? 0,
				name: state.name,
				isEncrypted: state.document?.isEncrypted ?? false,
			});
		} else if (state.status === 'error' && firedFor.current !== `err:${documentId}`) {
			firedFor.current = `err:${documentId}`;
			props.onDocumentError?.(state.error ?? 'Failed to load document');
		}
	}, [state?.status, documentId]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
};

/* -------------------------------------------------------------------------- */
/*  Controller mount (headless)                                               */
/* -------------------------------------------------------------------------- */
const PdfController: React.FC<{
	documentId: string;
	engine: PdfEngine;
	setApi: (api: PdfViewerApi) => void;
}> = ({ documentId, engine, setApi }) => {
	const { props, setSignatureDialogOpen } = usePdfViewerContext();
	usePdfViewerController({
		documentId,
		engine,
		props,
		apiRef: setApi as unknown as Ref<PdfViewerApi>,
		openSignatureDialog: () => setSignatureDialogOpen(true),
	});
	return null;
};

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */
const PdfLayout: React.FC = () => {
	const { config, documentId, sidePanelOpen } = usePdfViewerContext();

	return (
		<>
			{config.showToolbar && <PdfToolbar />}
			<div className="blue-orange-pdf-body">
				{config.showSidePanel && sidePanelOpen && documentId && <PdfSidePanel />}
				<div className="blue-orange-pdf-document-area">
					{documentId ? (
						<PdfDocumentView />
					) : (
						<div className="blue-orange-pdf-status">
							<i className="ri-file-line" style={{ fontSize: 32 }} />
							<span>No document loaded</span>
						</div>
					)}
				</div>
			</div>
			<PdfSignatureDialog />
			{config.enablePrint && <PrintFrame />}
			{config.enableDownload && <Download />}
		</>
	);
};

/* -------------------------------------------------------------------------- */
/*  Inner root — builds the context, wires the document id                    */
/* -------------------------------------------------------------------------- */
export const PdfInner: React.FC<{
	props: PdfViewerProps;
	engine: PdfEngine;
	externalRef: Ref<PdfViewerApi>;
}> = ({ props, engine, externalRef }) => {
	const config = useMemo(() => resolveConfig(props), [props]);
	const { activeDocumentId } = useActiveDocument();

	const [sidePanelOpen, setSidePanelOpen] = useState(config.defaultSidePanelOpen);
	const [activeSidePanelTab, setActiveSidePanelTab] = useState<PdfSidePanelTab>(
		config.defaultSidePanelTab,
	);
	const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);

	const apiRef = useRef<PdfViewerApi | null>(null);
	const setApi = useCallback(
		(api: PdfViewerApi) => {
			apiRef.current = api;
			if (typeof externalRef === 'function') externalRef(api);
			else if (externalRef) (externalRef as { current: PdfViewerApi | null }).current = api;
		},
		[externalRef],
	);

	const contextValue = useMemo<PdfViewerContextValue>(
		() => ({
			config,
			props,
			documentId: activeDocumentId,
			apiRef,
			sidePanelOpen,
			setSidePanelOpen,
			activeSidePanelTab,
			setActiveSidePanelTab,
			signatureDialogOpen,
			setSignatureDialogOpen,
		}),
		[
			config,
			props,
			activeDocumentId,
			sidePanelOpen,
			activeSidePanelTab,
			signatureDialogOpen,
		],
	);

	return (
		<PdfViewerProvider value={contextValue}>
			<PdfLoader props={props} />
			{activeDocumentId && (
				<>
					<PdfDocumentWatcher documentId={activeDocumentId} props={props} />
					<PdfController documentId={activeDocumentId} engine={engine} setApi={setApi} />
				</>
			)}
			<PdfLayout />
		</PdfViewerProvider>
	);
};
