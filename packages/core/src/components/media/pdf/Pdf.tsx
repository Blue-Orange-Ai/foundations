import React, {ReactNode, useEffect, useRef} from "react";

import './Pdf.css'
import {sanitizeUrl} from "../../utils/SanitizeUrl";

interface Props {
	src: string
}
export const Pdf: React.FC<Props> = ({
										   	src
									   }) => {

	// The source often comes from message or media data. An embed will load
	// any document it is pointed at, so only an http(s) (or same-site) address,
	// or an object URL this page created, is used.
	const safeSrc = sanitizeUrl(src, {protocols: ["http:", "https:", "blob:"]});

	return (
		<div className="blue-orange-media-pdf-canvas">
			{safeSrc &&
				<embed src={safeSrc + "#sidebarViewOnLoad=0"} type="application/pdf" className="blue-orange-media-pdf-canvas"></embed>
			}
		</div>

	)
}