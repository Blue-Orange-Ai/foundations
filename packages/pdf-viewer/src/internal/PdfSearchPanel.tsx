/**
 * Search panel. Uses the core Input styled like the sidebar filter, plus a
 * results list backed by @embedpdf/plugin-search. Typing runs a (debounced)
 * search, Enter steps through the results, and clicking a result jumps to it.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@blue-orange-ai/foundations-core';

import { useSearch } from '@embedpdf/plugin-search/react';

import { usePdfViewerContext } from './context';

export const PdfSearchPanel: React.FC = () => {
	const { documentId } = usePdfViewerContext();
	const docId = documentId ?? '';
	const search = useSearch(docId);
	const [query, setQuery] = useState('');
	// The query that is currently reflected in the results, so a repeated Enter
	// on the same term advances instead of re-running the search.
	const lastSearchedRef = useRef('');
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const state = search.state;
	const results = state?.results ?? [];
	const activeIndex = state?.activeResultIndex ?? -1;

	// Run a fresh search for a new term (no-op if the term is unchanged). The
	// controller bridge scrolls to the first hit once results arrive.
	const runSearch = (value: string) => {
		const cap = search.provides;
		if (!cap) return;
		const trimmed = value.trim();
		if (!trimmed) {
			cap.stopSearch();
			lastSearchedRef.current = '';
			return;
		}
		if (trimmed === lastSearchedRef.current) return;
		cap.startSearch();
		cap.searchAllPages(trimmed);
		lastSearchedRef.current = trimmed;
	};

	const handleChange = (value: string) => {
		setQuery(value);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		if (!value.trim()) {
			search.provides?.stopSearch();
			lastSearchedRef.current = '';
			return;
		}
		debounceRef.current = setTimeout(() => runSearch(value), 300);
	};

	// Enter runs the search immediately for a new term, or steps to the next
	// result (wrapping at the end) when the term is unchanged.
	const handleEnter = () => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		const cap = search.provides;
		if (!cap) return;
		const trimmed = query.trim();
		if (!trimmed) return;
		if (trimmed !== lastSearchedRef.current) {
			runSearch(query);
		} else {
			cap.nextResult();
		}
	};

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		},
		[],
	);

	if (!documentId) return null;

	return (
		<div className="blue-orange-pdf-search-panel">
			<Input
				value={query}
				placeholder="Filter..."
				style={{ height: '32px', fontSize: '14px' }}
				onChange={handleChange}
				enterEvent={handleEnter}
			/>

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
