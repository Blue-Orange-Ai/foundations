import React, {ReactNode} from "react";

import './ContributionChart.css'
import {ContributionEntry} from "../types/ChartTypes";
import {HoverCard, HoverCardAlign, HoverCardSide} from "../../tooltips/hover-card/hover-card/HoverCard";
import {HoverCardTrigger} from "../../tooltips/hover-card/hover-card-trigger/HoverCardTrigger";
import {HoverCardContent} from "../../tooltips/hover-card/hover-card-content/HoverCardContent";
import {FormHeading} from "../../text-decorations/form-heading/FormHeading";

/**
 * The shades a square can take, quietest first. Index 0 is a day with nothing
 * on it; the rest are the bands the counts are shared out between, so the
 * number of bands is however many colours you pass.
 *
 * These are the light theme's values. The chart does not paint them directly —
 * left to itself it paints the CSS variables the stylesheet holds them in, so
 * the scale swaps for the dark one on a dark page. Pass an array of your own to
 * `levelColors` and those colours are used as given, in either theme.
 */
export const CONTRIBUTION_LEVEL_COLORS: Array<string> = [
	"#ebedf0",
	"#9be9a8",
	"#40c463",
	"#30a14e",
	"#216e39"
];

/** The same scale as the stylesheet uses on a dark background. */
export const CONTRIBUTION_LEVEL_COLORS_DARK: Array<string> = [
	"#2d333b",
	"#0e4429",
	"#006d32",
	"#26a641",
	"#39d353"
];

const MONTH_LABELS: Array<string> = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/** Sunday first, the way a calendar is written. */
const WEEKDAY_LABELS: Array<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PLAIN_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A calendar is read in local time, so a bare "2026-01-04" has to land on the
 * 4th wherever the reader is — which `new Date()` will not do, since it treats
 * a date-only string as UTC.
 */
export const toContributionDate = (value: Date | string | number): Date => {
	if (value instanceof Date) {
		return value;
	}
	if (typeof value === "string" && PLAIN_DATE.test(value)) {
		const parts = value.split("-");
		return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
	}
	return new Date(value);
}

const isRealDate = (date: Date): boolean => {
	return !isNaN(date.getTime());
}

