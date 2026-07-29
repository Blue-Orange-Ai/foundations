import React from "react";

import './CommandSeparator.css'

interface Props {
	style?: React.CSSProperties;
}

/**
 * A dividing line between two command groups.
 */
export const CommandSeparator: React.FC<Props> = ({style={}}) => {

	return (
		<div className="blue-orange-command-separator" role="separator" style={style}></div>
	)
}
