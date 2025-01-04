import React, {useState} from "react";
import './SearchInput.css'


interface Props {
	onInputChange?: (value: string) => void;
}

export const SearchInput: React.FC<Props> = ({onInputChange}) => {

	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onInputChange) {
			const newValue = event.target.value;
			onInputChange(newValue);
		}
	};

	return (
		<input className="passport-search-input" placeholder="Search...."/>
	)
}