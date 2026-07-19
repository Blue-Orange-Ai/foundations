import React, {ReactNode} from "react";
import {DefaultBlockAlert} from "../defaultalert/DefaultBlockAlert";

interface Props {
	title?: string,
	description?: string,
	action?: ReactNode
}

export const ErrorBlockAlert: React.FC<Props> = ({title, description, action}) => {

	const icon = "ri-alert-fill";

	const className = "blue-orange-error-alert";

	return (
		<DefaultBlockAlert icon={icon} className={className} title={title} description={description} action={action}></DefaultBlockAlert>
	)
}
