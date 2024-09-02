import React, {ReactNode} from "react";

import './Description.css'
interface Props {
	children: ReactNode;
	style?: React.CSSProperties;
}
export const Description: React.FC<Props> = ({children, style={}}) => {
	return (
		<p className="blue-orange-default-paragraph" style={style}>{children}</p>
	)
}