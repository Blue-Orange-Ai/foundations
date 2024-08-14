import React, {ReactNode} from "react";

import './EmailLink.css'

interface Props {
	email: string
}

export const EmailLink: React.FC<Props> = ({email}) => {

	return (
		<a href={"mailto:" + email}>{email}</a>
	)
}