import React from "react";

import './PaginationEllipsis.css'

interface Props {
	style?: React.CSSProperties;
}

/**
 * Marks the pages skipped over between two page links.
 */
export const PaginationEllipsis: React.FC<Props> = ({style={}}) => {

	return (
		<div className="blue-orange-pagination-ellipsis no-select" aria-hidden={true} style={style}>
			<i className="ri-more-line"></i>
		</div>
	)
}
