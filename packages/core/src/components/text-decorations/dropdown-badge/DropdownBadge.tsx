import React, {ReactNode} from "react";

import './DropdownBadge.css'
import {Badge} from "../badge/Badge";
import {DropdownTrigger, DropdownTriggerProps} from "../../inputs/dropdown/trigger/DropdownTrigger";

interface Props extends DropdownTriggerProps {
	/** What the badge itself shows. The options go in `children`. */
	label: ReactNode;
	/** The chevron that marks the badge as something to open. */
	chevron?: boolean;
	style?: React.CSSProperties;
}

/**
 * A Badge that opens a dropdown when it is clicked — for a value that is read
 * far more often than it is changed, and so does not warrant a whole input.
 */
export const DropdownBadge: React.FC<Props> = ({
												   children,
												   label,
												   chevron = true,
												   style = {},
												   ...dropdown}) => {

	return (
		<DropdownTrigger
			className="blue-orange-dropdown-badge"
			trigger={
				<Badge style={style}>
					{label}
					{chevron && <i className="ri-arrow-down-s-line blue-orange-dropdown-badge-chevron"></i>}
				</Badge>
			}
			{...dropdown}>
			{children}
		</DropdownTrigger>
	)
}
