import React, {ReactNode} from "react";
import {DefaultBlockAlert} from "../defaultalert/DefaultBlockAlert";

interface Props {
	title?: string,
	description?: string,
	action?: ReactNode
}

export const SuccessBlockAlert: React.FC<Props> = ({title, description, action}) => {

	const icon = "ri-checkbox-circle-fill";

	const className = "blue-orange-success-alert";

	return (
		<DefaultBlockAlert icon={icon} className={className} title={title} description={description} action={action}></DefaultBlockAlert>
	)
}
