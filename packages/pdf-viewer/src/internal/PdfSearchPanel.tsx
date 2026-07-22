/**
 * Search panel. Uses the core SearchInput + a results list backed by
 * @embedpdf/plugin-search. Clicking a result jumps to it.
 */
import React, { useState } from 'react';
import { SearchInput } from '@blue-orange-ai/foundations-core';

import { useSearch } from '@embedpdf/plugin-search/react';

import { usePdfViewerContext } from './context';

export const PdfSearchPanel: React.FC = () => {
	const { documentId } = usePdfViewerContext();
	const docId = documentId ?? '';
	const search = useSearch(docId);
	const [query, setQuery] = useState('');

	const state = search.state;
	const results = state?.results ?? [];
	const activeIndex = state?.activeResultIndex ?? -1;

	const runSearch = (value: string) => {
		setQuery(value);
		const cap = search.provides;
		if (!cap) return;
		if (!value) {
			cap.stopSearch();
			return;
		}
		cap.startSearch();
		cap.searchAllPages(value);
	};

	if (!documentId) return null;

	return (
		<div className="blue-orange-pdf-search-panel">
			<SearchInput label="Search document" icon="ri-search-line" onChange={runSearch} />

			{query && (
				<div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 8 }}>
					<span>
						{results.length > 0
							? `${activeIndex + 1} / ${results.length}`
							: 'No results'}
					</span>
					<i
						className="ri-arrow-up-s-line"
						style={{ cursor: 'pointer' }}
						onClick={() => search.provides?.previousResult()}
					/>
					<i
						className="ri-arrow-down-s-line"
						style={{ cursor: 'pointer' }}
						onClick={() => search.provides?.nextResult()}
					/>
				</div>
			)}

			<div className="blue-orange-pdf-search-results">
				{results.map((r, i) => (
					<div
						key={`${r.pageIndex}-${i}`}
						className={`blue-orange-pdf-search-result${i === activeIndex ? ' is-active' : ''}`}
						onClick={() => search.provides?.goToResult(i)}
					>
						<div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
							Page {r.pageIndex + 1}
						</div>
						<span>
							{r.context?.before}
							<mark>{r.context?.match}</mark>
							{r.context?.after}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
