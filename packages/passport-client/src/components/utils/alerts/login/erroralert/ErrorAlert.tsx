import React from "react";
import {DefaultAlert} from "../defaultalert/DefaultAlert";

interface Props {
	title: string,
	description?: string
}

export const ErrorAlert: React.FC<Props> = ({title, description}) => {

	const icon = "ri-alert-fill";

	const className = "passport-error-alert";

	return (
		<DefaultAlert icon={icon} className={className} title={title} description={description}></DefaultAlert>
	)
}