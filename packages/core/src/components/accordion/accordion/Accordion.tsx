import React, {ReactNode, useEffect, useRef, useState} from "react";

import './Accordion.css'
import {AccordionHeader} from "../accordion-header/AccordionHeader";
import {AccordionBody} from "../accordion-body/AccordionBody";

interface Props {
	children: ReactNode,
	opened: boolean
}

export const Accordion: React.FC<Props> = ({children, opened}) => {

	const accordionContentRef = useRef<HTMLDivElement>(null);

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
		const content = accordionContentRef.current;

		if (!opened) {
			setMaxHeight('0px');
			return;
		}

		// Sync max-height to the natural content height on open.
		setMaxHeight((content?.scrollHeight ?? 0) + 'px');

		// Keep max-height in sync while open so dynamically growing/shrinking
		// children (including nested accordions) are never clipped by overflow:hidden.
		if (!content || typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(() => {
			setMaxHeight(content.scrollHeight + 'px');
		});
		observer.observe(content);

		return () => observer.disconnect();
	}, [opened, children]);

	return (
		<div className="blue-orange-accordion">
			<div className="blue-orange-accordion-header">{headerItems}</div>
			<div
				style={{
					maxHeight: maxHeight,
					transition: 'max-height 0.2s ease-out',
					overflow: 'hidden'
				}}
				className="blue-orange-accordion-body">
				<div ref={accordionContentRef}>{bodyItems}</div>
			</div>
		</div>
	)
}