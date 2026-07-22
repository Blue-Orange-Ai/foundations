/**
 * Document outline / bookmarks panel. Loads the outline tree from
 * @embedpdf/plugin-bookmark and navigates to a bookmark's destination page on
 * click.
 */
import React, { useEffect, useState } from 'react';

import { useBookmarkCapability } from '@embedpdf/plugin-bookmark/react';
import { useScroll } from '@embedpdf/plugin-scroll/react';
import type { PdfBookmarkObject } from '@embedpdf/models';

import { usePdfViewerContext } from './context';

const bookmarkPage = (node: PdfBookmarkObject): number | null => {
	const target = node.target;
	if (target && target.type === 'destination') {
		return target.destination.pageIndex;
	}
	return null;
};

export const PdfOutlinePanel: React.FC = () => {
	const { documentId } = usePdfViewerContext();
	const docId = documentId ?? '';
	const bookmark = useBookmarkCapability();
	const scroll = useScroll(docId);
	const [bookmarks, setBookmarks] = useState<PdfBookmarkObject[]>([]);

	useEffect(() => {
		const cap = bookmark.provides;
		if (!cap || !documentId) return;
		let cancelled = false;
		cap.getBookmarks().wait(
			(result) => {
				if (!cancelled) setBookmarks(result.bookmarks ?? []);
			},
			() => {
				if (!cancelled) setBookmarks([]);
			},
		);
		return () => {
			cancelled = true;
		};
	}, [bookmark.provides, documentId]);

	const goTo = (node: PdfBookmarkObject) => {
		const page = bookmarkPage(node);
		if (page !== null) scroll.provides?.scrollToPage({ pageNumber: page + 1 });
	};

	const renderNodes = (nodes: PdfBookmarkObject[], depth: number): React.ReactNode =>
		nodes.map((node, i) => (
			<div key={`${depth}-${i}`}>
				<div
					className="blue-orange-pdf-outline-item"
					style={{ paddingLeft: 8 + depth * 14 }}
					onClick={() => goTo(node)}
				>
					<i className="ri-arrow-right-s-line" style={{ opacity: node.children?.length ? 1 : 0 }} />
					<span>{node.title}</span>
				</div>
				{node.children?.length ? renderNodes(node.children, depth + 1) : null}
			</div>
		));

	if (!documentId) return null;

	return (
		<div className="blue-orange-pdf-outline">
			{bookmarks.length === 0 ? (
				<div style={{ color: '#9ca3af', padding: 8, fontSize: 13 }}>No outline</div>
			) : (
				renderNodes(bookmarks, 0)
			)}
		</div>
	);
};
