import React from "react";
import {DefaultAlert} from "../defaultalert/DefaultAlert";

interface Props {
	title: string,
	description?: string
}

export const SuccessAlert: React.FC<Props> = ({title, description}) => {

	const icon = "ri-checkbox-circle-fill";

	const className = "passport-success-alert";

	return (
		<DefaultAlert icon={icon} className={className} title={title} description={description}></DefaultAlert>
	)
}