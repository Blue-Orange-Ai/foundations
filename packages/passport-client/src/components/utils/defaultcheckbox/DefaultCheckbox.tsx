import React, {useEffect, useRef, useState} from "react";

import './DefaultCheckbox.css';

interface Props {
	checked?:boolean;
	onCheckboxChange?: (checked: boolean) => void;
	readonly?: boolean;
	update?: Date;
	style?: React.CSSProperties;
}

export const DefaultCheckbox: React.FC<Props> = ({
													 checked=false,
													 onCheckboxChange,
													 readonly=false,
													 update,
													 style={}}) => {

	const [isChecked, setIsChecked] = useState(checked);

	useEffect(() => {
		setIsChecked(checked);
	}, [checked, update]);


	const handleCheckboxChange = () => {
		const newChecked = !isChecked;
		setIsChecked(newChecked);
		if (onCheckboxChange) {
			onCheckboxChange(newChecked);
		}
	};

	return (
		<div>
			{readonly &&
				<input type="checkbox"
					   checked={isChecked}
					   readOnly
					   style={style}
				/>
			}
			{!readonly &&
				<input type="checkbox"
					   checked={isChecked}
					   onChange={handleCheckboxChange}
					   style={style}
				/>
			}
		</div>


	);
};