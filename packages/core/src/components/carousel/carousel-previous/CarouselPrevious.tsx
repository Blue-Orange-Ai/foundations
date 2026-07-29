import React from "react";

import './CarouselPrevious.css'
import {CarouselOrientation, useCarousel} from "../carousel/CarouselContext";

interface Props {
	/** Any remixicon class — defaults to an arrow matching the orientation. */
	icon?: string;
	ariaLabel?: string;
	style?: React.CSSProperties;
}

/**
 * Steps the carousel back by one item.
 */
export const CarouselPrevious: React.FC<Props> = ({icon, ariaLabel="Previous slide", style={}}) => {

	const carousel = useCarousel();

	if (!carousel) {
		return null;
	}

	const vertical = carousel.orientation === CarouselOrientation.VERTICAL;

	const className = carousel.canScrollPrev
		? "blue-orange-carousel-control"
		: "blue-orange-carousel-control blue-orange-carousel-control-disabled";

	return (
		<div
			className={className}
			role="button"
			tabIndex={carousel.canScrollPrev ? 0 : -1}
			aria-label={ariaLabel}
			aria-disabled={!carousel.canScrollPrev}
			onClick={() => carousel.scrollPrev()}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					carousel.scrollPrev();
				}
			}}
			style={style}>
			<i className={icon ?? (vertical ? "ri-arrow-up-s-line" : "ri-arrow-left-s-line")}></i>
		</div>
	)
}
