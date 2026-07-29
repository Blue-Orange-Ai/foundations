import React, {useEffect, useRef, useState} from "react";

import './NavigationMenu.css'
import {NavigationMenuItem} from "../navigation-menu-item/NavigationMenuItem";

export enum NavigationMenuAlign {
	START = "START",
	CENTER = "CENTER",
	END = "END"
}

interface ItemMetaData {
	label: string;
	icon?: string;
	href?: string;
	disabled: boolean;
	onClick?: () => void;
	content?: React.ReactNode;
}

interface Props {
	children: React.ReactNode;
	/** Where the panel sits relative to the item that opened it. */
	align?: NavigationMenuAlign;
	/** Opens a panel as soon as the pointer rests on its trigger. */
	openOnHover?: boolean;
	/** How long the pointer has to rest on a trigger before it opens. */
	openDelay?: number;
	/** How long the panel stays open after the pointer leaves. */
	closeDelay?: number;
	panelWidth?: number;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A site navigation bar whose entries can drop a panel of links. Entries
 * without children are rendered as plain links.
 */
export const NavigationMenu: React.FC<Props> = ({
													children,
													align = NavigationMenuAlign.START,
													openOnHover = true,
													openDelay = 100,
													closeDelay = 200,
													panelWidth = 420,
													classes = "",
													style = {}}) => {

	const items: ItemMetaData[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === NavigationMenuItem) {
				items.push({
					label: child.props.label as string,
					icon: child.props.icon as (string | undefined),
					href: child.props.href as (string | undefined),
					disabled: (child.props.disabled as boolean) ?? false,
					onClick: child.props.onClick as ((() => void) | undefined),
					content: child.props.children as React.ReactNode
				});
			}
		}
	});

	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const containerRef = useRef<HTMLDivElement>(null);

	const listRef = useRef<HTMLDivElement>(null);

	const triggerRefs = useRef<Array<HTMLDivElement | null>>([]);

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = () => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}

	useEffect(() => {
		return () => clearTimer();
	}, []);

	useEffect(() => {
		const handleDocumentClick = (event: MouseEvent) => {
			const target = event.target as Node;
			if (containerRef.current && !containerRef.current.contains(target)) {
				setOpenIndex(null);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpenIndex(null);
			}
		};
		document.addEventListener("mousedown", handleDocumentClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleDocumentClick);
			document.removeEventListener("keydown", handleKeyDown);
		}
	}, []);

	const hasPanel = (item: ItemMetaData): boolean => {
		return item.content !== undefined && item.content !== null && item.content !== false;
	}

	const scheduleOpen = (index: number) => {
		const item = items[index];
		if (item.disabled || !hasPanel(item) || !openOnHover) {
			return;
		}
		clearTimer();
		timerRef.current = setTimeout(() => setOpenIndex(index), openDelay);
	}

	const scheduleClose = () => {
		clearTimer();
		timerRef.current = setTimeout(() => setOpenIndex(null), closeDelay);
	}

	const handleTriggerClick = (index: number) => {
		const item = items[index];
		if (item.disabled) {
			return;
		}
		if (item.onClick) {
			item.onClick();
		}
		if (!hasPanel(item)) {
			setOpenIndex(null);
			return;
		}
		clearTimer();
		setOpenIndex(openIndex === index ? null : index);
	}

	/** Aligns the panel under its trigger, keeping it inside the bar. */
	const panelStyle = (): React.CSSProperties => {
		const style: React.CSSProperties = {width: panelWidth + "px"};
		if (openIndex === null) {
			return style;
		}
		const trigger = triggerRefs.current[openIndex];
		const list = listRef.current;
		if (!trigger || !list) {
			return style;
		}
		const triggerRect = trigger.getBoundingClientRect();
		const listRect = list.getBoundingClientRect();
		var left = triggerRect.left - listRect.left;
		if (align === NavigationMenuAlign.CENTER) {
			left = left + (triggerRect.width / 2) - (panelWidth / 2);
		} else if (align === NavigationMenuAlign.END) {
			left = left + triggerRect.width - panelWidth;
		}
		// keep the panel from hanging off the left of the page
		const minimumLeft = -listRect.left + 8;
		style.left = Math.max(left, minimumLeft) + "px";
		return style;
	}

	return (
		<div
			ref={containerRef}
			className={"blue-orange-navigation-menu" + (classes ? " " + classes : "")}
			onMouseLeave={scheduleClose}
			onMouseEnter={clearTimer}
			style={style}>
			<div ref={listRef} className="blue-orange-navigation-menu-list no-select" role="menubar">
				{items.map((item, index) => (
					<div
						key={index}
						ref={(element) => {triggerRefs.current[index] = element}}
						role="menuitem"
						aria-haspopup={hasPanel(item)}
						aria-expanded={openIndex === index}
						aria-disabled={item.disabled}
						tabIndex={item.disabled ? -1 : 0}
						className={"blue-orange-navigation-menu-trigger"
							+ (openIndex === index ? " blue-orange-navigation-menu-trigger-open" : "")
							+ (item.disabled ? " blue-orange-navigation-menu-trigger-disabled" : "")}
						onMouseEnter={() => scheduleOpen(index)}
						onClick={() => handleTriggerClick(index)}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								event.preventDefault();
								handleTriggerClick(index);
							} else if (event.key === "ArrowRight") {
								event.preventDefault();
								triggerRefs.current[(index + 1) % items.length]?.focus();
							} else if (event.key === "ArrowLeft") {
								event.preventDefault();
								triggerRefs.current[(index - 1 + items.length) % items.length]?.focus();
							}
						}}>
						{item.icon && <i className={item.icon + " blue-orange-navigation-menu-trigger-icon"}></i>}
						{item.href && !hasPanel(item)
							? <a className="blue-orange-navigation-menu-trigger-link" href={item.href}>{item.label}</a>
							: <span>{item.label}</span>
						}
						{hasPanel(item) &&
							<i className={"ri-arrow-down-s-line blue-orange-navigation-menu-trigger-arrow"
								+ (openIndex === index ? " blue-orange-navigation-menu-trigger-arrow-open" : "")}></i>
						}
					</div>
				))}
			</div>
			{openIndex !== null && items[openIndex] && hasPanel(items[openIndex]) &&
				<div className="blue-orange-navigation-menu-panel shadow" style={panelStyle()}>
					{items[openIndex].content}
				</div>
			}
		</div>
	)
}
