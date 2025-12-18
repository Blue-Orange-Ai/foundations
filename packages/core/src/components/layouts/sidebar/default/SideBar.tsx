import React, {useEffect, useRef, useState} from "react";

import './SideBar.css'
import Cookies from "js-cookie";
import Fuse from "fuse.js";
import {SideBarHeader} from "../sidebar-header/SideBarHeader";
import {SideBarBody} from "../sidebar-body/SideBarBody";
import {SideBarFooter} from "../sidebar-footer/SideBarFooter";
import {SideBarBodyGroup} from "../items/sidebar-body-group/SideBarBodyGroup";
import {SideBarBodyItem} from "../items/sidebar-body-item/SideBarBodyItem";
import {SideBarBodyItemLink} from "../items/sidebar-body-item-link/SideBarBodyItemLink";
import {SideBarBodyLabel} from "../items/sidebar-body-label/SideBarBodyLabel";
import {Input} from "../../../inputs/input/Input";

export enum SideBarState {
	CLOSED,
	OPEN
}

interface Props {
	children: React.ReactNode;
	state: SideBarState,
	closeWidth?: number;
	openWidth?: number;
	resizable?: boolean;
	filter?: boolean;
	changeState?: (state: SideBarState) => void;
}

export const SideBar: React.FC<Props> = ({
											 children,
											 state,
											 closeWidth = 250,
											 openWidth=250,
											 resizable=true,
											 filter = true,
											 changeState}) => {

	const headerItems: React.ReactNode[] = [];

	const bodyItems: React.ReactNode[] = [];

	const footerItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === SideBarHeader) {
				headerItems.push(child.props.children);
			} else if (child.type === SideBarBody) {
				React.Children.forEach(child.props.children, (bodyChild) => {
					bodyItems.push(bodyChild);
				});
			} else if (child.type === SideBarFooter) {
				footerItems.push(child.props.children);
			}
		}
	});

	const compareLabels = (a: string, b: string) => a.localeCompare(b, undefined, {sensitivity: 'base'});
	const getElementLabel = (element: React.ReactElement): string => {
		if (element.type === SideBarBodyItem || element.type === SideBarBodyItemLink || element.type === SideBarBodyLabel) {
			return String(element.props?.label ?? '');
		}

		if (element.type === SideBarBodyGroup) {
			const groupChildren = React.Children.toArray(element.props?.children);
			const labelEl = groupChildren.find((c) => React.isValidElement(c) && c.type === SideBarBodyLabel) as React.ReactElement | undefined;
			return String(labelEl?.props?.label ?? '');
		}

		return '';
	};

	const pinnedBodyItems: React.ReactNode[] = [];
	const sortableBodyItems: React.ReactElement[] = [];

	bodyItems.forEach((item) => {
		if (!React.isValidElement(item)) {
			pinnedBodyItems.push(item);
			return;
		}

		if (item.props?.sortable === false) {
			pinnedBodyItems.push(item);
			return;
		}

		if (item.type === SideBarBodyItem || item.type === SideBarBodyItemLink || item.type === SideBarBodyGroup) {
			sortableBodyItems.push(item);
			return;
		}

		pinnedBodyItems.push(item);
	});

	sortableBodyItems.sort((a, b) => compareLabels(getElementLabel(a), getElementLabel(b)));

	const sortedBodyItems = [...pinnedBodyItems, ...sortableBodyItems];

	const [bodySearchQuery, setBodySearchQuery] = useState<string>("");

	type SearchEntry = { label: string; groupPath: string; searchText: string; element: React.ReactElement<any> };
	const searchEntries: SearchEntry[] = [];

	const collectSearchEntries = (node: React.ReactNode, groupPathParts: string[] = []) => {
		React.Children.forEach(node, (child) => {
			if (!React.isValidElement(child)) {
				return;
			}

			if (child.type === SideBarBodyGroup) {
				const groupLabel = getElementLabel(child);
				const nextParts = groupLabel ? [...groupPathParts, groupLabel] : groupPathParts;
				collectSearchEntries(child.props?.children, nextParts);
				return;
			}

			if (child.type === SideBarBodyItem || child.type === SideBarBodyItemLink) {
				const groupPath = groupPathParts.join(" / ");
				const label = String(child.props?.label ?? '');
				searchEntries.push({
					label,
					groupPath,
					searchText: groupPath ? `${groupPath} ${label}` : label,
					element: child,
				});
				return;
			}

			if ((child as any).props?.children) {
				collectSearchEntries((child as any).props.children, groupPathParts);
			}
		});
	};

	collectSearchEntries(sortedBodyItems);

	const fuseOptions = {
		keys: ["searchText"],
		threshold: 0.2,
		caseSensitive: false,
		distance: 100,
		minMatchCharLength: 1,
	};

	const normalizedQuery = filter && state == SideBarState.OPEN ? bodySearchQuery.trim() : "";
	const searchedBodyItems: React.ReactNode[] = (() => {
		if (normalizedQuery === "") {
			return sortedBodyItems;
		}

		const fuse = new Fuse(searchEntries, fuseOptions);
		const results = fuse.search(normalizedQuery).map((r, idx) => {
			const {element: el, groupPath} = r.item;
			type SearchableSidebarElementProps = {
				label?: React.ReactNode;
			};
			if (!React.isValidElement<SearchableSidebarElementProps>(el)) {
				return el;
			}
			const originalLabel = String(el.props.label ?? "");
			const prefixedLabel = groupPath ? `${groupPath} → ${originalLabel}` : originalLabel;
			return React.cloneElement(el, {
				key: `blue-orange-sidebar-body-search-${idx}-${String(el.props.label ?? "")}`,
				label: prefixedLabel,
			});
		});
		if (results.length <= 0) {
			return [
				<div key="blue-orange-sidebar-body-empty" className="blue-orange-sidebar-body-empty">
					No items found..
				</div>,
			];
		}
		return results;
	})();

	const sidebarCookie = Cookies.get("sidebar-width");

	const initialWidth = sidebarCookie ? +sidebarCookie : 300;

	const sidebarRef = useRef<HTMLDivElement | null>(null);

	const sidebarControlRef = useRef<HTMLDivElement | null>(null);

	const moving = useRef<boolean>(false);

	const sideBarState = useRef<SideBarState>(state);

	const [width, setWidth] = useState(initialWidth);

	const changeSidebarState = (state: SideBarState) => {
		if (changeState) {
			changeState(state);
		}
	}

	const handleMouseDown = () => {
		if (resizable) {
			moving.current = true;
		}
	}

	const handleMouseUp = (ev: MouseEvent) => {
		if (moving.current) {
			const targetWidth = Math.max(250, Math.min(700, ev.x))
			Cookies.set("sidebar-width", targetWidth.toString());
		}
		moving.current = false
	}

	const handleMouseMove = (ev: MouseEvent) => {
		if (moving.current && sidebarRef.current && SideBarState.OPEN) {
			setWidth(ev.x);
		}
		if (moving.current && ev.x < closeWidth && sideBarState.current == SideBarState.OPEN) {
			changeSidebarState(SideBarState.CLOSED);
		} else if (moving.current && ev.x > openWidth && sideBarState.current == SideBarState.CLOSED) {
			console.log("OPEN Sidebar")
			changeSidebarState(SideBarState.OPEN);
		}
	}

	useEffect(() => {
		if (sidebarControlRef.current) {
			sidebarControlRef.current?.addEventListener('mousedown', handleMouseDown)
		}

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			if (sidebarControlRef.current) {
				sidebarControlRef.current?.addEventListener('mousedown', handleMouseDown)
			}
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}
	}, []);

	useEffect(() => {
		sideBarState.current = state;
	}, [state]);

	return (
		<div
			ref={sidebarRef}
			className={state == SideBarState.OPEN ? "blue-orange-sidebar" : "blue-orange-sidebar blue-orange-sidebar-closed"}
			style={{width: width + "px"}}>
			<div className="blue-orange-sidebar-header">{headerItems}</div>
			<div className="blue-orange-sidebar-body">
				{filter && state == SideBarState.OPEN &&
					<div className="blue-orange-sidebar-body-filter">
						<Input
							value={bodySearchQuery}
							placeholder={"Filter..."}
							style={{height: "32px", fontSize: "14px"}}
							onChange={setBodySearchQuery}
						></Input>
					</div>
				}
				<div className="blue-orange-sidebar-body-list">
					{searchedBodyItems}
				</div>
			</div>
			<div className="blue-orange-sidebar-footer">{footerItems}</div>
			<div ref={sidebarControlRef} className={resizable ? "blue-orange-sidebar-control" : "blue-orange-sidebar-control-disabled"}></div>
		</div>
	)
}