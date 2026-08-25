import React, {useEffect, useRef, useState} from "react";

import './Panel.css'
import {ButtonIcon} from "../buttons/button-icon/ButtonIcon";
import {ButtonSize} from "../buttons/button/Button";

export enum PanelIconPos {
	LEFT = "LEFT",
	RIGHT = "RIGHT"
}

export interface PanelTab {
	uuid: string,
	label?: string,
	icon?: string,
	disabled?: boolean,
	/**
	 * What the body shows while this tab is selected. Leave it off and the
	 * panel keeps rendering its own children, which is the way to drive the
	 * body from the outside off onTabClick.
	 */
	content?: React.ReactNode
}

interface Props {
	children?: React.ReactNode;
	/** Anything the header should hold — a string, or a node when it needs its own layout. */
	header?: React.ReactNode;
	/** Remix icon of the single header button, left off when the header carries no action. */
	icon?: string;
	iconPos?: PanelIconPos;
	/** Tooltip of the header button. */
	iconLabel?: string;
	onIconClick?: () => void;
	/** One tab per selected item. A single tab still draws the strip. */
	tabs?: Array<PanelTab>;
	/** The selected tab. Updating it moves the selection from the outside. */
	activeTab?: string;
	onTabClick?: (uuid: string) => void;
	/** Padding of the body. A number is taken as pixels. */
	padding?: number | string;
	width?: number | string;
	height?: number | string;
	classes?: string;
	style?: React.CSSProperties;
	headerStyle?: React.CSSProperties;
	bodyStyle?: React.CSSProperties;
}

const toCssSize = (value: number | string): string => {
	return typeof value === "number" ? value + "px" : value;
}

/**
 * A self contained surface for the detail of something that was clicked — a map
 * marker, a row, a node on a graph. The header is given from the outside, the
 * body takes whatever children it is handed, and a tab strip appears when more
 * than one thing is being shown at once.
 */
