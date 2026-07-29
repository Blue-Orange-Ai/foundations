import React from "react";

import './CommandEmpty.css'
import {useCommand} from "../command/CommandContext";

interface Props {
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Shown in place of the list when nothing survives the search.
 */
export const CommandEmpty: React.FC<Props> = ({children="No results found.", style={}}) => {

	const command = useCommand();

	if (!command || command.visibleCount > 0) {
		return null;
	}

	return (
		<div className="blue-orange-command-empty" style={style}>
			{children}
		</div>
	)
}
