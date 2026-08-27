import React, {useEffect, useRef} from "react";

import './FilterPills.css'

export enum FilterPillsSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM"
}

interface Props {
	/** The FilterPill entries, in the order they sit in the set. */
	children: React.ReactNode;
	/** Names the set for a screen reader — e.g. "Filter change requests by status". */
	label?: string;
	size?: FilterPillsSize;
	/** Spreads the pills across the width of the parent instead of hugging them. */
	fullWidth?: boolean;
	/** Keeps the set on one line and scrolls it instead of wrapping. */
	scroll?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

const TAB_SELECTOR = "button.blue-orange-filter-pill:not([disabled])";

/**
 * The row of filters above a list — one pill per bucket, each carrying the
 * number of rows behind it.
 *
 * The set is a single tab stop: the arrow keys move between the pills and enter
 * or space picks one, so arrowing across the filters never fires a refetch per
 * pill the way an auto-selecting tab strip would.
 */
export const FilterPills: React.FC<Props> = ({
												 children,
												 label,
												 size = FilterPillsSize.MEDIUM,
												 fullWidth = false,
												 scroll = false,
												 classes = "",
												 style = {}}) => {

	const containerRef = useRef<HTMLDivElement | null>(null);

	/* A set whose consumer has nothing selected — everything filtered out, say —
	   would otherwise have no pill in the tab order at all. */
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const pills = Array.from(container.querySelectorAll<HTMLButtonElement>(TAB_SELECTOR));
		if (pills.length > 0 && !pills.some(pill => pill.tabIndex === 0)) {
			pills[0].tabIndex = 0;
		}
	});

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const pills = Array.from(container.querySelectorAll<HTMLButtonElement>(TAB_SELECTOR));
		if (pills.length === 0) {
			return;
		}
		const current = pills.indexOf(document.activeElement as HTMLButtonElement);
		var next: HTMLButtonElement | undefined;
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			next = pills[(current + 1 + pills.length) % pills.length];
		} else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			next = pills[(current - 1 + pills.length) % pills.length];
		} else if (event.key === "Home") {
			next = pills[0];
		} else if (event.key === "End") {
			next = pills[pills.length - 1];
		}
		if (next) {
			event.preventDefault();
			next.focus();
		}
	}

	const generateClassName = () => {
		var className = "blue-orange-filter-pills";
		if (size === FilterPillsSize.SMALL) {
			className += " blue-orange-filter-pills-sm";
		}
		if (fullWidth) {
			className += " blue-orange-filter-pills-full-width";
		}
		if (scroll) {
			className += " blue-orange-filter-pills-scroll";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	return (
		<div
			ref={containerRef}
			role="tablist"
			aria-label={label}
			className={generateClassName()}
			onKeyDown={handleKeyDown}
			style={style}>
			{children}
		</div>
	)
}
