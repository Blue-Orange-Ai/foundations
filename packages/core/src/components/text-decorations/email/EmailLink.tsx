import React, {ReactNode} from "react";

import './EmailLink.css'

interface Props {
	email: string
}

// One address and nothing else: no `?cc=`/`&body=` parameters smuggled into
// the mailto link, no second recipient, no spaces or markup.
const EMAIL = /^[^\s@<>()\[\]\\,;:"?&#%]+@[^\s@<>()\[\]\\,;:"?&#%]+$/;

export const EmailLink: React.FC<Props> = ({email}) => {

	if (typeof email !== "string" || !EMAIL.test(email.trim())) {
		return (
			<span>{email}</span>
		)
	}

	return (
		<a href={"mailto:" + email.trim()}>{email}</a>
	)
}