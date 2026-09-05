import React, {ReactNode} from "react";

import './UptimeChart.css'
import {UptimeEntry, UptimeIncident, UptimeStatus} from "../types/ChartTypes";
import {HoverCard, HoverCardAlign, HoverCardSide} from "../../tooltips/hover-card/hover-card/HoverCard";
import {HoverCardTrigger} from "../../tooltips/hover-card/hover-card-trigger/HoverCardTrigger";
import {HoverCardContent} from "../../tooltips/hover-card/hover-card-content/HoverCardContent";
import {FormHeading} from "../../text-decorations/form-heading/FormHeading";
import {Tag} from "../../text-decorations/tag/Tag";

/** The bar colour each status resolves to, unless `statusColors` says otherwise. */
export const UPTIME_STATUS_COLORS: Record<UptimeStatus, string> = {
	[UptimeStatus.OPERATIONAL]: "#16a34b",
	[UptimeStatus.DEGRADED]: "#f5c518",
	[UptimeStatus.PARTIAL_OUTAGE]: "#f97317",
	[UptimeStatus.MAJOR_OUTAGE]: "#e11d48",
	[UptimeStatus.MAINTENANCE]: "#3b82f6",
	[UptimeStatus.NO_DATA]: "#d4d4d8"
};

/** What each status is called in the popup and the legend, unless `statusLabels` says otherwise. */
export const UPTIME_STATUS_LABELS: Record<UptimeStatus, string> = {
	[UptimeStatus.OPERATIONAL]: "Operational",
	[UptimeStatus.DEGRADED]: "Degraded performance",
	[UptimeStatus.PARTIAL_OUTAGE]: "Partial outage",
	[UptimeStatus.MAJOR_OUTAGE]: "Major outage",
	[UptimeStatus.MAINTENANCE]: "Under maintenance",
	[UptimeStatus.NO_DATA]: "No data"
};

/** The order statuses are listed in the legend — worst last, as a status page reads. */
const STATUS_ORDER: Array<UptimeStatus> = [
	UptimeStatus.OPERATIONAL,
	UptimeStatus.MAINTENANCE,
	UptimeStatus.DEGRADED,
	UptimeStatus.PARTIAL_OUTAGE,
	UptimeStatus.MAJOR_OUTAGE,
	UptimeStatus.NO_DATA
];

/** How much of a period each status counts as up, when the entry has no `uptime` of its own. */
const IMPLIED_UPTIME: Record<UptimeStatus, number> = {
	[UptimeStatus.OPERATIONAL]: 100,
	[UptimeStatus.MAINTENANCE]: 100,
	[UptimeStatus.DEGRADED]: 100,
	[UptimeStatus.PARTIAL_OUTAGE]: 50,
	[UptimeStatus.MAJOR_OUTAGE]: 0,
	[UptimeStatus.NO_DATA]: 0
};

const toDate = (value: Date | string | number): Date => {
	return value instanceof Date ? value : new Date(value);
}

const isRealDate = (date: Date): boolean => {
	return !isNaN(date.getTime());
}

/**
 * The share of the window the service was up, as a percentage. Entries that
 * carry their own `uptime` are taken at their word; the rest fall back to what
 * their status implies. Periods with no data are left out of the average
 * entirely rather than counted as downtime.
 */
export const calculateUptime = (entries: Array<UptimeEntry>): number | undefined => {
	const measured = entries.filter(entry => entry.status !== UptimeStatus.NO_DATA);
	if (measured.length === 0) {
		return undefined;
	}
	const total = measured.reduce((sum, entry) => {
		return sum + (typeof entry.uptime === "number" ? entry.uptime : IMPLIED_UPTIME[entry.status]);
	}, 0);
	return total / measured.length;
}

