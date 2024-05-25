import React, {ReactNode} from "react";

import './SideBarBody.css'

interface Props {
	children: ReactNode,
}

export const SideBarBody: React.FC<Props> = ({children}) => {

	return (
		<>{children}</>
	)
}