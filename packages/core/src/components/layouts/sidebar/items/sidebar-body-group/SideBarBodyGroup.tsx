import React, {useEffect, useRef, useState} from "react";

import './SideBarBodyGroup.css'
import {SideBarBodyLabel} from "../sidebar-body-label/SideBarBodyLabel";
import {SideBarBodyItem} from "../sidebar-body-item/SideBarBodyItem";
import {SideBarBodyItemLink} from "../sidebar-body-item-link/SideBarBodyItemLink";
import {Accordion} from "../../../../accordion/accordion/Accordion";
import {AccordionHeader} from "../../../../accordion/accordion-header/AccordionHeader";
import {AccordionBody} from "../../../../accordion/accordion-body/AccordionBody";



interface Props {
	children: React.ReactNode;
	opened: boolean;
	sortable?: boolean;
	openOnActiveChild?: boolean;
	onOpenedChange?: (opened: boolean) => void;
}

export const SideBarBodyGroup: React.FC<Props> = ({
											 children,
											opened,
											openOnActiveChild=true,
											onOpenedChange
											 }) => {

	const initialisedRef = useRef<boolean>(false);

    const [internalOpened, setInternalOpened] = useState<boolean>(opened);

    const headerItems: React.ReactNode[] = [];

	const bodyItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === SideBarBodyLabel) {
				headerItems.push(child);
			} else if (child.type === SideBarBodyItem || child.type === SideBarBodyItemLink) {
				bodyItems.push(child);
			}
		}
	});

	const compareLabels = (a: string, b: string) => a.localeCompare(b, undefined, {sensitivity: 'base'});
	const pinned: React.ReactNode[] = [];
	const sortableItems: React.ReactNode[] = [];

	bodyItems.forEach((item) => {
		if (React.isValidElement(item) && item.props?.sortable === false) {
			pinned.push(item);
		} else {
			sortableItems.push(item);
		}
	});

	sortableItems.sort((a, b) => {
		if (React.isValidElement(a) && React.isValidElement(b)) {
			return compareLabels(String(a.props?.label ?? ''), String(b.props?.label ?? ''));
		}
		return 0;
	});

	const sortedBodyItems = [...pinned, ...sortableItems];

	const hasActiveChild = bodyItems.some((item) =>
		React.isValidElement(item) && Boolean(item.props?.active)
	);

	useEffect(() => {
		if (initialisedRef.current) {
			return;
		}

		if (openOnActiveChild && hasActiveChild && !opened) {
			setInternalOpened(true);
            if (onOpenedChange) {
                onOpenedChange(true);
            }
		}
        initialisedRef.current = true;
	}, [openOnActiveChild,
        hasActiveChild,
        opened,
        onOpenedChange]);

    useEffect(() => {
        setInternalOpened(opened);
    }, [opened]);

	return (
		<div style={{paddingLeft: "10px", width: "calc(100% - 10px)"}}>
			<Accordion opened={internalOpened}>
				<AccordionHeader>{headerItems}</AccordionHeader>
				<AccordionBody>{sortedBodyItems}</AccordionBody>
			</Accordion>
		</div>
	)
}