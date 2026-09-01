import React, {ReactNode} from "react";

import './DropdownCompoundTag.css'
import {CompoundTag} from "../compound-tag/CompoundTag";
import {DropdownTrigger, DropdownTriggerProps} from "../../inputs/dropdown/trigger/DropdownTrigger";

interface Props extends DropdownTriggerProps {
	/** The left hand section — the key half of the pair. */
	leftContent?: ReactNode;
	/** The right hand section — the value half of the pair. The options go in `children`. */
	rightContent?: ReactNode;
	/** Swaps the left hand section for a spinner, for a pair whose key is still being resolved. */
	loading?: boolean;
	/** The chevron that marks the tag as something to open. */
	chevron?: boolean;
	leftBackgroundColor?: string;
	leftTextColor?: string;
	rightBackgroundColor?: string;
	rightTextColor?: string;
	round?: boolean;
	fill?: boolean;
	/** Adds a remove button on the right hand section. It opens no popup on its way out. */
	onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A CompoundTag whose value half opens a dropdown — a key, the value it is
 * currently set to, and the other values it could be set to, in one pill.
 */
export const DropdownCompoundTag: React.FC<Props> = ({
														 children,
														 leftContent,
														 rightContent,
														 loading = false,
														 chevron = true,
														 leftBackgroundColor,
														 leftTextColor,
														 rightBackgroundColor,
														 rightTextColor,
														 round = false,
														 fill = false,
														 onRemove,
														 ...dropdown}) => {

	return (
		<DropdownTrigger
			className="blue-orange-dropdown-compound-tag"
			fill={fill}
			trigger={
				<CompoundTag
					leftContent={leftContent}
					loading={loading}
					leftBackgroundColor={leftBackgroundColor}
					leftTextColor={leftTextColor}
					rightBackgroundColor={rightBackgroundColor}
					rightTextColor={rightTextColor}
					round={round}
					fill={fill}
					trailingContent={chevron ? <i className="ri-arrow-down-s-line"></i> : undefined}
					onRemove={onRemove}>
					{rightContent}
				</CompoundTag>
			}
			{...dropdown}>
			{children}
		</DropdownTrigger>
	)
}
