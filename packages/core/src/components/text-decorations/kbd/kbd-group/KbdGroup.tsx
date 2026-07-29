import React from "react";

import './KbdGroup.css'

interface Props {
	children: React.ReactNode;
	/** Rendered between each key, e.g. "+" or "then". */
	separator?: string;
	style?: React.CSSProperties;
}

/**
 * Lays a set of Kbd keys out in a row, optionally joined by a separator.
 */
export const KbdGroup: React.FC<Props> = ({children, separator, style={}}) => {

	const keys = React.Children.toArray(children);

	return (
		<span className="blue-orange-kbd-group" style={style}>
			{keys.map((key, index) => (
				<React.Fragment key={index}>
					{index > 0 && separator &&
						<span className="blue-orange-kbd-group-separator no-select">{separator}</span>
					}
					{key}
				</React.Fragment>
			))}
		</span>
	)
}
