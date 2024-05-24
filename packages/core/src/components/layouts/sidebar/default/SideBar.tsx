import React, {useEffect, useRef, useState} from "react";

import './SideBar.css'
import Cookies from "js-cookie";

interface Props {
}

export const SideBar: React.FC<Props> = ({}) => {

	const sidebarCookie = Cookies.get("sidebar-width");

	const initialWidth = sidebarCookie ? +sidebarCookie : 300;

	const sidebarRef = useRef<HTMLDivElement | null>(null);

	const sidebarControlRef = useRef<HTMLDivElement | null>(null);

	const moving = useRef<boolean>(false);

	const [width, setWidth] = useState(initialWidth);

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
		if (moving.current && sidebarRef.current) {
			setWidth(ev.x);
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

	return (
		<div ref={sidebarRef} className="blue-orange-sidebar" style={{width: width + "px"}}>
			<div className="blue-orange-sidebar-header"></div>
			<div className="blue-orange-sidebar-body"></div>
			<div className="blue-orange-sidebar-footer"></div>
			<div ref={sidebarControlRef} className="blue-orange-sidebar-control"></div>
		</div>
	)
}