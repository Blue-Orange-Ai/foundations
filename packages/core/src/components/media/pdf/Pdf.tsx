import React, {ReactNode, useEffect, useRef} from "react";

import './Pdf.css'

interface Props {
	src: string
}
export const Pdf: React.FC<Props> = ({
										   	src
									   }) => {

	return (
		<div className="blue-orange-media-pdf-canvas">
			<embed src={src + "#sidebarViewOnLoad=0"} className="blue-orange-media-pdf-canvas"></embed>
		</div>

	)
}