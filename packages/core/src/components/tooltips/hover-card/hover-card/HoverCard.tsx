import React, {useEffect, useLayoutEffect, useRef, useState} from "react";

import './HoverCard.css'
import {HoverCardTrigger} from "../hover-card-trigger/HoverCardTrigger";
import {HoverCardContent} from "../hover-card-content/HoverCardContent";

export enum HoverCardSide {
	TOP = "TOP",
	RIGHT = "RIGHT",
	BOTTOM = "BOTTOM",
	LEFT = "LEFT"
}

export enum HoverCardAlign {
	START = "START",
	CENTER = "CENTER",
	END = "END"
}

interface Props {
	children: React.ReactNode;
	side?: HoverCardSide;
	align?: HoverCardAlign;
	/** Gap between the trigger and the card, in pixels. */
	sideOffset?: number;
	/** How long the pointer has to rest on the trigger before the card opens. */
	openDelay?: number;
	/** How long the card stays open after the pointer leaves. */
	closeDelay?: number;
	/** Controls the card from the outside — leave unset to let it manage itself. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	style?: React.CSSProperties;
}

const VIEWPORT_MARGIN = 8;

const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
}

/**
 * Shows a card of extra detail when the pointer rests on (or the keyboard
 * focuses) its trigger. Nest a HoverCardTrigger and a HoverCardContent inside.
 */
export const HoverCard: React.FC<Props> = ({
											   children,
											   side = HoverCardSide.BOTTOM,
											   align = HoverCardAlign.CENTER,
											   sideOffset = 8,
											   openDelay = 300,
											   closeDelay = 150,
											   open,
											   onOpenChange,
											   disabled = false,
											   style = {}}) => {

	const triggerItems: React.ReactNode[] = [];

	const contentItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === HoverCardTrigger) {
				triggerItems.push(child);
			} else if (child.type === HoverCardContent) {
				contentItems.push(child);
			}
		}
	});

	const controlled = open !== undefined;

	const [visible, setVisible] = useState(open ?? false);

	const [position, setPosition] = useState<React.CSSProperties>({top: "-9999px", left: "-9999px"});

	const triggerRef = useRef<HTMLDivElement>(null);

	const panelRef = useRef<HTMLDivElement>(null);

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (controlled) {
			setVisible(open!);
		}
	}, [open, controlled]);

	const clearTimer = () => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}

	useEffect(() => {
		return () => clearTimer();
	}, []);

	const changeVisibility = (next: boolean) => {
		if (onOpenChange) {
			onOpenChange(next);
		}
		if (!controlled) {
			setVisible(next);
		}
	}

	const scheduleOpen = () => {
		if (disabled) {
			return;
		}
		clearTimer();
		timerRef.current = setTimeout(() => changeVisibility(true), openDelay);
	}

	const scheduleClose = () => {
		clearTimer();
		timerRef.current = setTimeout(() => changeVisibility(false), closeDelay);
	}

	/** Places the card against the trigger, flipping and clamping to stay on screen. */
	const updatePosition = () => {
		const trigger = triggerRef.current?.getBoundingClientRect();
		const panel = panelRef.current?.getBoundingClientRect();
		if (!trigger || !panel) {
			return;
		}

		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		var resolvedSide = side;

		// flip to the opposite side when there is no room
		if (resolvedSide === HoverCardSide.BOTTOM && trigger.bottom + sideOffset + panel.height > viewportHeight - VIEWPORT_MARGIN && trigger.top - sideOffset - panel.height > VIEWPORT_MARGIN) {
			resolvedSide = HoverCardSide.TOP;
		} else if (resolvedSide === HoverCardSide.TOP && trigger.top - sideOffset - panel.height < VIEWPORT_MARGIN && trigger.bottom + sideOffset + panel.height < viewportHeight - VIEWPORT_MARGIN) {
			resolvedSide = HoverCardSide.BOTTOM;
		} else if (resolvedSide === HoverCardSide.RIGHT && trigger.right + sideOffset + panel.width > viewportWidth - VIEWPORT_MARGIN && trigger.left - sideOffset - panel.width > VIEWPORT_MARGIN) {
			resolvedSide = HoverCardSide.LEFT;
		} else if (resolvedSide === HoverCardSide.LEFT && trigger.left - sideOffset - panel.width < VIEWPORT_MARGIN && trigger.right + sideOffset + panel.width < viewportWidth - VIEWPORT_MARGIN) {
			resolvedSide = HoverCardSide.RIGHT;
		}

		var top = 0;
		var left = 0;

		if (resolvedSide === HoverCardSide.TOP || resolvedSide === HoverCardSide.BOTTOM) {
			top = resolvedSide === HoverCardSide.BOTTOM
				? trigger.bottom + sideOffset
				: trigger.top - sideOffset - panel.height;
			if (align === HoverCardAlign.START) {
				left = trigger.left;
			} else if (align === HoverCardAlign.END) {
				left = trigger.right - panel.width;
			} else {
				left = trigger.left + (trigger.width / 2) - (panel.width / 2);
			}
		} else {
			left = resolvedSide === HoverCardSide.RIGHT
				? trigger.right + sideOffset
				: trigger.left - sideOffset - panel.width;
			if (align === HoverCardAlign.START) {
				top = trigger.top;
			} else if (align === HoverCardAlign.END) {
				top = trigger.bottom - panel.height;
			} else {
				top = trigger.top + (trigger.height / 2) - (panel.height / 2);
			}
		}

		setPosition({
			top: clamp(top, VIEWPORT_MARGIN, Math.max(viewportHeight - panel.height - VIEWPORT_MARGIN, VIEWPORT_MARGIN)) + "px",
			left: clamp(left, VIEWPORT_MARGIN, Math.max(viewportWidth - panel.width - VIEWPORT_MARGIN, VIEWPORT_MARGIN)) + "px"
		});
	}

	useLayoutEffect(() => {
		if (!visible) {
			return;
		}
		updatePosition();
		const handle = () => updatePosition();
		window.addEventListener("scroll", handle, true);
		window.addEventListener("resize", handle);
		return () => {
			window.removeEventListener("scroll", handle, true);
			window.removeEventListener("resize", handle);
		}
	}, [visible, side, align, sideOffset]);

	return (
		<div className="blue-orange-hover-card" style={style}>
			<div
				ref={triggerRef}
				className="blue-orange-hover-card-trigger-cont"
				onMouseEnter={scheduleOpen}
				onMouseLeave={scheduleClose}
				onFocus={scheduleOpen}
				onBlur={scheduleClose}>
				{triggerItems}
			</div>
			{visible &&
				<div
					ref={panelRef}
					className="blue-orange-hover-card-panel"
					style={position}
					onMouseEnter={clearTimer}
					onMouseLeave={scheduleClose}>
					{contentItems}
				</div>
			}
		</div>
	)
}