interface Props {
	/** One bar per entry, oldest first — the way a status page reads left to right. */
	entries: Array<UptimeEntry>,
	/** The name of the thing being measured, shown at the top left. */
	title?: string,
	/** Anything richer than a title — an icon and a name, a link. Wins over `title`. */
	titleContent?: ReactNode,
	/**
	 * The overall figure shown at the top right. Left out, it is worked out from
	 * the entries; pass `showUptime={false}` to drop it altogether.
	 */
	uptime?: number,
	showUptime?: boolean,
	/** Decimal places on that figure. */
	uptimePrecision?: number,
	/** Draws the title row. Off by default when there is nothing to put in it. */
	showHeader?: boolean,
	/** Draws the "N days ago … Today" row under the bars. */
	showFooter?: boolean,
	/** The left end of the footer. Defaults to "{entries.length} days ago". */
	startLabel?: string,
	/** The right end of the footer. */
	endLabel?: string,
	/** Text in the middle of the footer, between the two rules. */
	footerLabel?: string,
	/** Lists every status present in the data under the chart. */
	legend?: boolean,
	/** Fixes the bar width in pixels. Left out, the bars share the width evenly. */
	barWidth?: number,
	/** The gap between bars, in pixels. */
	barGap?: number,
	/** How tall the bars are, in pixels. */
	barHeight?: number,
	/** The bars' corner radius, in pixels. */
	barRadius?: number,
	/** Overrides the colour any subset of the statuses resolve to. */
	statusColors?: Partial<Record<UptimeStatus, string>>,
	/** Overrides what any subset of the statuses are called. */
	statusLabels?: Partial<Record<UptimeStatus, string>>,
	/** How a bar's date is written in the popup. */
	dateFormatter?: (date: Date) => string,
	/** Whether hovering a bar opens a popup at all. */
	tooltip?: boolean,
	/** Replaces the popup's body entirely. */
	tooltipContent?: (entry: UptimeEntry, index: number) => ReactNode,
	/** The popup's width, in pixels. */
	tooltipWidth?: number,
	/** Which side of the bar the popup opens on. */
	tooltipSide?: HoverCardSide,
	/** How the popup lines up against the bar. */
	tooltipAlign?: HoverCardAlign,
	/** How long the pointer has to rest on a bar before the popup opens. */
	openDelay?: number,
	/**
	 * How long the popup stays open after the pointer leaves. It closes straight
	 * away by default, so sweeping across the bars never leaves two cards on
	 * screen at once; raise it to let the pointer travel into the card.
	 */
	closeDelay?: number,
	/** Fired when a bar is clicked. */
	onEntryClick?: (entry: UptimeEntry, index: number) => void,
	/** Shown in place of the bars when there are no entries. */
	emptyMessage?: string,
	classes?: string,
	style?: React.CSSProperties
}

/**
 * The bar of thin vertical marks a status page uses to show a service's recent
 * history — one mark per day, coloured by how the service behaved, with the
 * detail behind a popup on hover.
 */
