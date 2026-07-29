import React from "react";

import './Pagination.css'
import {PaginationLink} from "../pagination-link/PaginationLink";
import {PaginationEllipsis} from "../pagination-ellipsis/PaginationEllipsis";

const ELLIPSIS = "ellipsis";

interface Props {
	/** The page currently being viewed, counted from 1. */
	page: number;
	totalPages: number;
	onPageChange?: (page: number) => void;
	/** How many pages to keep either side of the current page. */
	siblingCount?: number;
	showPrevNext?: boolean;
	showFirstLast?: boolean;
	previousLabel?: string;
	nextLabel?: string;
	/** Hides the labels on the previous / next controls, leaving the arrows. */
	compact?: boolean;
	disabled?: boolean;
	/** Replaces the generated items — compose PaginationLink / PaginationEllipsis by hand. */
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

const range = (start: number, end: number): number[] => {
	const pages: number[] = [];
	for (var page = start; page <= end; page++) {
		pages.push(page);
	}
	return pages;
}

/**
 * Works out which page numbers to show. Everything fits until there are more
 * pages than slots, at which point the run furthest from the current page is
 * collapsed into an ellipsis.
 */
export const buildPaginationItems = (page: number, totalPages: number, siblingCount: number): Array<number | typeof ELLIPSIS> => {
	// first + last + current + two ellipsis + the siblings either side
	const totalSlots = siblingCount * 2 + 5;

	if (totalPages <= totalSlots) {
		return range(1, totalPages);
	}

	const leftSibling = Math.max(page - siblingCount, 1);
	const rightSibling = Math.min(page + siblingCount, totalPages);

	const showLeftEllipsis = leftSibling > 2;
	const showRightEllipsis = rightSibling < totalPages - 1;

	if (!showLeftEllipsis && showRightEllipsis) {
		return [...range(1, siblingCount * 2 + 3), ELLIPSIS, totalPages];
	}

	if (showLeftEllipsis && !showRightEllipsis) {
		return [1, ELLIPSIS, ...range(totalPages - (siblingCount * 2 + 2), totalPages)];
	}

	return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, totalPages];
}

/**
 * Page navigation. Give it the current page and the total and it renders the
 * page links, collapsing long runs into an ellipsis.
 */
export const Pagination: React.FC<Props> = ({
												page,
												totalPages,
												onPageChange,
												siblingCount = 1,
												showPrevNext = true,
												showFirstLast = false,
												previousLabel = "Previous",
												nextLabel = "Next",
												compact = false,
												disabled = false,
												children,
												style = {}}) => {

	const safeTotal = Math.max(totalPages, 1);

	const safePage = Math.min(Math.max(page, 1), safeTotal);

	const goTo = (target: number) => {
		if (disabled || target === safePage || target < 1 || target > safeTotal) {
			return;
		}
		if (onPageChange) {
			onPageChange(target);
		}
	}

	if (children) {
		return (
			<nav className="blue-orange-pagination" aria-label="pagination" style={style}>
				<div className="blue-orange-pagination-content">{children}</div>
			</nav>
		)
	}

	const items = buildPaginationItems(safePage, safeTotal, siblingCount);

	return (
		<nav className="blue-orange-pagination" aria-label="pagination" style={style}>
			<div className="blue-orange-pagination-content">
				{showFirstLast &&
					<PaginationLink
						icon="ri-arrow-left-double-line"
						ariaLabel="Go to first page"
						disabled={disabled || safePage === 1}
						onClick={() => goTo(1)}></PaginationLink>
				}
				{showPrevNext &&
					<PaginationLink
						icon="ri-arrow-left-s-line"
						ariaLabel="Go to previous page"
						disabled={disabled || safePage === 1}
						onClick={() => goTo(safePage - 1)}>
						{compact ? undefined : previousLabel}
					</PaginationLink>
				}
				{items.map((item, index) => (
					item === ELLIPSIS
						? <PaginationEllipsis key={"ellipsis-" + index}></PaginationEllipsis>
						: <PaginationLink
							key={item}
							active={item === safePage}
							disabled={disabled}
							ariaLabel={"Go to page " + item}
							onClick={() => goTo(item as number)}>{item}</PaginationLink>
				))}
				{showPrevNext &&
					<PaginationLink
						iconRight="ri-arrow-right-s-line"
						ariaLabel="Go to next page"
						disabled={disabled || safePage === safeTotal}
						onClick={() => goTo(safePage + 1)}>
						{compact ? undefined : nextLabel}
					</PaginationLink>
				}
				{showFirstLast &&
					<PaginationLink
						icon="ri-arrow-right-double-line"
						ariaLabel="Go to last page"
						disabled={disabled || safePage === safeTotal}
						onClick={() => goTo(safeTotal)}></PaginationLink>
				}
			</div>
		</nav>
	)
}
