import React, {useEffect, useRef, useState} from "react";

import './Menubar.css'
import {MenubarMenu} from "../menubar-menu/MenubarMenu";
import {IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";
import {ContextMenuItem} from "../../contextmenu/context-menu-item/ContextMenuItem";
import {ContextMenuHeading} from "../../contextmenu/context-menu-heading/ContextMenuHeading";
import {ContextMenuSeparator} from "../../contextmenu/context-menu-separator/ContextMenuSeparator";

interface MenuMetaData {
	label: string;
	icon?: string;
	disabled: boolean;
	items: Array<IContextMenuItem>;
	onClick?: (item: IContextMenuItem) => void;
}

interface Props {
	children: React.ReactNode;
	/** Width of the drop down panels, in pixels. */
	width?: number;
	maxHeight?: number;
	/** Fires for every menu that does not handle its own clicks. */
	onClick?: (item: IContextMenuItem, menuLabel: string) => void;
	classes?: string;
	style?: React.CSSProperties;
}

const VIEWPORT_MARGIN = 8;

/**
 * An application menu bar — File, Edit, View. Once one menu is open, moving
 * across the bar opens the others, the way a desktop menu behaves.
 */
export const Menubar: React.FC<Props> = ({
											 children,
											 width = 220,
											 maxHeight = 325,
											 onClick,
											 classes = "",
											 style = {}}) => {

	const menus: MenuMetaData[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === MenubarMenu) {
				menus.push({
					label: child.props.label as string,
					icon: child.props.icon as (string | undefined),
					disabled: (child.props.disabled as boolean) ?? false,
					items: (child.props.items as Array<IContextMenuItem>) ?? [],
					onClick: child.props.onClick as (((item: IContextMenuItem) => void) | undefined)
				});
			}
		}
	});

	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const [openSubmenus, setOpenSubmenus] = useState<Array<{anchorRect: DOMRect, items: Array<IContextMenuItem>}>>([]);

	const [activeGroupIndexes, setActiveGroupIndexes] = useState<Array<number>>([]);

	const containerRef = useRef<HTMLDivElement>(null);

	const triggerRefs = useRef<Array<HTMLDivElement | null>>([]);

	const close = () => {
		setOpenIndex(null);
		setOpenSubmenus([]);
		setActiveGroupIndexes([]);
	}

	useEffect(() => {
		const handleDocumentClick = (event: MouseEvent) => {
			const target = event.target as Node;
			if (containerRef.current && !containerRef.current.contains(target)) {
				close();
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close();
			}
		};
		document.addEventListener("mousedown", handleDocumentClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleDocumentClick);
			document.removeEventListener("keydown", handleKeyDown);
		}
	}, []);

	const openMenu = (index: number) => {
		if (menus[index].disabled) {
			return;
		}
		setOpenIndex(index);
		setOpenSubmenus([]);
		setActiveGroupIndexes([]);
	}

	const handleTriggerClick = (index: number) => {
		if (openIndex === index) {
			close();
			return;
		}
		openMenu(index);
	}

	/** Once a menu is open, sliding across the bar swaps to the one underneath. */
	const handleTriggerEnter = (index: number) => {
		if (openIndex !== null && openIndex !== index) {
			openMenu(index);
		}
	}

	const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleTriggerClick(index);
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			const next = (index + 1) % menus.length;
			triggerRefs.current[next]?.focus();
			if (openIndex !== null) {
				openMenu(next);
			}
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			const previous = (index - 1 + menus.length) % menus.length;
			triggerRefs.current[previous]?.focus();
			if (openIndex !== null) {
				openMenu(previous);
			}
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			openMenu(index);
		}
	}

	const handleItemClick = (item: IContextMenuItem, menu: MenuMetaData) => {
		if (menu.onClick) {
			menu.onClick(item);
		}
		if (onClick) {
			onClick(item, menu.label);
		}
		close();
	}

	const panelStyle = (index: number): React.CSSProperties => {
		const trigger = triggerRefs.current[index];
		const rect = trigger?.getBoundingClientRect();
		const style: React.CSSProperties = {
			width: width + "px",
			maxHeight: maxHeight + "px"
		};
		if (!rect) {
			return style;
		}
		style.top = (rect.bottom + 4) + "px";
		if (rect.left + width > window.innerWidth - VIEWPORT_MARGIN) {
			style.right = VIEWPORT_MARGIN + "px";
		} else {
			style.left = Math.max(rect.left, VIEWPORT_MARGIN) + "px";
		}
		return style;
	}

	const submenuStyle = (anchorRect: DOMRect, level: number): React.CSSProperties => {
		var left = anchorRect.right - 6;
		if (left + width > window.innerWidth - VIEWPORT_MARGIN) {
			left = anchorRect.left - width + 6;
		}
		return {
			left: Math.max(left, VIEWPORT_MARGIN) + "px",
			top: Math.max(anchorRect.top - 4, VIEWPORT_MARGIN) + "px",
			width: width + "px",
			maxHeight: maxHeight + "px",
			zIndex: 10 + level
		};
	}

	const openGroup = (level: number, itemIndex: number, anchorRect: DOMRect, groupItems: Array<IContextMenuItem>) => {
		setOpenSubmenus((previous) => {
			const next = previous.slice(0, level);
			next[level] = {anchorRect: anchorRect, items: groupItems};
			return next;
		});
		setActiveGroupIndexes((previous) => {
			const next = previous.slice(0, level);
			next[level] = itemIndex;
			return next;
		});
	}

	const closeSubmenusFrom = (level: number) => {
		setOpenSubmenus((previous) => previous.slice(0, level));
		setActiveGroupIndexes((previous) => previous.slice(0, level));
	}

	const renderPanel = (items: Array<IContextMenuItem>, level: number, style: React.CSSProperties, menu: MenuMetaData) => {
		return (
			<div className="blue-orange-default-context-menu shadow" style={style}>
				{items.map((item, index) => (
					<div
						key={index}
						onMouseEnter={() => {
							if (item.type !== IContextMenuType.GROUP) {
								closeSubmenusFrom(level);
							}
						}}>
						{item.type == IContextMenuType.HEADING &&
							<ContextMenuHeading item={item} onClick={(clicked) => handleItemClick(clicked, menu)}></ContextMenuHeading>
						}
						{item.type == IContextMenuType.CONTENT &&
							<ContextMenuItem item={item} onClick={(clicked) => handleItemClick(clicked, menu)}></ContextMenuItem>
						}
						{item.type == IContextMenuType.SEPARATOR &&
							<ContextMenuSeparator item={item} onClick={(clicked) => handleItemClick(clicked, menu)}></ContextMenuSeparator>
						}
						{item.type == IContextMenuType.GROUP &&
							<div
								className={activeGroupIndexes[level] === index
									? "blue-orange-context-menu-general-row blue-orange-context-menu-item blue-orange-context-menu-group blue-orange-context-menu-group-active"
									: "blue-orange-context-menu-general-row blue-orange-context-menu-item blue-orange-context-menu-group"}
								onMouseEnter={(event) => {
									const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
									openGroup(level, index, rect, item.children ?? []);
								}}
								onClick={(event) => {
									event.stopPropagation();
									const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
									openGroup(level, index, rect, item.children ?? []);
								}}>
								<div className="blue-orange-context-menu-item-left-cont">
									{item.icon &&
										<div className="blue-orange-default-context-menu-row-icon"><i className={item.icon}></i></div>
									}
									<div>{item.label}</div>
								</div>
								<div className="blue-orange-context-menu-group-arrow">
									<i className={item.rightIcon ?? "ri-arrow-right-s-line"}></i>
								</div>
							</div>
						}
					</div>
				))}
			</div>
		)
	}

	const openMenuMetaData = openIndex !== null ? menus[openIndex] : null;

	return (
		<div ref={containerRef} className={"blue-orange-menubar" + (classes ? " " + classes : "")} style={style}>
			<div className="blue-orange-menubar-bar no-select" role="menubar">
				{menus.map((menu, index) => (
					<div
						key={index}
						ref={(element) => {triggerRefs.current[index] = element}}
						role="menuitem"
						aria-haspopup={true}
						aria-expanded={openIndex === index}
						aria-disabled={menu.disabled}
						tabIndex={menu.disabled ? -1 : 0}
						className={"blue-orange-menubar-trigger"
							+ (openIndex === index ? " blue-orange-menubar-trigger-open" : "")
							+ (menu.disabled ? " blue-orange-menubar-trigger-disabled" : "")}
						onClick={() => handleTriggerClick(index)}
						onMouseEnter={() => handleTriggerEnter(index)}
						onKeyDown={(event) => handleTriggerKeyDown(event, index)}>
						{menu.icon && <i className={menu.icon + " blue-orange-menubar-trigger-icon"}></i>}
						<span>{menu.label}</span>
					</div>
				))}
			</div>
			{openIndex !== null && openMenuMetaData &&
				<>
					{renderPanel(openMenuMetaData.items, 0, panelStyle(openIndex), openMenuMetaData)}
					{openSubmenus.map((submenu, index) => (
						<div key={index}>
							{renderPanel(submenu.items, index + 1, submenuStyle(submenu.anchorRect, index + 1), openMenuMetaData)}
						</div>
					))}
				</>
			}
		</div>
	)
}
