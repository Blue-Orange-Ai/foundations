import React, {ReactNode} from "react";
import {DefaultBlockAlert} from "../defaultalert/DefaultBlockAlert";

interface Props {
	title?: string,
	description?: string,
	action?: ReactNode
}

export const WarningBlockAlert: React.FC<Props> = ({title, description, action}) => {

	const icon = "ri-alarm-warning-fill";

	const className = "blue-orange-warning-alert";

	return (
		<DefaultBlockAlert icon={icon} className={className} title={title} description={description} action={action}></DefaultBlockAlert>
	)
}
