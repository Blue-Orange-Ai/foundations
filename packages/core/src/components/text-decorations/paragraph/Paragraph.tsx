import React, {ReactNode} from "react";

import './Paragraph.css'
interface Props {
	children: ReactNode;
	style?: React.CSSProperties;
}
export const Paragraph: React.FC<Props> = ({children, style={}}) => {
	return (
		<p className="blue-orange-default-description" style={style}>{children}</p>
	)
}