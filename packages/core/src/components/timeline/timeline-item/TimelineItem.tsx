import React from "react";

import './TimelineItem.css'
import {TimelineAlign, TimelineItemState, TimelineOrientation, useTimeline} from "../timeline/TimelineContext";
import {Spinner, SpinnerSize} from "../../loading/spinner/Spinner";

interface Props {
	children?: React.ReactNode;
	/** A remixicon class rendered inside the marker. */
	icon?: string;
	state?: TimelineItemState;
	/** Replaces the marker entirely — an avatar, an image, anything. */
	media?: React.ReactNode;
	/** Rendered on the far side of the rail: a date, a milestone, a duration. */
	leading?: React.ReactNode;
	style?: React.CSSProperties;
}

const stateClassName: Record<TimelineItemState, string> = {
	[TimelineItemState.DEFAULT]: "",
	[TimelineItemState.ACTIVE]: "blue-orange-timeline-indicator-active",
	[TimelineItemState.SUCCESS]: "blue-orange-timeline-indicator-success",
	[TimelineItemState.WARNING]: "blue-orange-timeline-indicator-warning",
	[TimelineItemState.ERROR]: "blue-orange-timeline-indicator-error",
	[TimelineItemState.LOADING]: "blue-orange-timeline-indicator-active",
};

/** The icon a state falls back to when the item does not name one. */
const stateIcon: Record<TimelineItemState, string | undefined> = {
	[TimelineItemState.DEFAULT]: undefined,
	[TimelineItemState.ACTIVE]: undefined,
	[TimelineItemState.SUCCESS]: "ri-check-line",
	[TimelineItemState.WARNING]: "ri-alert-line",
	[TimelineItemState.ERROR]: "ri-close-line",
	[TimelineItemState.LOADING]: undefined,
};

/**
 * A single event. Must sit inside a Timeline, which tells it where it is so it
 * knows whether to draw a connector and, when alternating, which side to take.
 */
export const TimelineItem: React.FC<Props> = ({
												  children,
												  icon,
												  state = TimelineItemState.DEFAULT,
												  media,
												  leading,
												  style = {}}) => {

	const timeline = useTimeline();

	const orientation = timeline?.orientation ?? TimelineOrientation.VERTICAL;

	const alternate = (timeline?.align ?? TimelineAlign.START) === TimelineAlign.ALTERNATE;

	const last = timeline?.last ?? false;

	// alternating starts on the right so the first event reads top right, the
	// way a roadmap normally does
	const onRight = alternate && (timeline?.index ?? 0) % 2 === 0;

	const generateClassName = () => {
		var className = "blue-orange-timeline-item";
		className += orientation === TimelineOrientation.HORIZONTAL
			? " blue-orange-timeline-item-horizontal"
			: " blue-orange-timeline-item-vertical";
		if (alternate) {
			className += onRight
				? " blue-orange-timeline-item-alternate blue-orange-timeline-item-alternate-right"
				: " blue-orange-timeline-item-alternate blue-orange-timeline-item-alternate-left";
		}
		return className;
	}

	const renderIndicator = () => {
		if (media) {
			return <div className="blue-orange-timeline-indicator blue-orange-timeline-indicator-media">{media}</div>;
		}
		const resolvedIcon = icon ?? stateIcon[state];
		var className = "blue-orange-timeline-indicator " + stateClassName[state];
		if (!resolvedIcon && state !== TimelineItemState.LOADING) {
			className += " blue-orange-timeline-indicator-dot";
		}
		return (
			<div className={className}>
				{state === TimelineItemState.LOADING
					? <Spinner size={SpinnerSize.SMALL}></Spinner>
					: resolvedIcon && <i className={resolvedIcon}></i>
				}
			</div>
		)
	}

	const rail = (
		<div className="blue-orange-timeline-rail">
			{renderIndicator()}
			{!last && <div className="blue-orange-timeline-connector"></div>}
		</div>
	);

	const content = <div className="blue-orange-timeline-item-content">{children}</div>;

	const leadingContent = leading
		? <div className="blue-orange-timeline-leading">{leading}</div>
		: <div className="blue-orange-timeline-leading"></div>;

	// Alternating lays out as content | rail | content, with the event and its
	// leading label swapping sides on every other item.
	if (alternate) {
		return (
			<div className={generateClassName()} style={style}>
				<div className="blue-orange-timeline-side blue-orange-timeline-side-start">
					{onRight ? leadingContent : content}
				</div>
				{rail}
				<div className="blue-orange-timeline-side blue-orange-timeline-side-end">
					{onRight ? content : leadingContent}
				</div>
			</div>
		)
	}

	return (
		<div className={generateClassName()} style={style}>
			{leading && leadingContent}
			{rail}
			{content}
		</div>
	)
}
