import React, {ReactNode, useEffect, useRef} from "react";

import './BlueOrangeMapWrapper.css'

import { BlueOrangeMap } from '@blue-orange-ai/primitives-map'

import '@blue-orange-ai/primitives-map/dist/css/primitives-map.min.css'


interface Props {
}
export const BlueOrangeMapWrapper: React.FC<Props> = ({}) => {

	const mapRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeMapRef = useRef<BlueOrangeMap | null>(null);

	useEffect(() => {
		const current = mapRef.current as HTMLElement;
		if (blueOrangeMapRef.current == null) {
			blueOrangeMapRef.current = new BlueOrangeMap(
				current,
				[],
				[], []);
		}
	}, []);


	return (
		<div ref={mapRef} className="blue-orange-map-parent"></div>
	)
}