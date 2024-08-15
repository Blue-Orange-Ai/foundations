import React, {useEffect, useState} from "react";

import './SidebarPage.css'
import {v4 as uuidv4} from "uuid";
import {ModalFooterLeft} from "../../modal/modal-footer-left/ModalFooterLeft";
import {SideBar} from "../../sidebar/default/SideBar";

interface Props {
	children: React.ReactNode;
}

export const SidebarPage: React.FC<Props> = ({children}) => {

	var sidebar: React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal | undefined = undefined;

	const body: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child) && child.type === SideBar) {
			sidebar = child
		} else {
			body.push(child)
		}
	});

	return (
		<div className="blue-orange-layouts-sidebar">
			<div className="blue-orange-layouts-sidebar-cont">
				{sidebar}
			</div>
			<div className="blue-orange-layouts-sidebar-body">{body}</div>
		</div>
	)
}