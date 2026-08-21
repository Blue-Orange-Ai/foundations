import React, {useEffect, useMemo, useRef, useState} from "react";

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
import {SideBarContext} from "../SideBarContext";

export enum SideBarState {
	CLOSED,
	OPEN
}

/** Narrowest and widest the open sidebar can be dragged to. */
const MIN_OPEN_WIDTH = 250;
const MAX_OPEN_WIDTH = 700;

/** Width an open sidebar starts at when the user has never resized one. */
const DEFAULT_OPEN_WIDTH = 256;

interface Props {
	children: React.ReactNode;
	state: SideBarState,
	closeWidth?: number;
	openWidth?: number;
	resizable?: boolean;
	filter?: boolean;
	/**
	 * Force every group open while the sidebar is collapsed. Collapsed groups
	 * hide their header, so without this the items inside a closed group would
	 * have no icon in the rail at all.
	 */
	expandGroupsOnCollapse?: boolean;
	changeState?: (state: SideBarState) => void;
}

export const SideBar: React.FC<Props> = ({
											 children,
											 state,
											 closeWidth = 250,
											 openWidth=250,
											 resizable=true,
											 filter = true,
											 expandGroupsOnCollapse = true,
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

	const clampWidth = (value: number) => Math.max(MIN_OPEN_WIDTH, Math.min(MAX_OPEN_WIDTH, value));

	const sidebarCookie = Number(Cookies.get("sidebar-width"));

	// A cookie written by an older build — or by hand — can hold anything, and an
	// out of range width now lands straight on min-width/max-width rather than
	// being clamped by the stylesheet.
	const initialWidth = Number.isFinite(sidebarCookie) && sidebarCookie > 0
		? clampWidth(sidebarCookie)
		: DEFAULT_OPEN_WIDTH;

	const sidebarRef = useRef<HTMLDivElement | null>(null);

	const sidebarControlRef = useRef<HTMLDivElement | null>(null);

	const moving = useRef<boolean>(false);

	const sideBarState = useRef<SideBarState>(state);

	const [width, setWidth] = useState(initialWidth);

	// Drives the class that switches the width transition off. Dragging retargets
	// the width on every mouse move, and a transition would leave the edge
	// trailing the cursor for the whole drag.
	const [resizing, setResizing] = useState<boolean>(false);

	const changeSidebarState = (state: SideBarState) => {
		if (changeState) {
			changeState(state);
		}
	}

	// Widths are measured from the sidebar's own left edge rather than the
	// viewport's, so a sidebar that is not flush against the window still
	// resizes to the width the cursor is pointing at.
	const widthAtPointer = (ev: MouseEvent) => {
		const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
		return ev.clientX - left;
	}

	const handleMouseDown = (ev: MouseEvent) => {
		if (resizable) {
			ev.preventDefault();
			moving.current = true;
			setResizing(true);
		}
	}

	const handleMouseUp = (ev: MouseEvent) => {
		if (moving.current) {
			const targetWidth = clampWidth(widthAtPointer(ev))
			setWidth(targetWidth);
			Cookies.set("sidebar-width", targetWidth.toString());
		}
		moving.current = false
		setResizing(false);
	}

	const handleMouseMove = (ev: MouseEvent) => {
		if (!moving.current) {
			return;
		}

		const pointerWidth = widthAtPointer(ev);

		if (sidebarRef.current) {
			setWidth(clampWidth(pointerWidth));
		}
		if (pointerWidth < closeWidth && sideBarState.current == SideBarState.OPEN) {
			changeSidebarState(SideBarState.CLOSED);
		} else if (pointerWidth > openWidth && sideBarState.current == SideBarState.CLOSED) {
			changeSidebarState(SideBarState.OPEN);
		}
	}

	useEffect(() => {
		const control = sidebarControlRef.current;

		control?.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			control?.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}
	}, []);

	useEffect(() => {
		sideBarState.current = state;
	}, [state]);

	// Memoised so resizing the sidebar does not re-render every item through
	// a fresh context value.
	const sidebarContext = useMemo(() => ({
		collapsed: state == SideBarState.CLOSED,
		expandGroupsOnCollapse: expandGroupsOnCollapse
	}), [state, expandGroupsOnCollapse]);

	const classNames = ["blue-orange-sidebar"];

	if (state != SideBarState.OPEN) {
		classNames.push("blue-orange-sidebar-closed");
	}

	if (resizing) {
		classNames.push("blue-orange-sidebar-resizing");
	}

	// The width goes out as a custom property rather than as `width` so that the
	// collapsed rule can still take the element down to the icon rail — an
	// inline `width` would outrank it. The icon width is left to the stylesheet
	// for the same reason: nothing inline, so a consumer can retheme it.
	const widthStyle = {
		"--blue-orange-sidebar-open-width": width + "px"
	} as React.CSSProperties;

	return (
		<SideBarContext.Provider value={sidebarContext}>
			<div
				ref={sidebarRef}
				className={classNames.join(" ")}
				data-state={state == SideBarState.OPEN ? "expanded" : "collapsed"}
				style={widthStyle}>
				<div className="blue-orange-sidebar-header">{headerItems}</div>
				<div className="blue-orange-sidebar-body">
					{filter &&
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
		</SideBarContext.Provider>
	)
}