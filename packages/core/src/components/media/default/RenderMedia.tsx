import React, {ReactNode, useEffect, useRef, useState} from "react";

import './RenderMedia.css'
import {Media} from "@blue-orange-ai/foundations-clients";
import {Image} from "../image/Image";
import {Pdf} from "../pdf/Pdf";
import {BlueOrangeMedia} from "@blue-orange-ai/foundations-clients/lib/BlueOrangeMedia";

interface Props {
	media: Media,
	height?: number,
	width?: number,
	borderRadius?: string,
	fit?: string,
	shadow?: boolean
}
export const RenderMedia: React.FC<Props> = ({
										   		 media,
												 height,
												 width,
												 borderRadius,
												 fit,
												 shadow
									   }) => {
	const [loading, setLoading] = useState(true);

	const [uri, setUri] = useState("");

	useEffect(() => {
		var bom = new BlueOrangeMedia("http://localhost:8086");
		bom.getUrl(media, 120, height).then(url => {
			setUri(url);
		}).catch(error => {
			setLoading(true);
		});
	}, []);

	return (
		<>
			{media.mediaType.toLowerCase() == "image" &&
				<Image
					src={uri}
					alt={""}
					height={height}
					width={width}
					borderRadius={borderRadius}
					fit={fit}
					shadow={shadow}
				></Image>}
			{media.mediaType.toLowerCase() == "pdf" &&
				<Pdf src={uri}></Pdf>}
		</>

	)
}