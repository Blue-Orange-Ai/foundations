import React from "react";

import './DefaultBlockAlert.css';

interface Props {
	icon?: string,
	className?: string,
	title: string,
	description?: string
}
export const DefaultBlockAlert: React.FC<Props> = ({icon = "ri-lightbulb-fill", className, title, description}) => {

	const defaultClassName = "blue-orange-default-alert";

	const style = className == undefined ? defaultClassName : defaultClassName + " " + className;

	return (
		<div className={style}>
			<div className="blue-orange-default-alert-icon">
				<i className={icon}></i>
			</div>
			<div className="blue-orange-default-alert-main-body">
				<div className="blue-orange-default-alert-main-body-title">{title}</div>
				{description !== undefined && (
					<div className="blue-orange-default-alert-main-body-description">{description}</div>
				)}
			</div>
		</div>
	)
}