import React, {ReactNode} from "react";

import './TFooter.css'

interface Props {
	children: ReactNode
}
export const TFooter: React.FC<Props> = ({children}) => {


	return (
		<tfoot>
			{children}
		</tfoot>
	)
}