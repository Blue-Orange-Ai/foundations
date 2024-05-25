import React, {ReactNode} from "react";

import './SideBarFooter.css'

interface Props {
	children: ReactNode,
}

export const SideBarFooter: React.FC<Props> = ({children}) => {

	return (
		<>{children}</>
	)
}