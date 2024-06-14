import React, {ReactNode, useEffect, useRef} from "react";

import './AccordionBody.css'

interface Props {
	children: ReactNode
}

export const AccordionBody: React.FC<Props> = ({children}) => {

	return (
		<>{children}</>
	)
}