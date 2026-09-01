import React, {ReactNode} from "react";

import './DropdownCompoundBadge.css'
import {CompoundBadge} from "../compound-badge/CompoundBadge";
import {DropdownTrigger, DropdownTriggerProps} from "../../inputs/dropdown/trigger/DropdownTrigger";

interface Props extends DropdownTriggerProps {
	/** The left hand section — the key half of the pair. */
	leftContent?: ReactNode;
	/** The right hand section — the value half of the pair. The options go in `children`. */
	rightContent?: ReactNode;
	/** Swaps the left hand section for a spinner, for a pair whose key is still being resolved. */
	loading?: boolean;
	/** The chevron that marks the badge as something to open. */
	chevron?: boolean;
	round?: boolean;
	fill?: boolean;
	style?: React.CSSProperties;
	leftStyle?: React.CSSProperties;
	rightStyle?: React.CSSProperties;
	/** Adds a remove button on the right hand section. It opens no popup on its way out. */
	onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A CompoundBadge whose value half opens a dropdown — a key, the value it is
 * currently set to, and the other values it could be set to, in one pill.
 */
export const DropdownCompoundBadge: React.FC<Props> = ({
														   children,
														   leftContent,
														   rightContent,
														   loading = false,
														   chevron = true,
														   round = false,
														   fill = false,
														   style = {},
														   leftStyle = {},
														   rightStyle = {},
														   onRemove,
														   ...dropdown}) => {

	return (
		<DropdownTrigger
			className="blue-orange-dropdown-compound-badge"
			fill={fill}
			trigger={
				<CompoundBadge
					leftContent={leftContent}
					loading={loading}
					round={round}
					fill={fill}
					style={style}
					leftStyle={leftStyle}
					rightStyle={rightStyle}
					trailingContent={chevron ? <i className="ri-arrow-down-s-line"></i> : undefined}
					onRemove={onRemove}>
					{rightContent}
				</CompoundBadge>
			}
			{...dropdown}>
			{children}
		</DropdownTrigger>
	)
}
