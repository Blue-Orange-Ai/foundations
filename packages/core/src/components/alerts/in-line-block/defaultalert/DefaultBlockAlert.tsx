import React, {ReactNode} from "react";

import './DefaultBlockAlert.css';

interface Props {
	icon?: string,
	className?: string,
	title?: string,
	description?: string,
	action?: ReactNode
}
export const DefaultBlockAlert: React.FC<Props> = ({icon = "ri-lightbulb-fill", className, title, description, action}) => {

	const defaultClassName = "blue-orange-default-alert";

	const style = className == undefined ? defaultClassName : defaultClassName + " " + className;

	const descriptionOnly = title === undefined && description !== undefined;

	return (
		<div className={style}>
			<div className="blue-orange-default-alert-icon">
				<i className={icon}></i>
			</div>
			<div className={descriptionOnly ? "blue-orange-default-alert-main-body blue-orange-default-alert-main-body-description-only" : "blue-orange-default-alert-main-body"}>
				{title !== undefined && (
					<div className="blue-orange-default-alert-main-body-title">{title}</div>
				)}
				{description !== undefined && (
					<div className="blue-orange-default-alert-main-body-description">{description}</div>
				)}
			</div>
			{action !== undefined && (
				<div className="blue-orange-default-alert-action">{action}</div>
			)}
		</div>
	)
}
