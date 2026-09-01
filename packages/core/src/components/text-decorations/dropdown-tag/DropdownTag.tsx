import React, {ReactNode} from "react";

import './DropdownTag.css'
import {Tag} from "../tag/Tag";
import {DropdownTrigger, DropdownTriggerProps} from "../../inputs/dropdown/trigger/DropdownTrigger";

interface Props extends DropdownTriggerProps {
	/** What the tag itself shows. The options go in `children`. */
	label: ReactNode;
	/** The chevron that marks the tag as something to open. */
	chevron?: boolean;
	backgroundColor?: string;
	textColor?: string;
	round?: boolean;
	fill?: boolean;
}

/**
 * A Tag that opens a dropdown when it is clicked — for a value that is read far
 * more often than it is changed, and so does not warrant a whole input.
 */
export const DropdownTag: React.FC<Props> = ({
												 children,
												 label,
												 chevron = true,
												 backgroundColor,
												 textColor,
												 round = false,
												 fill = false,
												 ...dropdown}) => {

	return (
		<DropdownTrigger
			className="blue-orange-dropdown-tag"
			fill={fill}
			trigger={
				<Tag backgroundColor={backgroundColor} textColor={textColor} round={round} fill={fill}>
					{label}
					{chevron && <i className="ri-arrow-down-s-line blue-orange-dropdown-tag-chevron"></i>}
				</Tag>
			}
			{...dropdown}>
			{children}
		</DropdownTrigger>
	)
}
