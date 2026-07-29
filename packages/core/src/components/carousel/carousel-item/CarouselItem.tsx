import React from "react";

import './CarouselItem.css'
import {useCarousel} from "../carousel/CarouselContext";

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * A single slide. Its size comes from the `itemsPerView` of the Carousel.
 */
export const CarouselItem: React.FC<Props> = ({children, style={}}) => {

	const carousel = useCarousel();

	const itemsPerView = carousel?.itemsPerView ?? 1;

	const gap = carousel?.gap ?? 0;

	// the gap eats into the width, so each item gives up its share of it
	const basis = "calc(" + (100 / itemsPerView) + "% - " + ((gap * (itemsPerView - 1)) / itemsPerView) + "px)";

	const itemStyle: React.CSSProperties = {
		flex: "0 0 " + basis,
		...style
	};

	return (
		<div className="blue-orange-carousel-item" role="group" aria-roledescription="slide" style={itemStyle}>
			{children}
		</div>
	)
}
