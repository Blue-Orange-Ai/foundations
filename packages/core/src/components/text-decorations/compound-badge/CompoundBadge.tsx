import React, {ReactNode} from "react";

import './CompoundBadge.css'
import {Spinner} from "../../loading/spinner/Spinner";

interface Props {
	/** The left hand section — the key half of the pair. */
	leftContent?: ReactNode;
	/** The right hand section — the value half of the pair. */
	children?: ReactNode;
	/** Swaps the left hand section for a spinner, for a pair whose key is still being resolved. */
	loading?: boolean;
	/** Sits at the end of the right hand section, after the value and before the remove button. */
	trailingContent?: ReactNode;
	round?: boolean;
	fill?: boolean;
	style?: React.CSSProperties;
	leftStyle?: React.CSSProperties;
	rightStyle?: React.CSSProperties;
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
	/** Adds a remove button on the right hand section. */
	onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CompoundBadge: React.FC<Props> = ({
												   leftContent,
												   children,
												   loading = false,
												   trailingContent,
												   round = false,
												   fill = false,
												   style = {},
												   leftStyle = {},
												   rightStyle = {},
												   onClick,
												   onRemove
											   }) => {

	const classes = ["blue-orange-compound-badge", "no-select"];
	if (round) {
		classes.push("blue-orange-compound-badge-round");
	}
	if (fill) {
		classes.push("blue-orange-compound-badge-fill");
	}
	if (onClick) {
		classes.push("blue-orange-compound-badge-interactive");
	}

	const removeClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		// The remove button sits inside the pill, so without this an interactive
		// badge would fire its own onClick on the way out.
		event.stopPropagation();
		if (onRemove) {
			onRemove(event);
		}
	}

	return (
		<div className={classes.join(" ")} style={style} onClick={onClick}>
			<div className="blue-orange-compound-badge-left" style={leftStyle}>
				{/* sized and coloured off the half it sits in, so it reads as the key it replaced */}
				{loading
					? <Spinner fontSize="1em" color="currentColor" style={{gap: "0"}}></Spinner>
					: leftContent}
			</div>
			<div className="blue-orange-compound-badge-right" style={rightStyle}>
				{children !== undefined && children !== null && children !== "" &&
					<span className="blue-orange-compound-badge-text">{children}</span>}
				{trailingContent !== undefined && trailingContent !== null && trailingContent !== "" &&
					<span className="blue-orange-compound-badge-trailing">{trailingContent}</span>}
				{onRemove &&
					<button type="button" className="blue-orange-compound-badge-remove" onClick={removeClicked}>
						<i className="ri-close-line"></i>
					</button>}
			</div>
		</div>
	)
}
