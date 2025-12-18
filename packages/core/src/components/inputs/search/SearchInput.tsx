import React, {useCallback, useEffect, useRef, useState} from "react";
import './SearchInput.css'


interface Props {
	value?: string;
	label?: string;
	icon?: string;
    deletable?: boolean,
    timeout?: number,
	style?: React.CSSProperties;
	onSearchEvent?: (value: string) => void;
}

export const SearchInput: React.FC<Props> = ({
												 value="",
												 label="Filter by keyword",
												 icon,
                                                 deletable=false,
                                                 timeout=500,
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
		}, timeout);
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
        sendInputChange("");
    }

	const inputStyle: React.CSSProperties = {
		paddingLeft: icon === undefined ? "5px" : "42px",
        paddingRight: !deletable ? "5px" : "42px",
		width: icon === undefined ? "calc(100% - 10px)" : "calc(100% - 47px)",
	}

	return (
		<div className="blue-orange-search-group" style={style}>
			{icon !== undefined &&
				<div className="blue-orange-search-group-icon">
					<i className={icon}></i>
				</div>
			}
			<input
				className="blue-orange-search-group-input"
				style={inputStyle}
				value={inputValue === undefined ? "" : inputValue}
				placeholder={label}
				onKeyDown={handleKeydownChange}
				onChange={handleInputChange}/>
            {deletable &&
                <div
                    onClick={handleDelete}
                    className="blue-orange-search-group-icon blue-orange-search-group-icon-deletable">
                    <i className="ri-close-line"></i>
                </div>
            }
		</div>
	)
}