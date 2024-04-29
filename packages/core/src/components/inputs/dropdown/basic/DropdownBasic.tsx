import React, {useEffect, useRef, useState} from "react";
import './DropdownBasic.css'
import {DropdownItem as DropdownItemObj, DropdownItemType} from "../../../../interfaces/AppInterfaces";
import {DropdownItem} from "../items/DropdownItem/DropdownItem";
import {Input} from "../../input/Input";
import Fuse from "fuse.js";
import {Checkbox} from "../../checkbox/Checkbox";

interface Props {
	items: Array<DropdownItemObj>,
	disabled?: boolean,
	contextWidth?: number,
	contextMaxHeight?: number,
	closeOnClick?: boolean,
	allowMultipleSelection?: boolean,
	onSelection?: (item: DropdownItemObj) => void,
	onItemsSelected?: (items: Array<DropdownItemObj>) => void,
	onUpdate?: (items: Array<DropdownItemObj>) => void,
	filter?: boolean
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
													onUpdate,
													filter=false
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

	const fuseOptions = {
		keys: [
			"label",
		]
	};

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

	const [queryItems, setQueryItems] = useState<Array<DropdownItemObj>>(items)

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
		paddingBottom: "10px",
		maxHeight: contextMaxHeight == undefined ? "200px" : contextMaxHeight,
		left: calculateLeftPosition(),
		bottom: isPosAbove() ? getClientBottom() + getClientHeight() + 10 + "px" : "unset",
		top: !isPosAbove() ? getClientTop() + getClientHeight() + 10 + "px" : "unset",
	}

	var dropdownItemStyle: React.CSSProperties = {
		marginTop: filter ? "54px" : "unset",
		width: "100%",
		height: "100%",
		overflow: "auto"
	}

	const handleClick = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (dropdownRef && isDescendantOf(dropdownRef.current, target)) {
		} else if (visibleRef.current && !blockMouseClickRef.current) {
			setVisible(false);
		}
	};

	const handleKeyDownEvent = (e:KeyboardEvent) => {
		if (e.key == "ArrowDown" && visible) {
			e.preventDefault();
			for (var i=0; i < queryItems.length; i++) {

			}
		} else if (e.key == "ArrowUp" && visible) {
			e.preventDefault();

		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClick);
		document.addEventListener('keydown', handleKeyDownEvent)
		return () => {
			document.removeEventListener('click', handleClick);
			document.removeEventListener('keydown', handleKeyDownEvent);
		}
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
			handleFilterChange("");
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

	const handleFilterChange = (query: string) => {
		if (query == "" || query == undefined) {
			var queryItems = modifiedItems;
			queryItems.forEach(item => item.focused = false);
			for (let item of queryItems) {
				if (item.type !== DropdownItemType.HEADING && !item.disabled) {
					item.focused = true
					break; // Breaks out of the loop if the condition is met
				}
			}
			setQueryItems(queryItems);
		} else {
			const fuse = new Fuse(modifiedItems.filter(item =>
				item.type != DropdownItemType.HEADING), fuseOptions);
			const queryItems = fuse.search(query).map(fuseItem => fuseItem.item);
			if (queryItems.length <= 0) {
				setQueryItems([{
					label: "No items found..",
					reference: "-1",
					selected: false,
					disabled: true,
					type: DropdownItemType.TEXT
				}])
			} else {
				queryItems.forEach(item => item.focused = false);
				queryItems[0].focused = true;
				setQueryItems(queryItems);
			}
		}
	}

	const generateItemStyle = (item: DropdownItemObj) => {
		var className = "blue-orange-dropdown-item-cont"
		if (item.type != DropdownItemType.HEADING && !item.disabled) {
			className += " blue-orange-dropdown-item-hoverable"
		}
		if (item.disabled) {
			className += " blue-orange-dropdown-item-disabled"
		}
		if (item.focused) {
			className += " blue-orange-dropdown-item-focused"
		}
		return className;
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
					{filter &&
						<div className="blue-orange-dropdown-window-filter-cont">
							<Input placeholder={"Filter..."} style={{height: "32px", fontSize: "14px"}} onInputChange={handleFilterChange} focus={true}></Input>
						</div>
					}
					<div style={dropdownItemStyle}>
						{queryItems.map((item, index) => (
							<div key={index} className={generateItemStyle(item)}>
								{allowMultipleSelection && item.type != DropdownItemType.HEADING &&
									<div className="blue-orange-dropdown-item-check-cont">
										<Checkbox checked={item.selected} readonly={item.disabled}></Checkbox>
									</div>
								}
								<div className="blue-orange-dropdown-item-el-cont">
									<DropdownItem item={item} onClick={handleItemClick}></DropdownItem>
								</div>
							</div>
						))}
					</div>
				</div>
			}
		</div>



	)
}