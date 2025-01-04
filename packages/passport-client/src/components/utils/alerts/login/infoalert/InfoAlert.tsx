import React from "react";
import {DefaultAlert} from "../defaultalert/DefaultAlert";

interface Props {
	title: string,
	description?: string
}

export const InfoAlert: React.FC<Props> = ({title, description}) => {
	return (
		<DefaultAlert title={title} description={description}></DefaultAlert>
	)
}