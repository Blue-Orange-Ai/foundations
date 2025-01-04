import React, {useCallback, useEffect, useRef, useState} from "react";
import './SearchInput2.css'


interface Props {
	value?: string;
	label?: string;
	icon?: string;
	style?: React.CSSProperties;
	onSearchEvent?: (value: string) => void;
}

export const SearchInput2: React.FC<Props> = ({
												 value="",
												 label="Filter by keyword",
												 icon,
												 style={},
												 onSearchEvent}) => {

	const [inputValue, setInputValue] = useState(value);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const startTimeout = (value: string) => {
		// Clear any existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			sendInputChange(value);
		}, 500);
	};

	const cancelTimeout = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};



	const handleKeydownChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if ((event.key === "Enter")) {
			event.preventDefault();
			cancelTimeout();
			sendInputChange(inputValue);
		}
	}
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue(newValue);
		startTimeout(newValue);
	};

	const sendInputChange = (value: string) => {
		if (onSearchEvent) {
			onSearchEvent(value);
		}
	}



	const inputStyle: React.CSSProperties = {
		paddingLeft: icon === undefined ? "5px" : "42px",
		width: icon === undefined ? "calc(100% - 10px)" : "calc(100% - 47px)",
	}

	return (
		<div className="passport-search2-group" style={style}>
			{icon !== undefined &&
				<div className="passport-search2-group-icon">
					<i className={icon}></i>
				</div>
			}
			<input
				className="passport-search2-group-input"
				style={inputStyle}
				value={inputValue === undefined ? "" : inputValue}
				placeholder={label}
				onKeyDown={handleKeydownChange}
				onChange={handleInputChange}/>
		</div>
	)
}