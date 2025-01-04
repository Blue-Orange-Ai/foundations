import React from "react";

import './DefaultBtn.css';

interface Props {
	label: string;
	onClick?: () => void;
	isDisabled?: boolean;
	isLoading?: boolean;
	style?: React.CSSProperties
}

export const DefaultBtn: React.FC<Props> = ({
												label,
												onClick,
												isDisabled = false,
												isLoading = false,
												style={}}) => {

	const handleClick = () => {
		if (!isDisabled && !isLoading && onClick) {
			onClick();
		}
	};

	const defaultStyle = "passport-default-btn no-select"

	const loadingClassName = isDisabled || isLoading ? defaultStyle + " passport-default-btn-disabled" : defaultStyle;

	return (
		<div className={loadingClassName} onClick={handleClick} style={style}>
			{isLoading ? <i className="ri-loader-4-line rotate-spinner"></i> : label}
		</div>
	)
}