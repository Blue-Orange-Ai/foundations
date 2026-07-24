import type { Ref } from 'react';
import { type PdfEngine } from '@embedpdf/models';
import type { PdfViewerApi, PdfViewerProps } from '../types';
export interface ControllerArgs {
    documentId: string;
    engine: PdfEngine;
    props: PdfViewerProps;
    apiRef: Ref<PdfViewerApi>;
    openSignatureDialog: () => void;
}
export declare const usePdfViewerController: ({ documentId, engine, props, apiRef, openSignatureDialog, }: ControllerArgs) => PdfViewerApi;
