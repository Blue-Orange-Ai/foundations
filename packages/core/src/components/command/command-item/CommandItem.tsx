import React, {useEffect, useRef} from "react";

import './CommandItem.css'
import {commandTextFromChildren, useCommand, useCommandGroup} from "../command/CommandContext";

interface Props {
	children: React.ReactNode;
	/** The text the item is filtered on — defaults to its rendered text. */
	value?: string;
	/** A remixicon class shown before the label. */
	icon?: string;
	disabled?: boolean;
	onSelect?: (value: string) => void;
	style?: React.CSSProperties;
}

var nextCommandItemId = 0;

/**
 * A single selectable row of a command palette.
 */
export const CommandItem: React.FC<Props> = ({
												 children,
												 value,
												 icon,
												 disabled = false,
												 onSelect,
												 style = {}}) => {

	const command = useCommand();

	const group = useCommandGroup();

	const idRef = useRef<string>("");

	if (idRef.current === "") {
		nextCommandItemId++;
		idRef.current = "blue-orange-command-item-" + nextCommandItemId;
	}

	const id = idRef.current;

	const itemValue = value ?? commandTextFromChildren(children);

	const visible = command ? command.matches(itemValue) : true;

	// onSelect is read through a ref so re-registering is only ever about the
	// value or visibility changing, never about a new callback identity.
	const selectRef = useRef<() => void>(() => {});

	selectRef.current = () => {
		if (!disabled && onSelect) {
			onSelect(itemValue);
		}
	};

	const registerItem = command?.registerItem;

	const unregisterItem = command?.unregisterItem;

	useEffect(() => {
		if (!registerItem) {
			return;
		}
		registerItem({
			id: id,
			value: itemValue,
			visible: visible,
			disabled: disabled,
			select: () => selectRef.current()
		});
	}, [registerItem, id, itemValue, visible, disabled]);

	useEffect(() => {
		return () => {
			if (unregisterItem) {
				unregisterItem(id);
			}
		}
	}, [unregisterItem, id]);

	const registerItemVisibility = group?.registerItemVisibility;

	const unregisterFromGroup = group?.unregisterItem;

	useEffect(() => {
		if (registerItemVisibility) {
			registerItemVisibility(id, visible);
		}
	}, [registerItemVisibility, id, visible]);

	useEffect(() => {
		return () => {
			if (unregisterFromGroup) {
				unregisterFromGroup(id);
			}
		}
	}, [unregisterFromGroup, id]);

	if (!visible) {
		return null;
	}

	const active = command?.activeId === id;

	const generateClassName = () => {
		var className = "blue-orange-command-item no-select";
		if (active) {
			className += " blue-orange-command-item-active";
		}
		if (disabled) {
			className += " blue-orange-command-item-disabled";
		}
		return className;
	}

	return (
		<div
			className={generateClassName()}
			role="option"
			aria-selected={active}
			aria-disabled={disabled}
			onMouseEnter={() => {
				if (!disabled && command) {
					command.setActiveId(id);
				}
			}}
			onClick={() => selectRef.current()}
			style={style}>
			{icon && <i className={icon + " blue-orange-command-item-icon"}></i>}
			<div className="blue-orange-command-item-content">{children}</div>
		</div>
	)
}
