import React, {ReactNode} from "react";

import './THead.css'

interface Props {
	children: ReactNode
}
export const THead: React.FC<Props> = ({children}) => {


	return (
		<thead>
			{children}
		</thead>
	)
}