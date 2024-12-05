import React, {useEffect, useRef, useState} from "react";

import './SideBarBodyGroup.css'
import {SideBarBodyLabel} from "../sidebar-body-label/SideBarBodyLabel";
import {SideBarBodyItem} from "../sidebar-body-item/SideBarBodyItem";
import {Accordion} from "../../../../accordion/accordion/Accordion";
import {AccordionHeader} from "../../../../accordion/accordion-header/AccordionHeader";
import {AccordionBody} from "../../../../accordion/accordion-body/AccordionBody";



interface Props {
	children: React.ReactNode;
	opened: boolean;
}

export const SideBarBodyGroup: React.FC<Props> = ({
											 children,
											opened
											 }) => {

	const headerItems: React.ReactNode[] = [];

	const bodyItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === SideBarBodyLabel) {
				headerItems.push(child);
			} else if (child.type === SideBarBodyItem) {
				bodyItems.push(child);
			}
		}
	});

	return (
		<div style={{paddingLeft: "10px", width: "calc(100% - 10px)"}}>
			<Accordion opened={opened}>
				<AccordionHeader>{headerItems}</AccordionHeader>
				<AccordionBody>{bodyItems}</AccordionBody>
			</Accordion>
		</div>
	)
}