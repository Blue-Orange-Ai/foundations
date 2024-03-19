import React from "react";
import {DefaultBlockAlert} from "../defaultalert/DefaultBlockAlert";

interface Props {
	title: string,
	description?: string
}

export const InfoBlockAlert: React.FC<Props> = ({title, description}) => {
	return (
		<DefaultBlockAlert title={title} description={description}></DefaultBlockAlert>
	)
}