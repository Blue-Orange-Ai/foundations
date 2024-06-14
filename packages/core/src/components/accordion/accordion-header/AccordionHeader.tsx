import React, {ReactNode} from "react";

import './AccordionHeader.css'

interface Props {
	children: ReactNode,
}

export const AccordionHeader: React.FC<Props> = ({children}) => {

	return (
		<>{children}</>
	)
}