import React from 'react';

import './Breadcrumbs.css';
import {ContextMenu, IContextMenuItem, IContextMenuType} from "../contextmenu/contextmenu/ContextMenu";

export interface BreadCrumb {
	type: "URL" | "reference";
	url?: string;
	reference?: string;
	label: string;
}

interface Props {
	items: Array<BreadCrumb>;
	onClick?: (item: BreadCrumb) => void;
	maxItems?: number;
	separator?: string;
}

export const Breadcrumbs: React.FC<Props> = ({
	items,
	onClick,
	maxItems = 5,
	separator = "/"
}) => {

	const handleClick = (item: BreadCrumb) => {
		if (onClick) {
			onClick(item);
		}
	};

	const handleContextMenuClick = (contextItem: IContextMenuItem) => {
		if (onClick && contextItem.value) {
			onClick(contextItem.value as BreadCrumb);
		}
	};

	const getVisibleAndHiddenItems = (): { visible: Array<{ item: BreadCrumb; originalIndex: number }>; hidden: Array<{ item: BreadCrumb; originalIndex: number }> } => {
		if (items.length <= maxItems) {
			return {
				visible: items.map((item, index) => ({ item, originalIndex: index })),
				hidden: []
			};
		}

		// Always show the last item
		// Then reveal items from the start of the list
		// The middle items get hidden
		const slotsForStart = maxItems - 1; // Reserve 1 slot for the last item
		const startItems = items.slice(0, slotsForStart).map((item, index) => ({ item, originalIndex: index }));
		const lastItem = { item: items[items.length - 1], originalIndex: items.length - 1 };
		const hiddenItems = items.slice(slotsForStart, items.length - 1).map((item, index) => ({ item, originalIndex: slotsForStart + index }));

		return {
			visible: [...startItems, lastItem],
			hidden: hiddenItems
		};
	};

	const { visible, hidden } = getVisibleAndHiddenItems();

	const hiddenContextMenuItems: Array<IContextMenuItem> = hidden.map(({ item }) => ({
		type: IContextMenuType.CONTENT,
		label: item.label,
		value: item
	}));

	const renderBreadcrumbItem = (item: BreadCrumb, index: number, isLast: boolean) => {
		return (
			<React.Fragment key={index}>
				<div
					className={`blue-orange-breadcrumb-item ${isLast ? 'blue-orange-breadcrumb-item-current' : ''}`}
					onClick={() => handleClick(item)}
				>
					{item.label}
				</div>
				{!isLast && (
					<div className="blue-orange-breadcrumb-separator">{separator}</div>
				)}
			</React.Fragment>
		);
	};

	const renderEllipsis = () => {
		return (
			<React.Fragment>
				<ContextMenu
					items={hiddenContextMenuItems}
					onClick={handleContextMenuClick}
				>
					<div className="blue-orange-breadcrumb-ellipsis">...</div>
				</ContextMenu>
				<div className="blue-orange-breadcrumb-separator">{separator}</div>
			</React.Fragment>
		);
	};

	return (
		<div className="blue-orange-breadcrumbs">
			{visible.map(({ item, originalIndex }, visibleIndex) => {
				const isLast = visibleIndex === visible.length - 1;
				const isBeforeHidden = hidden.length > 0 && visibleIndex === visible.length - 2;

				return (
					<React.Fragment key={originalIndex}>
						{renderBreadcrumbItem(item, originalIndex, isLast)}
						{isBeforeHidden && renderEllipsis()}
					</React.Fragment>
				);
			})}
		</div>
	);
};
