import React, {useEffect, useRef, useState} from "react";

import './Toggle.css';

interface Props {
	checked?:boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	update?: Date;
	style?: React.CSSProperties;
}

export const Toggle: React.FC<Props> = ({
													 checked=false,
											         onChange,
													 disabled=false,
													 update,
													 style={}}) => {

	const isChecked = useRef<boolean>(checked);

	const [isCheckedState, setIsCheckedState] = useState(checked);

	const isCheckDisabled = useRef<boolean>(disabled);

	useEffect(() => {
		saveCheckboxState(checked);
	}, [checked, update]);


	const saveCheckboxState = (state: boolean) => {
		if (!isCheckDisabled.current) {
			isChecked.current = state;
			setIsCheckedState(isChecked.current);
			isCheckDisabled.current = true;
			setTimeout(() => {
				isCheckDisabled.current = false;
			}, 50);
		}
		if (onChange) {
			onChange(isChecked.current);
		}
	}

	const toggleChecked = () => {
		if (!isCheckDisabled.current) {
			saveCheckboxState(!isChecked.current);
		}
	};

	const handleCheckboxChange = () => {
		const newChecked = !isChecked.current;
		saveCheckboxState(newChecked)
		if (onChange) {
			onChange(newChecked);
		}
	};

	return (
		<>
			<label className="blue-orange-toggle-switch" onClick={toggleChecked}>
				<input
					type="checkbox"
					className={"blue-orange-toggle-switch-input " + isCheckedState}
					checked={isCheckedState}
					onChange={handleCheckboxChange}
					readOnly={true}
				/>
				<span className="blue-orange-toggle-switch-slider"></span>
			</label>
		</>
	);
};