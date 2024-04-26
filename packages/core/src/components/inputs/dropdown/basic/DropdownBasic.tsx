import React, {useEffect, useRef, useState} from "react";
import './DropdownBasic.css'
import {DropdownItem as DropdownItemObj, DropdownItemType} from "../../../../interfaces/AppInterfaces";
import {DropdownItem} from "../items/DropdownItem/DropdownItem";

interface Props {
	items: Array<DropdownItemObj>,
	disabled?: boolean,
	contextWidth?: number,
	contextMaxHeight?: number,
	closeOnClick?: boolean,
	allowMultipleSelection?: boolean,
	onSelection?: (item: DropdownItemObj) => void,
	onItemsSelected?: (items: Array<DropdownItemObj>) => void,
	onUpdate?: (items: Array<DropdownItemObj>) => void
}

export const DropdownBasic: React.FC<Props> = ({
												   items,
												   disabled,
												   contextWidth,
												   contextMaxHeight,
												   closeOnClick = true,
													allowMultipleSelection = false,
													onSelection,
													onItemsSelected,
													onUpdate
											   }) => {

	const [visible, setVisible] = useState(false);

	const [blockMouseClick, setBlockMouseClick] = useState(false);

	const inputRef = useRef<HTMLDivElement | null>(null);

	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const visibleRef = useRef(visible);

	const blockMouseClickRef = useRef(blockMouseClick);

	useEffect(() => {
		visibleRef.current = visible;
	}, [visible]);

	useEffect(() => {
		blockMouseClickRef.current = blockMouseClick;
	}, [blockMouseClick]);

	const getInitialSelectedValue = () => {
		var selectedVal = undefined
		items.forEach(item => {
			if (item.selected) {
				selectedVal = item
			}
		})
		if (selectedVal !== undefined) {
			return selectedVal;
		}
		return {
			label: "Select a Value....",
			reference: "-1",
			selected: false,
			type: DropdownItemType.TEXT
		}
	}

	const [selectedValue, setSelectedValue] = useState<DropdownItemObj>(getInitialSelectedValue())

	const [selectedItems, setSelectedItems] = useState<Array<DropdownItemObj>>(items.filter(item => item.selected))

	const [modifiedItems, setModifiedItems] = useState<Array<DropdownItemObj>>(items)

	useEffect(() => {
		if (onSelection) {
			onSelection(selectedValue);
		}
	}, [selectedValue]);

	useEffect(() => {
		if (onItemsSelected) {
			onItemsSelected(selectedItems);
		}
	}, [selectedItems]);

	useEffect(() => {
		if (onUpdate) {
			onUpdate(modifiedItems);
		}
	}, [modifiedItems]);

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


	const calculateLeftPosition = () => {
		try{
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			const clientWidth = rect.width;
			const clientLeft = rect.left;
			const width = contextWidth ? contextWidth : clientWidth;
			const offset = (width - clientWidth) / 2;
			return Math.max(0, clientLeft - offset);
		} catch (e) {
			return 0;
		}

	}

	const isPosAbove = () => {
		if (getClientTop() > window.innerHeight / 2) {
			return true;
		}
		return false;
	}

	const getClientTop = () => {
		try {
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			return rect.top;
		} catch (e) {
			return 0;
		}

	}

	const getClientBottom = () => {
		try {
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			return window.innerHeight - rect.bottom;
		} catch (e) {
			return 0;
		}

	}

	const getClientHeight = () => {
		try{
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			return rect.height;
		} catch (e) {
			return 0;
		}

	}

	var dropdownWindowStyle: React.CSSProperties = {
		display: visibleRef ? "flex" : "none",
		flexDirection: "column",
		width: contextWidth == undefined ? inputRef.current?.clientWidth : contextWidth,
		minHeight: "100px",
		maxHeight: contextMaxHeight == undefined ? "200px" : contextMaxHeight,
		left: calculateLeftPosition(),
		bottom: isPosAbove() ? getClientBottom() + getClientHeight() + 10 + "px" : "unset",
		top: !isPosAbove() ? getClientTop() + getClientHeight() + 10 + "px" : "unset"
	}

	const handleClick = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (dropdownRef && isDescendantOf(dropdownRef.current, target)) {
		} else if (visibleRef.current && !blockMouseClickRef.current) {
			setVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	useEffect(() => {
		setSelectedValue(getInitialSelectedValue())
	}, [items]);

	const toggleVisibleState = () => {
		if (visibleRef.current) {
			setVisible(false);
		} else {
			setBlockMouseClick(true);
			setTimeout(() => {
				setBlockMouseClick(false);
			}, 500)
			setVisible(true);

		}
	}

	const updateModifiedItems = (item: DropdownItemObj, modItems: Array<DropdownItemObj>) => {
		setModifiedItems(modItems.map(obj => {
			if (obj.reference === item.reference) {
				return item;
			}
			return obj;
		}));
	}

	const updateSelectedItems = (item: DropdownItemObj, modSelectedItems: Array<DropdownItemObj>) => {
		if (selectedItems.indexOf(item) < 0) {
			selectedItems.push(item);
			setSelectedItems(selectedItems);
		}
	}

	const removeSelectedItems = (item: DropdownItemObj) => {
		if (selectedItems.indexOf(item) >= 0) {
			selectedItems.splice(selectedItems.indexOf(item), 1);
		}
	}

	const handleItemClick = (item: DropdownItemObj) => {
		var modSelectedItems = selectedItems;
		var modItems = modifiedItems;
		if (!allowMultipleSelection) {
			modSelectedItems = [];
			modItems.forEach(item => {
				item.selected = false;
			})
		}
		setSelectedValue(item)
		item.selected = true;
		updateModifiedItems(item, modItems);
		updateSelectedItems(item, modSelectedItems);
		if (closeOnClick) {
			setVisible(false);
		}
	}

	return (
		<div className="blue-orange-dropdown-cont">
			<div ref={inputRef} className="blue-orange-dropdown" onClick={toggleVisibleState}>
				<div className="blue-orange-dropdown-selection">
					<DropdownItem item={selectedValue} displayedValue={true}></DropdownItem>
				</div>
				<div className="blue-orange-dropdown-icon">
					<i className="ri-arrow-down-s-line"></i>
				</div>
			</div>
			{visible &&
				<div ref={dropdownRef} className="blue-orange-dropdown-window shadow" style={dropdownWindowStyle}>
					{modifiedItems.map((item, index) => (
						<div key={index}>
							<DropdownItem item={item} onClick={handleItemClick}></DropdownItem>
						</div>
					))}
				</div>
			}
		</div>



	)
}