/** Midnight local time, so every day in the grid compares as one value. */
const startOfDay = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** The key a day is filed under while the calendar is being built. */
const dayKey = (date: Date): string => {
	return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

/** Walks back to the most recent `weekStart` on or before the given day. */
const startOfWeek = (date: Date, weekStart: number): Date => {
	const day = startOfDay(date);
	const shift = (day.getDay() - weekStart + 7) % 7;
	return new Date(day.getFullYear(), day.getMonth(), day.getDate() - shift);
}

/**
 * Everything the entries add up to. Handed out as a helper because the figure
 * in the header is usually wanted elsewhere on the page too.
 */
export const contributionTotal = (entries: Array<ContributionEntry>): number => {
	return entries.reduce((sum, entry) => sum + (entry.count > 0 ? entry.count : 0), 0);
}

/**
 * One square of the grid. Days inside the window that no entry covers are
 * still squares — they just have nothing on them; days padding the first and
 * last weeks are `null` and left blank so the rows stay aligned.
 */
interface Day {
	date: Date,
	entry?: ContributionEntry,
	count: number
}

interface Props {
	/** One entry per day. Order does not matter — they are filed by date. */
	entries: Array<ContributionEntry>,
	/** The first day of the window. Defaults to the earliest entry. */
	startDate?: Date | string | number,
	/** The last day of the window. Defaults to the latest entry. */
	endDate?: Date | string | number,
	/** The name of what is being counted, shown at the top left. */
	title?: string,
	/** Anything richer than a title — an icon and a name, a link. Wins over `title`. */
	titleContent?: ReactNode,
	/** Draws the title row. Off by default when there is nothing to put in it. */
	showHeader?: boolean,
	/**
	 * The running total at the top right. Left out, it is added up from the
	 * entries; pass `showTotal={false}` to drop it altogether.
	 */
	total?: number,
	showTotal?: boolean,
	/** How the total is written. Defaults to "N contributions". */
	totalLabel?: (total: number) => string,
	/** Which day the weeks start on — 0 is Sunday, 1 Monday. */
	weekStart?: number,
	/**
	 * Fixes the side of a square, in pixels. Left out, the squares divide the
	 * width they are given between them and stay square as they go, so the
	 * chart fills whatever it is put in.
	 */
	cellSize?: number,
	/**
	 * How small a square is allowed to get while it is dividing up the width.
	 * Below this the grid stops shrinking and scrolls sideways instead, rather
	 * than squeezing a year into specks. Ignored when `cellSize` is given.
	 */
	minCellSize?: number,
	/** The gap between squares, in pixels. */
	cellGap?: number,
	/** The squares' corner radius, in pixels. */
	cellRadius?: number,
	/** The shades, quietest first. Their number sets how many bands there are. */
	levelColors?: Array<string>,
	/**
	 * The counts at which each band starts, ascending — one fewer than there
	 * are colours. Left out, the bands are shared evenly up to the busiest day.
	 */
	levels?: Array<number>,
	/** Works out a square's band itself, overriding `levels` entirely. */
	levelFor?: (count: number, max: number) => number,
	/** Draws the row of month names above the grid. */
	showMonthLabels?: boolean,
	/** Draws the column of weekday names beside it. */
	showWeekdayLabels?: boolean,
	/** Overrides the month names. Twelve, January first. */
	monthLabels?: Array<string>,
	/** Overrides the weekday names. Seven, Sunday first. */
	weekdayLabels?: Array<string>,
	/**
	 * How thinly the weekday names are spread — every other one by default, so
	 * they do not crowd the rows.
	 */
	weekdayInterval?: number,
	/** Draws the "Less … More" scale under the grid. */
	legend?: boolean,
	legendLessLabel?: string,
	legendMoreLabel?: string,
	/** How a square's date is written in the popup. */
	dateFormatter?: (date: Date) => string,
	/** How a square's count is written in the popup. Defaults to "N contributions". */
	countFormatter?: (count: number, date: Date) => string,
	/** Whether hovering a square opens a popup at all. */
	tooltip?: boolean,
	/** Replaces the popup's body entirely. */
	tooltipContent?: (date: Date, entry: ContributionEntry | undefined, count: number) => ReactNode,
	/** The popup's width, in pixels. */
	tooltipWidth?: number,
	/** Which side of the square the popup opens on. */
	tooltipSide?: HoverCardSide,
	/** How the popup lines up against the square. */
	tooltipAlign?: HoverCardAlign,
	/** How long the pointer has to rest on a square before the popup opens. */
	openDelay?: number,
	/**
	 * How long the popup stays open after the pointer leaves. It closes straight
	 * away by default, so sweeping across the grid never leaves two cards on
	 * screen at once; raise it to let the pointer travel into the card.
	 */
	closeDelay?: number,
	/** Fired when a square is clicked. */
	onDayClick?: (date: Date, entry: ContributionEntry | undefined, count: number) => void,
	/** Shown in place of the grid when there is nothing to draw. */
	emptyMessage?: string,
	classes?: string,
	style?: React.CSSProperties
}

/**
 * The year of small squares a profile page uses to show how busy someone has
 * been — one square per day, a column per week, shaded by how much happened,
 * with the detail behind a popup on hover.
 *
 * It fills whatever width it is given, dividing it between the weeks and
 * keeping the squares square, so narrowing it is a matter of narrowing what it
 * sits in. `cellSize` pins the squares instead and lets the grid scroll.
 */
export const ContributionChart: React.FC<Props> = ({
													   entries,
													   startDate,
													   endDate,
													   title,
													   titleContent,
													   showHeader,
													   total,
													   showTotal = true,
													   totalLabel,
													   weekStart = 0,
													   cellSize,
													   minCellSize = 8,
													   cellGap = 3,
													   cellRadius = 2,
													   levelColors = CONTRIBUTION_LEVEL_COLORS,
													   levels,
													   levelFor,
													   showMonthLabels = true,
													   showWeekdayLabels = true,
													   monthLabels = MONTH_LABELS,
													   weekdayLabels = WEEKDAY_LABELS,
													   weekdayInterval = 2,
													   legend = true,
													   legendLessLabel = "Less",
													   legendMoreLabel = "More",
													   dateFormatter,
													   countFormatter,
													   tooltip = true,
													   tooltipContent,
													   tooltipWidth = 200,
													   tooltipSide = HoverCardSide.TOP,
													   tooltipAlign = HoverCardAlign.CENTER,
													   openDelay = 0,
													   closeDelay = 0,
													   onDayClick,
													   emptyMessage = "No activity recorded",
													   classes = "",
													   style = {}}) => {

	// Entries are filed by day so the grid can be walked date by date. Two
	// entries on the same day add up rather than one quietly winning.
	const byDay = new Map<string, {entry: ContributionEntry, count: number}>();
	var earliest: Date | undefined = undefined;
	var latest: Date | undefined = undefined;

	entries.forEach(entry => {
		const parsed = toContributionDate(entry.date);
		if (!isRealDate(parsed)) {
			return;
		}
		const day = startOfDay(parsed);
		const key = dayKey(day);
		const existing = byDay.get(key);
		byDay.set(key, {
			entry: existing ? existing.entry : entry,
			count: (existing ? existing.count : 0) + (entry.count > 0 ? entry.count : 0)
		});
		if (!earliest || day < earliest) {
			earliest = day;
		}
		if (!latest || day > latest) {
			latest = day;
		}
	});

	const resolvedStart = startDate !== undefined ? toContributionDate(startDate) : earliest;
	const resolvedEnd = endDate !== undefined ? toContributionDate(endDate) : latest;

	const drawable = Boolean(resolvedStart && resolvedEnd
		&& isRealDate(resolvedStart) && isRealDate(resolvedEnd)
		&& startOfDay(resolvedStart) <= startOfDay(resolvedEnd));

	// The grid always runs whole weeks, so the rows line up with the weekday
	// column however the window happens to start and end.
	const weeks: Array<Array<Day | null>> = [];
	if (drawable) {
		const first = startOfDay(resolvedStart!);
		const last = startOfDay(resolvedEnd!);
		var cursor = startOfWeek(first, weekStart);
		var week: Array<Day | null> = [];
		while (cursor.getTime() <= last.getTime() || week.length > 0) {
			const inWindow = cursor.getTime() >= first.getTime() && cursor.getTime() <= last.getTime();
			if (inWindow) {
				const found = byDay.get(dayKey(cursor));
				week.push({
					date: cursor,
					entry: found?.entry,
					count: found ? found.count : 0
				});
			} else {
				week.push(null);
			}
			// Stepping a calendar day rather than 24 hours: on the day the clocks
			// go back, adding a day's worth of milliseconds lands on the same date
			// again, and the loop never gets anywhere.
			cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
			if (week.length === 7) {
				weeks.push(week);
				week = [];
			}
		}
	}

	const busiest = weeks.reduce((max, column) => {
		return column.reduce((columnMax, day) => {
			return day && day.count > columnMax ? day.count : columnMax;
		}, max);
	}, 0);

	const bands = Math.max(levelColors.length - 1, 1);

	/**
	 * Which shade a count earns. Explicit thresholds win; otherwise the counts
	 * up to the busiest day are shared evenly between the bands, so a quiet
	 * year still uses the whole scale.
	 */
	const bandFor = (count: number): number => {
		if (levelFor) {
			return Math.min(Math.max(levelFor(count, busiest), 0), levelColors.length - 1);
		}
		if (count <= 0) {
			return 0;
		}
		if (levels && levels.length > 0) {
			var band = 0;
			levels.forEach((threshold, index) => {
				if (count >= threshold) {
					band = index + 1;
				}
			});
			return Math.min(band, levelColors.length - 1);
		}
		const step = Math.max(Math.ceil(busiest / bands), 1);
		return Math.min(1 + Math.floor((count - 1) / step), levelColors.length - 1);
	}

	// Untouched, the scale is painted as CSS variables so the stylesheet can swap
	// it for the dark one; a palette of the caller's own is painted as given.
	const themed = levelColors === CONTRIBUTION_LEVEL_COLORS;

	const shade = (band: number): string => {
		const index = Math.min(Math.max(band, 0), levelColors.length - 1);
		return themed ? "var(--blue-orange-contribution-level-" + index + ")" : levelColors[index];
	}

	const colorFor = (day: Day): string => {
		if (day.entry?.color) {
			return day.entry.color;
		}
		if (day.entry?.level !== undefined) {
			return shade(day.entry.level);
		}
		return shade(bandFor(day.count));
	}

	const formatDate = (date: Date): string => {
		if (dateFormatter) {
			return dateFormatter(date);
		}
		return date.toLocaleDateString(undefined, {weekday: "long", month: "long", day: "numeric", year: "numeric"});
	}

	const formatCount = (count: number, date: Date): string => {
		if (countFormatter) {
			return countFormatter(count, date);
		}
		if (count <= 0) {
			return "No contributions";
		}
		return count.toLocaleString() + (count === 1 ? " contribution" : " contributions");
	}

	const resolvedTotal = total !== undefined ? total : contributionTotal(entries);

	const formatTotal = (value: number): string => {
		if (totalLabel) {
			return totalLabel(value);
		}
		return value.toLocaleString() + (value === 1 ? " contribution" : " contributions");
	}

	const headerVisible = showHeader !== undefined
		? showHeader
		: Boolean(title || titleContent || showTotal);

	/**
	 * Where each month's name goes. A month is labelled above the first week
	 * that is mostly its own, and only when it has room for the name — the
	 * stub month a window opens on gets no label rather than a cramped one.
	 */
	const monthSpans: Array<{label: string, start: number, span: number}> = [];
	if (showMonthLabels) {
		weeks.forEach((column, week) => {
			const firstDay = column.find(day => day !== null) as Day | undefined;
			const month = firstDay ? firstDay.date.getMonth() : -1;
			const previous = monthSpans.length > 0 ? monthSpans[monthSpans.length - 1] : undefined;
			const label = month >= 0 ? monthLabels[month] : "";
			if (previous && previous.label === label) {
				previous.span = previous.span + 1;
			} else {
				monthSpans.push({label: label, start: week, span: 1});
			}
		});
		// A month the window only clips a week or two of has nowhere to write
		// its name without running into the next one.
		monthSpans.forEach(span => {
			if (span.span < 3) {
				span.label = "";
			}
		});
	}

	/*
	 * The month names, the weekday names and the squares all sit in one grid
	 * rather than three that have to be kept in step: the labels take the first
	 * row and the first column, and everything lines up by construction.
	 */
	const labelColumns = showWeekdayLabels ? 1 : 0;
	const labelRows = showMonthLabels ? 1 : 0;

	// Fixed squares keep their size and let the grid scroll; the default is to
	// divide the width up between the weeks, down to a floor, which is what
	// makes the chart fill its container.
	const columnTrack = cellSize !== undefined
		? cellSize + "px"
		: "minmax(" + minCellSize + "px, 1fr)";

	const gridStyle: React.CSSProperties = {
		gridTemplateColumns: (showWeekdayLabels ? "auto " : "")
			+ "repeat(" + weeks.length + ", " + columnTrack + ")",
		gridTemplateRows: (showMonthLabels ? "auto " : "")
			+ "repeat(7, " + (cellSize !== undefined ? cellSize + "px" : "auto") + ")",
		gap: cellGap + "px"
	};

	const cellStyle = (week: number, row: number): React.CSSProperties => {
		return {
			gridColumn: labelColumns + 1 + week,
			gridRow: labelRows + 1 + row
		};
	}

	// The legend sits outside the grid, so its swatches have no width to take
	// from it and fall back to something the eye reads as a square.
	const swatchStyle = (color: string): React.CSSProperties => {
		const size = cellSize !== undefined ? cellSize : 10;
		return {
			width: size + "px",
			height: size + "px",
			borderRadius: cellRadius + "px",
			backgroundColor: color
		};
	}

	// The weekday column is written Sunday first but the rows start on
	// whichever day the weeks do, so the names have to be rotated to match.
	const weekdayRows = Array.from({length: 7}, (unused, row) => {
		return weekdayLabels[(row + weekStart) % 7];
	});

	const popup = (day: Day): ReactNode => {
		if (tooltipContent) {
			return tooltipContent(day.date, day.entry, day.count);
		}
		return (
			<>
				<FormHeading label={formatCount(day.count, day.date)}></FormHeading>
				<div className="blue-orange-contribution-chart-popup-date">{formatDate(day.date)}</div>
				{day.entry?.note &&
					<div className="blue-orange-contribution-chart-popup-note">{day.entry.note}</div>
				}
			</>
		)
	}

	const square = (day: Day): ReactNode => {
		return (
			<div
				className={"blue-orange-contribution-chart-day" + (onDayClick ? " blue-orange-contribution-chart-day-clickable" : "")}
				style={{backgroundColor: colorFor(day), borderRadius: cellRadius + "px"}}
				role="img"
				aria-label={formatCount(day.count, day.date) + " on " + formatDate(day.date)}
				onClick={onDayClick ? () => onDayClick(day.date, day.entry, day.count) : undefined}></div>
		)
	}

	/*
	 * Every square is placed on the grid by hand rather than flowing into it,
	 * so the days that pad the first and last week take no room at all and the
	 * rest still land on the weekday they belong to.
	 */
	const cell = (day: Day | null, row: number, week: number): ReactNode => {
		if (!day) {
			return null;
		}
		const key = week + "-" + row;
		if (!tooltip) {
			return (
				<div className="blue-orange-contribution-chart-cell" style={cellStyle(week, row)} key={key}>
					{square(day)}
				</div>
			)
		}
		return (
			<HoverCard
				key={key}
				side={tooltipSide}
				align={tooltipAlign}
				openDelay={openDelay}
				closeDelay={closeDelay}
				style={cellStyle(week, row)}>
				<HoverCardTrigger>
					{square(day)}
				</HoverCardTrigger>
				<HoverCardContent width={tooltipWidth} classes="blue-orange-contribution-chart-popup">
					{popup(day)}
				</HoverCardContent>
			</HoverCard>
		)
	}

	return (
		<div className={"blue-orange-contribution-chart" + (classes ? " " + classes : "")} style={style}>
			{headerVisible &&
				<div className="blue-orange-contribution-chart-header">
					<div className="blue-orange-contribution-chart-title">{titleContent ?? title}</div>
					{showTotal &&
						<div className="blue-orange-contribution-chart-total">{formatTotal(resolvedTotal)}</div>
					}
				</div>
			}

			{!drawable
				? <div className="blue-orange-contribution-chart-empty">{emptyMessage}</div>
				: <div className="blue-orange-contribution-chart-scroll">
					<div className="blue-orange-contribution-chart-grid" style={gridStyle}>
						{showMonthLabels && monthSpans.map((span, index) => (
							<span
								className="blue-orange-contribution-chart-month"
								style={{
									gridRow: 1,
									gridColumn: (labelColumns + 1 + span.start) + " / span " + span.span
								}}
								key={"month-" + index}>{span.label}</span>
						))}
						{showWeekdayLabels && weekdayRows.map((label, row) => (
							<span
								className="blue-orange-contribution-chart-weekday"
								style={{gridColumn: 1, gridRow: labelRows + 1 + row}}
								key={"weekday-" + row}>
								{row % weekdayInterval === 1 % weekdayInterval ? label : ""}
							</span>
						))}
						{weeks.map((column, week) => (
							column.map((day, row) => cell(day, row, week))
						))}
					</div>
				</div>
			}

			{legend && drawable &&
				<div className="blue-orange-contribution-chart-legend">
					<span className="blue-orange-contribution-chart-legend-label">{legendLessLabel}</span>
					{levelColors.map((color, index) => (
						<span className="blue-orange-contribution-chart-legend-swatch" style={swatchStyle(shade(index))} key={index}></span>
					))}
					<span className="blue-orange-contribution-chart-legend-label">{legendMoreLabel}</span>
				</div>
			}
		</div>
	)
}
