import React, {useEffect} from "react";

import './CarouselContent.css'
import {CarouselOrientation, useCarousel} from "../carousel/CarouselContext";

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * The window the items slide through. Must sit inside a Carousel.
 */
export const CarouselContent: React.FC<Props> = ({children, style={}}) => {

	const carousel = useCarousel();

	const itemCount = React.Children.toArray(children).length;

	const registerItemCount = carousel?.registerItemCount;

	useEffect(() => {
		if (registerItemCount) {
			registerItemCount(itemCount);
		}
	}, [itemCount, registerItemCount]);

	if (!carousel) {
		return null;
	}

	const vertical = carousel.orientation === CarouselOrientation.VERTICAL;

	// One step is the width of an item plus the gap that follows it. An item is
	// (100% - gap * (n - 1)) / n wide, so a step works out as 100%/n + gap/n —
	// translating by the percentage alone would leave a gap-sized sliver of the
	// previous item showing, growing by one gap for every step taken.
	const round = (value: number): number => {
		return Math.round(value * 10000) / 10000;
	}

	const offsetPercent = round(carousel.index * (100 / carousel.itemsPerView));

	const offsetPixels = round(carousel.index * (carousel.gap / carousel.itemsPerView));

	const shift = offsetPixels === 0
		? "-" + offsetPercent + "%"
		: "calc(-" + offsetPercent + "% - " + offsetPixels + "px)";

	const trackStyle: React.CSSProperties = vertical
		? {transform: "translate3d(0, " + shift + ", 0)", gap: carousel.gap + "px"}
		: {transform: "translate3d(" + shift + ", 0, 0)", gap: carousel.gap + "px"};

	return (
		<div
			className={vertical
				? "blue-orange-carousel-viewport blue-orange-carousel-viewport-vertical"
				: "blue-orange-carousel-viewport"}
			style={style}>
			<div
				className={vertical
					? "blue-orange-carousel-track blue-orange-carousel-track-vertical"
					: "blue-orange-carousel-track"}
				style={trackStyle}>
				{children}
			</div>
		</div>
	)
}
