import React, {useEffect, useRef, useState} from "react";

import './SideBar.css'
import Cookies from "js-cookie";
import {SideBarHeader} from "../sidebar-header/SideBarHeader";
import {SideBarBody} from "../sidebar-body/SideBarBody";
import {SideBarFooter} from "../sidebar-footer/SideBarFooter";

export enum SideBarState {
	CLOSED,
	OPEN
}

interface Props {
	children: React.ReactNode;
	state: SideBarState,
	closeWidth?: number;
	openWidth?: number;
	changeState?: (state: SideBarState) => void;
}

export const SideBar: React.FC<Props> = ({
											 children,
											 state,
											 closeWidth = 250,
											 openWidth=250,
											 changeState}) => {

	const headerItems: React.ReactNode[] = [];

	const bodyItems: React.ReactNode[] = [];

	const footerItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === SideBarHeader) {
				headerItems.push(child.props.children);
			} else if (child.type === SideBarBody) {
				bodyItems.push(child.props.children);
			} else if (child.type === SideBarFooter) {
				footerItems.push(child.props.children);
			}
		}
	});

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
		moving.current = true;
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
			<div className="blue-orange-sidebar-body">{bodyItems}</div>
			<div className="blue-orange-sidebar-footer">{footerItems}</div>
			<div ref={sidebarControlRef} className="blue-orange-sidebar-control"></div>
		</div>
	)
}