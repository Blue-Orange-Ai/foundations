import React, {useState, useRef, useEffect, ReactNode} from 'react';

import './ContextMenu.css'

export interface IContextMenuItem {
	label: string,
	icon?: string,
	value: any
}

interface Props {
	children: ReactNode;
	width: number;
	maxHeight: number;
	items: Array<IContextMenuItem>;
	onClick?: (arg0: IContextMenuItem) => void;
}

type ForwardingRefWrapperProps = {
	children?: React.ReactNode;
};

export const ContextMenu: React.FC<Props> = ({children, items, width, maxHeight, onClick}) => {

	const [visible, setVisible] = useState(false);
	const [style, setStyle] = useState<React.CSSProperties>({});
	const childRef = useRef<any | null>(null);

	const contextMenuRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef(null);
	const visibleRef = useRef(visible);

	useEffect(() => {
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	useEffect(() => {
		visibleRef.current = visible;
	}, [visible]);

	const handleClick = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (contextMenuRef && isDescendantOf(contextMenuRef.current, target)) {
			handleContextMenu(e)
		} else if (visibleRef.current) {
			setVisible(false);
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

	const handleContextMenu = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (visibleRef.current && isDescendantOf(menuRef.current, target) == null) {
			setVisible(false);
		} else if (!visibleRef.current) {
			e.preventDefault();
			const button = childRef.current as HTMLElement;
			setContextMenuStyle(button);
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
			close();
		}
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
						<div
							key={index}
							className="blue-orange-default-context-menu-row no-select"
							onClick={() => handleItemClick(item)}>
							{item.icon && (
								<div className="blue-orange-default-context-menu-row-icon"><i className={item.icon}></i></div>
							)}
							<div className="blue-orange-default-context-menu-row-general-text" dangerouslySetInnerHTML={{ __html: item.label }}></div>
						</div>
					))}
				</div>

			)}
		</div>
	);
}