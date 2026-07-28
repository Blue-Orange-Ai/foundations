import React, {useEffect, useRef, useState} from "react";

import './SideBarBodyGroup.css'
import {SideBarBodyLabel} from "../sidebar-body-label/SideBarBodyLabel";
import {SideBarBodyItem} from "../sidebar-body-item/SideBarBodyItem";
import {SideBarBodyItemLink} from "../sidebar-body-item-link/SideBarBodyItemLink";
import {Accordion} from "../../../../accordion/accordion/Accordion";
import {AccordionHeader} from "../../../../accordion/accordion-header/AccordionHeader";
import {AccordionBody} from "../../../../accordion/accordion-body/AccordionBody";
import {useSideBar} from "../../SideBarContext";



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

	const {collapsed, expandGroupsOnCollapse} = useSideBar();

	// The collapsed sidebar hides group headers, so a closed group would hide
	// its items' icons entirely. Forcing the accordion open is derived rather
	// than stored, which leaves the caller's own opened state untouched and
	// restores it as soon as the sidebar reopens.
	const effectiveOpened = (collapsed && expandGroupsOnCollapse) || internalOpened;

    const headerItems: React.ReactNode[] = [];

	const bodyItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === SideBarBodyLabel) {
				headerItems.push(child);
			} else if (child.type === SideBarBodyItem || child.type === SideBarBodyItemLink || child.type === SideBarBodyGroup) {
				bodyItems.push(child);
			}
		}
	});

	const compareLabels = (a: string, b: string) => a.localeCompare(b, undefined, {sensitivity: 'base'});
	const pinned: React.ReactNode[] = [];
	const sortableItems: React.ReactNode[] = [];

	bodyItems.forEach((item) => {
		if (React.isValidElement<any>(item) && item.type === SideBarBodyGroup) {
			pinned.push(item);
		} else if (React.isValidElement<any>(item) && item.props?.sortable === false) {
			pinned.push(item);
		} else {
			sortableItems.push(item);
		}
	});

	sortableItems.sort((a, b) => {
		if (React.isValidElement<any>(a) && React.isValidElement<any>(b)) {
			return compareLabels(String(a.props?.label ?? ''), String(b.props?.label ?? ''));
		}
		return 0;
	});

	const sortedBodyItems = [...pinned, ...sortableItems];

	const hasActiveChild = (() => {
		const nodeHasActive = (node: React.ReactNode): boolean => {
			if (node == null) {
				return false;
			}

			if (Array.isArray(node)) {
				return node.some(nodeHasActive);
			}

			if (!React.isValidElement(node)) {
				return false;
			}

			if (node.type === SideBarBodyItem || node.type === SideBarBodyItemLink) {
				return Boolean((node as any).props?.active);
			}

			return nodeHasActive((node as any).props?.children);
		};

		return nodeHasActive(children);
	})();

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
		<div className="blue-orange-sidebar-body-group">
			<Accordion opened={effectiveOpened}>
				<AccordionHeader>{headerItems}</AccordionHeader>
				<AccordionBody>{sortedBodyItems}</AccordionBody>
			</Accordion>
		</div>
	)
}