export const UptimeChart: React.FC<Props> = ({
												 entries,
												 title,
												 titleContent,
												 uptime,
												 showUptime = true,
												 uptimePrecision = 2,
												 showHeader,
												 showFooter = true,
												 startLabel,
												 endLabel = "Today",
												 footerLabel,
												 legend = false,
												 barWidth,
												 barGap = 2,
												 barHeight = 34,
												 barRadius = 2,
												 statusColors,
												 statusLabels,
												 dateFormatter,
												 tooltip = true,
												 tooltipContent,
												 tooltipWidth = 240,
												 tooltipSide = HoverCardSide.TOP,
												 tooltipAlign = HoverCardAlign.CENTER,
												 openDelay = 0,
												 closeDelay = 0,
												 onEntryClick,
												 emptyMessage = "No uptime recorded",
												 classes = "",
												 style = {}}) => {

	const colorFor = (entry: UptimeEntry): string => {
		return entry.color ?? statusColors?.[entry.status] ?? UPTIME_STATUS_COLORS[entry.status];
	}

	const labelFor = (status: UptimeStatus): string => {
		return statusLabels?.[status] ?? UPTIME_STATUS_LABELS[status];
	}

	const formatDate = (date: Date, raw: Date | string | number): string => {
		if (dateFormatter) {
			return dateFormatter(date);
		}
		if (!isRealDate(date)) {
			return String(raw);
		}
		return date.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
	}

	const formatPercentage = (value: number): string => {
		return value.toFixed(uptimePrecision) + " %";
	}

	const resolvedUptime = uptime !== undefined ? uptime : calculateUptime(entries);

	// The header only earns its row when it has something to say.
	const headerVisible = showHeader !== undefined
		? showHeader
		: Boolean(title || titleContent || (showUptime && resolvedUptime !== undefined));

	const resolvedStartLabel = startLabel !== undefined ? startLabel : entries.length + " days ago";

	const legendStatuses = STATUS_ORDER.filter(status => entries.some(entry => entry.status === status));

	const barsStyle: React.CSSProperties = {
		height: barHeight + "px",
		gap: barGap + "px"
	};

	// Fixed-width bars keep their size and overflow; the default is to divide the
	// container up between however many entries there are, as a status page does.
	const cellStyle: React.CSSProperties = barWidth !== undefined
		? {width: barWidth + "px", flex: "0 0 auto"}
		: {flex: "1 1 0", minWidth: 0};

	const incidentDot = (incident: UptimeIncident, entry: UptimeEntry): React.CSSProperties => {
		return {backgroundColor: incident.color ?? colorFor(entry)};
	}

	const popup = (entry: UptimeEntry, index: number): ReactNode => {
		if (tooltipContent) {
			return tooltipContent(entry, index);
		}
		const date = toDate(entry.date);
		return (
			<>
				<FormHeading label={formatDate(date, entry.date)}></FormHeading>
				<Tag round={true} backgroundColor={colorFor(entry)} textColor={"white"}>
					{labelFor(entry.status)}
				</Tag>
				{typeof entry.uptime === "number" &&
					<div className="blue-orange-uptime-chart-popup-row">
						<span className="blue-orange-uptime-chart-popup-label">Uptime</span>
						<span className="blue-orange-uptime-chart-popup-value">{formatPercentage(entry.uptime)}</span>
					</div>
				}
				{entry.note &&
					<div className="blue-orange-uptime-chart-popup-note">{entry.note}</div>
				}
				{entry.incidents && entry.incidents.length > 0 &&
					<div className="blue-orange-uptime-chart-popup-incidents">
						{entry.incidents.map((incident, incidentIndex) => (
							<div className="blue-orange-uptime-chart-popup-incident" key={incidentIndex}>
								<span
									className="blue-orange-uptime-chart-popup-incident-dot"
									style={incidentDot(incident, entry)}></span>
								<div className="blue-orange-uptime-chart-popup-incident-body">
									<div className="blue-orange-uptime-chart-popup-incident-title">{incident.title}</div>
									{(incident.status || incident.duration) &&
										<div className="blue-orange-uptime-chart-popup-incident-meta">
											{[incident.status, incident.duration].filter(Boolean).join(" · ")}
										</div>
									}
								</div>
							</div>
						))}
					</div>
				}
			</>
		)
	}

	const bar = (entry: UptimeEntry, index: number): ReactNode => {
		const date = toDate(entry.date);
		return (
			<div
				className={"blue-orange-uptime-chart-bar" + (onEntryClick ? " blue-orange-uptime-chart-bar-clickable" : "")}
				style={{backgroundColor: colorFor(entry), borderRadius: barRadius + "px"}}
				role="img"
				aria-label={formatDate(date, entry.date) + ": " + labelFor(entry.status)}
				onClick={onEntryClick ? () => onEntryClick(entry, index) : undefined}></div>
		)
	}

	return (
		<div className={"blue-orange-uptime-chart" + (classes ? " " + classes : "")} style={style}>
			{headerVisible &&
				<div className="blue-orange-uptime-chart-header">
					<div className="blue-orange-uptime-chart-title">{titleContent ?? title}</div>
					{showUptime && resolvedUptime !== undefined &&
						<div className="blue-orange-uptime-chart-uptime">{formatPercentage(resolvedUptime)} uptime</div>
					}
				</div>
			}

			{entries.length === 0
				? <div className="blue-orange-uptime-chart-empty" style={{height: barHeight + "px"}}>{emptyMessage}</div>
				: <div className="blue-orange-uptime-chart-bars" style={barsStyle}>
					{entries.map((entry, index) => (
						tooltip
							? <HoverCard
								key={index}
								side={tooltipSide}
								align={tooltipAlign}
								openDelay={openDelay}
								closeDelay={closeDelay}
								style={cellStyle}>
								<HoverCardTrigger>
									{bar(entry, index)}
								</HoverCardTrigger>
								<HoverCardContent width={tooltipWidth} classes="blue-orange-uptime-chart-popup">
									{popup(entry, index)}
								</HoverCardContent>
							</HoverCard>
							: <div className="blue-orange-uptime-chart-cell" key={index} style={cellStyle}>
								{bar(entry, index)}
							</div>
					))}
				</div>
			}

			{showFooter &&
				<div className="blue-orange-uptime-chart-footer">
					<span className="blue-orange-uptime-chart-footer-label">{resolvedStartLabel}</span>
					<span className="blue-orange-uptime-chart-footer-line"></span>
					{footerLabel &&
						<>
							<span className="blue-orange-uptime-chart-footer-label">{footerLabel}</span>
							<span className="blue-orange-uptime-chart-footer-line"></span>
						</>
					}
					<span className="blue-orange-uptime-chart-footer-label">{endLabel}</span>
				</div>
			}

			{legend && legendStatuses.length > 0 &&
				<div className="blue-orange-uptime-chart-legend">
					{legendStatuses.map(status => (
						<div className="blue-orange-uptime-chart-legend-item" key={status}>
							<span
								className="blue-orange-uptime-chart-legend-swatch"
								style={{backgroundColor: statusColors?.[status] ?? UPTIME_STATUS_COLORS[status]}}></span>
							<span className="blue-orange-uptime-chart-legend-label">{labelFor(status)}</span>
						</div>
					))}
				</div>
			}
		</div>
	)
}
