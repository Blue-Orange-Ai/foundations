import React, {useState, useRef, useEffect, ReactNode} from 'react';

import './ContextMenu.css'
import {ContextMenuHeading} from "../context-menu-heading/ContextMenuHeading";
import {ContextMenuItem} from "../context-menu-item/ContextMenuItem";
import {ContextMenuSeparator} from "../context-menu-separator/ContextMenuSeparator";

export enum IContextMenuType {
	CONTENT=0,
	SEPARATOR=1,
	HEADING=2
}

export interface IContextMenuItem {
	label: string,
	type: IContextMenuType,
	icon?: string,
	checked?: boolean,
	rightIcon?: string,
	children?: Array<IContextMenuItem>,
	value: any
}

interface Props {
	children: ReactNode;
	width?: number;
	maxHeight?: number;
	items: Array<IContextMenuItem>;
	onClick?: (arg0: IContextMenuItem) => void;
	disabled?: boolean;
	rightClick?: boolean;
	contextFixedToClick?: boolean;
	open?: boolean;
	startingX?: number;
	startingY?: number;
}

type ForwardingRefWrapperProps = {
	children?: React.ReactNode;
};

export const ContextMenu: React.FC<Props> = ({
												 children,
												 items,
												 width=256,
												 maxHeight=325,
												 onClick,
												 disabled = false,
												 rightClick=false,
												 contextFixedToClick=true,
												 open=false,
												 startingX=0,
												 startingY=0,
											 }) => {

	const [visible, setVisible] = useState(false);
	const [style, setStyle] = useState<React.CSSProperties>({});
	const childRef = useRef<any | null>(null);

	const contextMenuRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef(null);
	const visibleRef = useRef(visible);

	useEffect(() => {
		document.addEventListener('click', handleClick);
		document.addEventListener('contextmenu', handleRightClick);
		if (open) {
			setContextMenuStyleClickPos(startingX, startingY);
			setVisible(true);
		}
		return () => {
			document.removeEventListener('click', handleClick);
			document.removeEventListener('contextmenu', handleRightClick);
		}
	}, []);

	useEffect(() => {
		visibleRef.current = visible;
	}, [visible]);

	const handleClick = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!disabled && !rightClick) {
			if (contextMenuRef && isDescendantOf(contextMenuRef.current, target)) {
				handleContextMenu(e)
			} else if (visibleRef.current) {
				setVisible(false);
			}
		} else if (rightClick && visibleRef.current && !isDescendantOf(contextMenuRef.current, target)) {
			setVisible(false);
		}
	};

	const handleRightClick = (e:MouseEvent) => {
		if (!disabled && rightClick) {
			e.preventDefault();
			const target = e.target as HTMLElement;
			if (contextMenuRef && isDescendantOf(contextMenuRef.current, target)) {
				handleContextMenu(e)
			} else if (visibleRef.current) {
				setVisible(false);
			}
		}
	};

	const isDescendantOf = (parent:HTMLElement | null, child:HTMLElement | null) =>{
		if (parent && child) {
			if (parent === child) {
				return child
			}
			try{
				var node = child.parentElement;
				while (node != null){
					if (node === parent){
						return node;
					}
					node = node.parentElement;
				}
				return null;
			} catch (e) {
				return null;
			}
		}
		return null;
	}


	const setContextMenuStyle = (button: HTMLElement) => {
		const rect = button.getBoundingClientRect();
		const innerHeight = window.innerHeight;
		const innerWidth = window.innerWidth;
		const buttonCenterHeight = rect.top + (rect.height / 2);
		const buttonCenterWidth = rect.left + (rect.width / 2);
		var style: React.CSSProperties = {}
		style.width = width + "px";
		style.maxHeight = maxHeight + "px";
		if (buttonCenterHeight > innerHeight / 2) {
			style.bottom = innerHeight - (rect.top - 10) + "px";
		} else {
			style.top = (rect.bottom + 10) + "px";
		}
		if (buttonCenterWidth + width / 2 > innerWidth - 15) {
			style.right = (innerWidth + 15) + "px";
		} else {
			style.left = Math.max(buttonCenterWidth - width / 2, 15) + "px"
		}
		setStyle(style);
	}

	const setContextMenuStyleClickPos = (x: number, y: number) => {
		const innerHeight = window.innerHeight;
		const innerWidth = window.innerWidth;
		var style: React.CSSProperties = {}
		style.width = width + "px";
		style.maxHeight = maxHeight + "px";
		if (y > innerHeight / 2) {
			style.bottom = innerHeight - (y - 10) + "px";
		} else {
			style.top = (y + 10) + "px";
		}
		if ((x - (width / 2)) > innerWidth - 15) {
			style.right = (innerWidth + 15) + "px";
		} else {
			style.left = Math.max((x - (width / 2)), 15) + "px"
		}
		setStyle(style);
	}

	const handleContextMenu = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (visibleRef.current && isDescendantOf(menuRef.current, target) == null) {
			setVisible(false);
		} else if (!visibleRef.current) {
			e.preventDefault();
			var button = childRef.current as HTMLElement;
			if (button.children.length > 0) {
				button = button.children[0] as HTMLElement;
			}
			if (contextFixedToClick) {
				setContextMenuStyleClickPos(e.x, e.y);
			} else {
				setContextMenuStyle(button);
			}
			setVisible(true);
		}
	};

	const ForwardingRefWrapper = React.forwardRef<HTMLDivElement, ForwardingRefWrapperProps>(
		(props, ref) => {
			return <div ref={ref}>{props.children}</div>;
		}
	);

	const close = () => {
		setVisible(false);
	}

	const handleItemClick = (item: IContextMenuItem) => {
		if (onClick) {
			onClick(item);
		}
		close();
	};

	return (
		<div ref={contextMenuRef}>
			<ForwardingRefWrapper ref={childRef}>
				{children}
			</ForwardingRefWrapper>
			{visible && (
				<div
					className="blue-orange-default-context-menu shadow"
					ref={menuRef}
					style={style}
				>
					{items.map((item, index) => (
						<div key={index}>
							{item.type == IContextMenuType.HEADING && (
								<ContextMenuHeading item={item} onClick={handleItemClick}></ContextMenuHeading>
							)}
							{item.type == IContextMenuType.CONTENT && (
								<ContextMenuItem item={item} onClick={handleItemClick}></ContextMenuItem>
							)}
							{item.type == IContextMenuType.SEPARATOR && (
								<ContextMenuSeparator item={item} onClick={handleItemClick}></ContextMenuSeparator>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}