export const Panel: React.FC<Props> = ({
										   children,
										   header,
										   icon,
										   iconPos = PanelIconPos.RIGHT,
										   iconLabel,
										   onIconClick,
										   tabs = [],
										   activeTab,
										   onTabClick,
										   padding = 8,
										   width,
										   height,
										   classes = "",
										   style = {},
										   headerStyle = {},
										   bodyStyle = {}}) => {

	const firstEnabled = tabs.find(tab => !tab.disabled);

	const [active, setActive] = useState(activeTab ?? firstEnabled?.uuid ?? tabs[0]?.uuid ?? "");

	const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({});

	useEffect(() => {
		if (activeTab !== undefined) {
			setActive(activeTab);
		}
	}, [activeTab]);

	// A tab the panel was showing can be closed from the outside — fall back to
	// the first one that is left rather than leaving the body blank.
	useEffect(() => {
		if (tabs.length === 0) {
			return;
		}
		if (!tabs.some(tab => tab.uuid === active)) {
			setActive(firstEnabled?.uuid ?? tabs[0].uuid);
		}
	}, [tabs.map(tab => tab.uuid).join("")]);

	/**
	 * Keeps the selected tab in view. A tab can be selected from the outside, or
	 * be one that was just added to a strip that has already outrun its width,
	 * and either way it is no use to anyone scrolled off the end.
	 */
	useEffect(() => {
		const trigger = triggerRefs.current[active];
		// Guarded — jsdom has no layout, so it does not implement this.
		if (trigger && typeof trigger.scrollIntoView === "function") {
			trigger.scrollIntoView({block: "nearest", inline: "nearest"});
		}
	}, [active, tabs.length]);

	const updateActiveTab = (tab: PanelTab) => {
		if (tab.disabled) {
			return;
		}
		setActive(tab.uuid);
		if (onTabClick) {
			onTabClick(tab.uuid);
		}
	}

	/** Left/right (and home/end) move between the triggers, as a tablist should. */
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
		const selectable = tabs.filter(tab => !tab.disabled);
		if (selectable.length === 0) {
			return;
		}
		const currentSelectableIndex = selectable.findIndex(tab => tab.uuid === tabs[index].uuid);
		var next: PanelTab | undefined;
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			next = selectable[(currentSelectableIndex + 1 + selectable.length) % selectable.length];
		} else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			next = selectable[(currentSelectableIndex - 1 + selectable.length) % selectable.length];
		} else if (event.key === "Home") {
			next = selectable[0];
		} else if (event.key === "End") {
			next = selectable[selectable.length - 1];
		} else if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			updateActiveTab(tabs[index]);
			return;
		}
		if (next) {
			event.preventDefault();
			updateActiveTab(next);
			triggerRefs.current[next.uuid]?.focus();
		}
	}

	const generateClassName = () => {
		var className = "blue-orange-foundations-panel";
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	const generateTriggerClassName = (tab: PanelTab) => {
		var className = "blue-orange-foundations-panel-tab";
		if (tab.uuid === active) {
			className += " blue-orange-foundations-panel-tab-active";
		}
		if (tab.disabled) {
			className += " blue-orange-foundations-panel-tab-disabled";
		}
		return className;
	}

	const panelStyle = (): React.CSSProperties => {
		const panel: React.CSSProperties = {...style};
		if (width !== undefined) {
			panel.width = toCssSize(width);
		}
		if (height !== undefined) {
			panel.height = toCssSize(height);
		}
		return panel;
	}

	const renderIcon = () => (
		<ButtonIcon
			icon={icon as string}
			label={iconLabel}
			size={ButtonSize.SMALL}
			className="blue-orange-foundations-panel-header-btn"
			onClick={onIconClick}
		></ButtonIcon>
	);

	/**
	 * Without a header there is nowhere for the button to sit but the tab row,
	 * which is the tidier place for it anyway — a headerless panel would
	 * otherwise carry a whole bar holding nothing but the one button.
	 */
	const tabsHoldIcon = icon !== undefined && header === undefined && tabs.length > 0;

	const showHeader = (header !== undefined || icon !== undefined) && !tabsHoldIcon;

	const activeContent = tabs.find(tab => tab.uuid === active)?.content;

	return (
		<div className={generateClassName()} style={panelStyle()}>
			{showHeader &&
				<div className="blue-orange-foundations-panel-header" style={headerStyle}>
					{icon && iconPos === PanelIconPos.LEFT && renderIcon()}
					<div className="blue-orange-foundations-panel-header-content">{header}</div>
					{icon && iconPos === PanelIconPos.RIGHT && renderIcon()}
				</div>
			}
			{tabs.length > 0 &&
				<div className="blue-orange-foundations-panel-tab-row" style={tabsHoldIcon ? headerStyle : {}}>
					{tabsHoldIcon && iconPos === PanelIconPos.LEFT && renderIcon()}
					<div className="blue-orange-foundations-panel-tabs no-select" role="tablist">
						{tabs.map((tab, index) => (
							<div
								key={tab.uuid}
								ref={(element) => {triggerRefs.current[tab.uuid] = element}}
								role="tab"
								aria-selected={tab.uuid === active}
								aria-disabled={tab.disabled ?? false}
								tabIndex={tab.uuid === active ? 0 : -1}
								className={generateTriggerClassName(tab)}
								onKeyDown={(event) => handleKeyDown(event, index)}
								onClick={() => updateActiveTab(tab)}>
								{tab.icon && <i className={tab.icon + " blue-orange-foundations-panel-tab-icon"}></i>}
								{tab.label && <span className="blue-orange-foundations-panel-tab-label">{tab.label}</span>}
							</div>
						))}
					</div>
					{tabsHoldIcon && iconPos === PanelIconPos.RIGHT && renderIcon()}
				</div>
			}
			<div
				className="blue-orange-foundations-panel-body"
				role={tabs.length > 0 ? "tabpanel" : undefined}
				style={{padding: toCssSize(padding), ...bodyStyle}}>
				{activeContent !== undefined ? activeContent : children}
			</div>
		</div>
	)
}
