import React from "react";
import {DefaultBlockAlert} from "../defaultalert/DefaultBlockAlert";

interface Props {
	title: string,
	description?: string
}

export const ErrorBlockAlert: React.FC<Props> = ({title, description}) => {

	const icon = "ri-alert-fill";

	const className = "passport-error-alert";

	return (
		<DefaultBlockAlert icon={icon} className={className} title={title} description={description}></DefaultBlockAlert>
	)
}