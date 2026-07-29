import React, {ReactNode, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Row.css'

interface Props {
	children: ReactNode,
	background?: string,
	hoverEffect?: boolean,
	hoverBackgroundColor?: string,
	onClick?: (id: string) => void,
	id?: string,
	rowRef?: React.Ref<HTMLTableRowElement>
}
export const Row: React.FC<Props> = ({
										 children,
										 background = "transparent",
										 hoverEffect = true,
										 hoverBackgroundColor,
										 onClick,
										 id,
										 rowRef}) => {

	const [hover, setHover] = useState(false);

	const rowId = id ? id : uuidv4();

	const hovered = hover && hoverEffect;

	// with no colour given the hover background is left to CSS so it can follow the light and dark themes
	const themedHover = hovered && hoverBackgroundColor === undefined;

	const rowStyle: React.CSSProperties = {
		transition: 'background-color 0.3s ease'
	}

	if (!themedHover) {
		rowStyle.backgroundColor = hovered ? hoverBackgroundColor : background;
	}

	const rowClicked = () => {
		if (onClick) {
			onClick(rowId);
		}
	}

	return (
		<tr
			className={themedHover ? "blue-orange-table-row blue-orange-table-row-hover" : "blue-orange-table-row"}
			style={rowStyle}
			ref={rowRef}
			onClick={rowClicked}
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