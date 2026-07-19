import React, {ReactNode} from "react";
import {DefaultBlockAlert} from "../defaultalert/DefaultBlockAlert";

interface Props {
	title?: string,
	description?: string,
	action?: ReactNode
}

export const InfoBlockAlert: React.FC<Props> = ({title, description, action}) => {
	return (
		<DefaultBlockAlert title={title} description={description} action={action}></DefaultBlockAlert>
	)
}
