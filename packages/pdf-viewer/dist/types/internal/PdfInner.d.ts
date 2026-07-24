/**
 * Everything that lives *inside* the <EmbedPDF> provider: the document loader,
 * the load/error watcher, the imperative controller, and the visual layout
 * (toolbar + side panel + document view + signature dialog + print/download
 * bridges).
 */
import React from 'react';
import type { Ref } from 'react';
import type { PdfEngine } from '@embedpdf/models';
import type { PdfViewerApi, PdfViewerProps } from '../types';
export declare const PdfInner: React.FC<{
    props: PdfViewerProps;
    engine: PdfEngine;
    externalRef: Ref<PdfViewerApi>;
}>;
