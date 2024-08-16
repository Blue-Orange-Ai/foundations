import React from "react";
import {DefaultBlockAlert} from "../defaultalert/DefaultBlockAlert";

interface Props {
	title: string,
	description?: string
}

export const SuccessBlockAlert: React.FC<Props> = ({title, description}) => {

	const icon = "ri-checkbox-circle-fill";

	const className = "blue-orange-warning-alert";

	return (
		<DefaultBlockAlert icon={icon} className={className} title={title} description={description}></DefaultBlockAlert>
	)
}