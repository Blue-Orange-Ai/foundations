import React, {ReactNode, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Row.css'

interface Props {
	children: ReactNode,
	background?: string,
	hoverEffect?: boolean,
	hoverBackgroundColor?: string,
	id?: string
}
export const Row: React.FC<Props> = ({children, background = "transparent", hoverEffect = true, hoverBackgroundColor = "#e0e1e2", id}) => {

	const [hover, setHover] = useState(false);

	const rowId = id ? id : uuidv4();

	const rowStyle: React.CSSProperties = {
		backgroundColor: hover && hoverEffect  ? hoverBackgroundColor : background,
		transition: 'background-color 0.3s ease'
	}

	return (
		<tr
			style={rowStyle}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}>
			{React.Children.map(children, child => {
				if (React.isValidElement(child)) {
					const additionalProps = { hover, rowId };
					return React.cloneElement(child, additionalProps);
				}
				return child;
			})}
		</tr>
	)
}