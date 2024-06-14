import React, {ReactNode, useEffect, useRef, useState} from "react";

import './Accordion.css'
import {AccordionHeader} from "../accordion-header/AccordionHeader";
import {AccordionBody} from "../accordion-body/AccordionBody";

interface Props {
	children: ReactNode,
	opened: boolean
}

export const Accordion: React.FC<Props> = ({children, opened}) => {

	const accordionBodyRef = useRef<HTMLDivElement>(null);

	const [maxHeight, setMaxHeight] = useState('0px');

	const headerItems: React.ReactNode[] = [];

	const bodyItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === AccordionHeader) {
				headerItems.push(child);
			} else if (child.type === AccordionBody) {
				bodyItems.push(child);
			}
		}
	});

	useEffect(() => {
		if (opened) {
			setMaxHeight(accordionBodyRef.current?.scrollHeight + 'px');
		} else {
			setMaxHeight('0px');
		}
	}, [opened]);

	return (
		<div className="blue-orange-accordion">
			<div className="blue-orange-accordion-header">{headerItems}</div>
			<div
				ref={accordionBodyRef}
				style={{
					maxHeight: maxHeight,
					transition: 'max-height 0.2s ease-out',
					overflow: 'hidden'
				}}
				className="blue-orange-accordion-body">{bodyItems}</div>
		</div>
	)
}