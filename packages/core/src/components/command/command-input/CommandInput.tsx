import React, {useEffect, useRef} from "react";

import './CommandInput.css'
import {useCommand} from "../command/CommandContext";

interface Props {
	placeholder?: string;
	/** A remixicon class shown before the field. */
	icon?: string;
	autoFocus?: boolean;
	disabled?: boolean;
	/** Fires when escape is pressed — usually closes the palette. */
	onEscape?: () => void;
	style?: React.CSSProperties;
}

/**
 * The search field of a command palette. Typing filters the list and the arrow
 * keys move through it.
 */
export const CommandInput: React.FC<Props> = ({
												  placeholder = "Type a command or search…",
												  icon = "ri-search-line",
												  autoFocus = false,
												  disabled = false,
												  onEscape,
												  style = {}}) => {

	const command = useCommand();

	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
		}
	}, [autoFocus]);

	if (!command) {
		return null;
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Escape" && onEscape) {
			event.preventDefault();
			onEscape();
		} else if (event.key === "Home") {
			event.preventDefault();
			command.moveActive(-9999);
		} else if (event.key === "End") {
			event.preventDefault();
			command.moveActive(9999);
		}
	}

	return (
		<div className="blue-orange-command-input-cont" style={style}>
			{icon && <i className={icon + " blue-orange-command-input-icon"}></i>}
			<input
				ref={inputRef}
				className="blue-orange-command-input"
				type="text"
				role="combobox"
				aria-expanded={true}
				aria-autocomplete="list"
				placeholder={placeholder}
				disabled={disabled}
				value={command.search}
				onChange={(event) => command.setSearch(event.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</div>
	)
}
