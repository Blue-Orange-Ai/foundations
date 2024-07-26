import React, {ReactNode, useEffect, useRef} from "react";

import './BlueOrangeMapWrapper.css'

import { BlueOrangeMap } from '@Blue-Orange-Ai/primitives-map'

import '@Blue-Orange-Ai/primitives-map/dist/css/@Blue-Orange-Ai/primitives-map.min.css'


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