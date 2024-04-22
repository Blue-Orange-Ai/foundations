import React, {ReactNode} from "react";

import './Row.css'

interface Props {
	children: ReactNode
}
export const Row: React.FC<Props> = ({children}) => {


	return (
		<tr>
			{children}
		</tr>
	)
}