import React, { useRef, useState } from 'react';
import { PdfViewer } from '../../components/PdfViewer';
import type { PdfViewerApi, PdfTextSelection } from '../../types';
import './Workspace.css';

/**
 * Local development harness (not part of the library build). Demonstrates the
 * PdfViewer with a sample document, live callbacks and the imperative API.
 */
export const Workspace: React.FC = () => {
	const ref = useRef<PdfViewerApi>(null);
	const [url, setUrl] = useState(
		'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/legacy/build/pdf.mjs.map',
	);
	const [src, setSrc] = useState(
		'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
	);
	const [page, setPage] = useState<number>();
	const [totalPages, setTotalPages] = useState(0);
	const [selection, setSelection] = useState<PdfTextSelection | null>(null);

	return (
		<div className="workspace">
			<div className="workspace-controls">
				<h3>Foundations PDF Viewer — dev harness</h3>
				<div className="workspace-row">
					<input
						value={src}
						onChange={(e) => setSrc(e.target.value)}
						style={{ flex: 1 }}
						placeholder="PDF URL"
					/>
				</div>
				<div className="workspace-row">
					<button onClick={() => ref.current?.previousPage()}>Prev</button>
					<button onClick={() => ref.current?.nextPage()}>Next</button>
					<button onClick={() => ref.current?.goToPage(1)}>First</button>
					<button onClick={() => ref.current?.setZoom('fit-width')}>Fit width</button>
					<button onClick={() => ref.current?.zoomIn()}>Zoom +</button>
					<button onClick={() => ref.current?.zoomOut()}>Zoom -</button>
					<button onClick={() => ref.current?.rotateClockwise()}>Rotate</button>
					<button onClick={() => ref.current?.highlightSelection()}>
						Highlight selection
					</button>
					<button onClick={() => ref.current?.download()}>Download</button>
					<button onClick={() => ref.current?.print()}>Print</button>
				</div>
				<div className="workspace-status">
					<span>
						Page {page ?? '?'} / {totalPages}
					</span>
					{selection && (
						<span>
							Selected {selection.text.length} chars on pages{' '}
							{selection.pages.map((p) => p + 1).join(', ')}
						</span>
					)}
				</div>
			</div>
			<div className="workspace-viewer">
				<PdfViewer
					ref={ref}
					src={src}
					fileName="sample.pdf"
					initialZoom="fit-width"
					onPageChange={(p, total) => {
						setPage(p);
						setTotalPages(total);
					}}
					onSelectionChange={setSelection}
					onTextSelected={(s) => console.log('text selected', s)}
					onDocumentLoad={(info) => console.log('loaded', info)}
					onAnnotationsChange={(c) => console.log('annotation', c)}
				/>
			</div>
		</div>
	);
};
