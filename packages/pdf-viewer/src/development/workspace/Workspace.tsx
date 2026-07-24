import React, { useRef, useState } from 'react';
import { Toggle } from '@blue-orange-ai/foundations-core';
import { PdfViewer } from '../../components/PdfViewer';
import type { PdfViewerApi, PdfTextSelection } from '../../types';
import './Workspace.css';

/**
 * Local development harness (not part of the library build). A horizontal split:
 * the viewer on the left, a live event log on the right so selection (and other)
 * callbacks can be seen firing. A toggle switches the viewer between light and
 * dark mode.
 */

interface LoggedEvent {
	id: number;
	time: string;
	type: string;
	detail: string;
}

export const Workspace: React.FC = () => {
	const ref = useRef<PdfViewerApi>(null);
	const [src, setSrc] = useState(
		'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
	);
	const [dark, setDark] = useState(false);
	const [events, setEvents] = useState<LoggedEvent[]>([]);
	const nextId = useRef(0);

	const log = (type: string, detail: string) => {
		const now = new Date();
		const time = now.toLocaleTimeString(undefined, { hour12: false }) +
			'.' + String(now.getMilliseconds()).padStart(3, '0');
		setEvents((prev) =>
			[{ id: nextId.current++, time, type, detail }, ...prev].slice(0, 200),
		);
	};

	const describeSelection = (s: PdfTextSelection | null): string => {
		if (!s) return 'cleared';
		const preview = s.text.replace(/\s+/g, ' ').slice(0, 60);
		return `${s.text.length} chars · pages ${s.pages
			.map((p) => p + 1)
			.join(', ')} · "${preview}${s.text.length > 60 ? '…' : ''}"`;
	};

	return (
		<div className={`workspace${dark ? ' dark' : ''}`}>
			<div className="workspace-topbar">
				<h3>Foundations PDF Viewer — dev harness</h3>
				<div className="workspace-theme">
					<span>Light</span>
					<Toggle checked={dark} onChange={setDark} />
					<span>Dark</span>
				</div>
			</div>

			<div className="workspace-row">
				<input
					value={src}
					onChange={(e) => setSrc(e.target.value)}
					placeholder="PDF URL"
				/>
				<button onClick={() => ref.current?.previousPage()}>Prev</button>
				<button onClick={() => ref.current?.nextPage()}>Next</button>
				<button onClick={() => ref.current?.setZoom('fit-width')}>Fit width</button>
				<button onClick={() => ref.current?.highlightSelection()}>Highlight</button>
			</div>

			<div className="workspace-split">
				<div className="workspace-pane workspace-pane-viewer">
					<PdfViewer
						ref={ref}
						src={src}
						fileName="sample.pdf"
						initialZoom="fit-width"
						theme={dark ? 'dark' : 'light'}
						onSelectionChange={(s) => log('onSelectionChange', describeSelection(s))}
						onTextSelected={(s) => log('onTextSelected', describeSelection(s))}
						onPageChange={(p, total) => log('onPageChange', `page ${p} / ${total}`)}
						onZoomChange={(z) => log('onZoomChange', `${Math.round(z * 100)}%`)}
						onDocumentLoad={(info) =>
							log('onDocumentLoad', `${info.pageCount} pages`)
						}
					/>
				</div>

				<div className="workspace-pane workspace-pane-events">
					<div className="workspace-events-header">
						<span>Events ({events.length})</span>
						<button onClick={() => setEvents([])}>Clear</button>
					</div>
					<div className="workspace-events-list">
						{events.length === 0 && (
							<div className="workspace-events-empty">
								Select text in the document to see selection events fire.
							</div>
						)}
						{events.map((e) => (
							<div key={e.id} className="workspace-event">
								<div className="workspace-event-head">
									<span className="workspace-event-type">{e.type}</span>
									<span className="workspace-event-time">{e.time}</span>
								</div>
								<div className="workspace-event-detail">{e.detail}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
