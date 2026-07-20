import React, {useCallback, useEffect, useRef, useState, useMemo} from "react";
import './SearchInput.css'
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

export interface SearchSuggestion {
	label: string;
	value: string;
	icon?: string;
}

export interface SearchSuggestionGroup {
	groupLabel?: string;
	suggestions: SearchSuggestion[];
}


interface Props {
	value?: string;
	label?: string;
	icon?: string;
	deletable?: boolean;
	timeout?: number;
	style?: React.CSSProperties;
	suggestionGroups?: SearchSuggestionGroup[];
	onChange?: (value: string) => void;
	onSearchEvent?: (value: string) => void;
	onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
	validate?: InputValidateCallback<string>;
	validateOnChange?: boolean;
}

export const SearchInput: React.FC<Props> = ({
												 value="",
												 label="Filter by keyword",
												 icon,
												 deletable=false,
												 timeout=500,
												 style={},
												 suggestionGroups,
												 onChange,
												 onSearchEvent,
												 onSuggestionSelect,
												 validate,
												 validateOnChange=false}) => {

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange);

	const [inputValue, setInputValue] = useState(value);
	const [isFocused, setIsFocused] = useState(false);
	const [showAbove, setShowAbove] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const startTimeout = (value: string) => {
		// Clear any existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			sendInputChange(value);
		}, timeout);
	};

	const cancelTimeout = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};



	const handleKeydownChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			cancelTimeout();
			sendInputChange(inputValue);
		} else if (event.key === "Escape") {
			event.preventDefault();
			setIsFocused(false);
			(event.target as HTMLInputElement).blur();
		}
	}
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		if (onChange) {
			onChange(newValue);
		}
		handleChangeValidation(newValue);
		if (timeout > 0) {
			startTimeout(newValue);
		} else {
			sendInputChange(newValue);
		}
	};

	const sendInputChange = (value: string) => {
		if (onSearchEvent) {
			onSearchEvent(value);
		}
	}

    const handleDelete = () => {
		setInputValue("");
		if (onChange) {
			onChange("");
		}
		sendInputChange("");
		handleChangeValidation("");
	}

	const handleFocus = () => {
		setIsFocused(true);
		updateDropdownPosition();
	};

	const handleBlur = (event: React.FocusEvent) => {
		const relatedTarget = event.relatedTarget as Node;
		if (dropdownRef.current && dropdownRef.current.contains(relatedTarget)) {
			return;
		}
		setIsFocused(false);
		handleBlurValidation(inputValue);
	};

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		setInputValue(suggestion.value);
		setIsFocused(false);
		if (onSuggestionSelect) {
			onSuggestionSelect(suggestion);
		}
		if (onSearchEvent) {
			onSearchEvent(suggestion.value);
		}
		handleChangeValidation(suggestion.value);
	};

	const updateDropdownPosition = () => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			const spaceAbove = rect.top;
			const dropdownHeight = 200;
			setShowAbove(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
		}
	};

	const hasSuggestions = useMemo(() => {
		return suggestionGroups && suggestionGroups.some(group => group.suggestions.length > 0);
	}, [suggestionGroups]);

	const inputStyle: React.CSSProperties = {
		paddingLeft: icon === undefined ? "5px" : "42px",
		paddingRight: !deletable ? "5px" : "42px",
	}

	return (
		<div 
			ref={containerRef}
			className="blue-orange-search-group" 
			style={style}
			onBlur={handleBlur}
		>
			{icon !== undefined &&
				<div className="blue-orange-search-group-icon">
					<i className={icon}></i>
				</div>
			}
			<input
				className={"blue-orange-search-group-input" + (isError ? " blue-orange-search-group-input-error" : "")}
				style={inputStyle}
				value={inputValue === undefined ? "" : inputValue}
				placeholder={label}
				onKeyDown={handleKeydownChange}
				onChange={handleInputChange}
				onFocus={handleFocus}
			/>
			{deletable &&
				<div
					onClick={handleDelete}
					className="blue-orange-search-group-icon blue-orange-search-group-icon-deletable">
					<i className="ri-close-line"></i>
				</div>
			}
			{isFocused && hasSuggestions && (
				<div 
					ref={dropdownRef}
					className={`blue-orange-search-suggestions ${showAbove ? 'blue-orange-search-suggestions-above' : ''}`}
					tabIndex={-1}
				>
					{suggestionGroups?.map((group, groupIndex) => (
						<div key={groupIndex} className="blue-orange-search-suggestion-group">
							{group.groupLabel && (
								<div className="blue-orange-search-suggestion-group-label">
									{group.groupLabel}
								</div>
							)}
							{group.suggestions.map((suggestion, suggestionIndex) => (
								<div
									key={suggestionIndex}
									className="blue-orange-search-suggestion-item"
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => handleSuggestionClick(suggestion)}
								>
									{suggestion.icon && (
										<i className={`${suggestion.icon} blue-orange-search-suggestion-icon`}></i>
									)}
									<span>{suggestion.label}</span>
								</div>
							))}
						</div>
					))}
				</div>
			)}
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	)
}