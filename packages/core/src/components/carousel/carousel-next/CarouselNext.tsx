import React from "react";

import './CarouselNext.css'
import {CarouselOrientation, useCarousel} from "../carousel/CarouselContext";

interface Props {
	/** Any remixicon class — defaults to an arrow matching the orientation. */
	icon?: string;
	ariaLabel?: string;
	style?: React.CSSProperties;
}

/**
 * Steps the carousel forward by one item.
 */
export const CarouselNext: React.FC<Props> = ({icon, ariaLabel="Next slide", style={}}) => {

	const carousel = useCarousel();

	if (!carousel) {
		return null;
	}

	const vertical = carousel.orientation === CarouselOrientation.VERTICAL;

	const className = carousel.canScrollNext
		? "blue-orange-carousel-control"
		: "blue-orange-carousel-control blue-orange-carousel-control-disabled";

	return (
		<div
			className={className}
			role="button"
			tabIndex={carousel.canScrollNext ? 0 : -1}
			aria-label={ariaLabel}
			aria-disabled={!carousel.canScrollNext}
			onClick={() => carousel.scrollNext()}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					carousel.scrollNext();
				}
			}}
			style={style}>
			<i className={icon ?? (vertical ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line")}></i>
		</div>
	)
}
