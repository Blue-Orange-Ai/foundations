import React, {ReactNode} from "react";

import './SideBarHeader.css'

interface Props {
	children: ReactNode,
}

export const SideBarHeader: React.FC<Props> = ({children}) => {

	return (
		<>{children}</>
	)
}