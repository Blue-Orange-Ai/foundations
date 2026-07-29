import React, {useContext} from "react";

export enum CarouselOrientation {
	HORIZONTAL = "HORIZONTAL",
	VERTICAL = "VERTICAL"
}

export interface CarouselContextValue {
	orientation: CarouselOrientation;
	/** Index of the first item currently in view. */
	index: number;
	itemCount: number;
	itemsPerView: number;
	gap: number;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	scrollPrev: () => void;
	scrollNext: () => void;
	scrollTo: (index: number) => void;
	/** Called by CarouselContent once it knows how many items it holds. */
	registerItemCount: (count: number) => void;
}

/**
 * Shares the position of a Carousel with its content, items and controls. Kept
 * in its own module so those parts do not import the component rendering them.
 */
export const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export const useCarousel = (): CarouselContextValue | null => {
	return useContext(CarouselContext);
}
