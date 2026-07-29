import React, {useEffect, useRef, useState} from "react";

import './Carousel.css'
import {CarouselContext, CarouselContextValue, CarouselOrientation} from "./CarouselContext";

interface Props {
	children: React.ReactNode;
	orientation?: CarouselOrientation;
	/** How many items are visible at once. */
	itemsPerView?: number;
	/** Space between items, in pixels. */
	gap?: number;
	/** Wraps around when stepping past either end. */
	loop?: boolean;
	/** The item in view. Updating it moves the carousel from the outside. */
	index?: number;
	onIndexChange?: (index: number) => void;
	autoPlay?: boolean;
	autoPlayInterval?: number;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A horizontal (or vertical) slider. Nest a CarouselContent holding
 * CarouselItems, then add a CarouselPrevious and CarouselNext control.
 */
export const Carousel: React.FC<Props> = ({
											  children,
											  orientation = CarouselOrientation.HORIZONTAL,
											  itemsPerView = 1,
											  gap = 16,
											  loop = false,
											  index,
											  onIndexChange,
											  autoPlay = false,
											  autoPlayInterval = 4000,
											  classes = "",
											  style = {}}) => {

	const [current, setCurrent] = useState(index ?? 0);

	const [itemCount, setItemCount] = useState(0);

	const currentRef = useRef(current);
	currentRef.current = current;

	const maxIndex = Math.max(itemCount - itemsPerView, 0);

	useEffect(() => {
		if (index !== undefined) {
			setCurrent(index);
		}
	}, [index]);

	// keep the position valid when items are added or removed
	useEffect(() => {
		if (current > maxIndex) {
			setCurrent(maxIndex);
		}
	}, [maxIndex]);

	const moveTo = (next: number) => {
		const clamped = Math.min(Math.max(next, 0), maxIndex);
		setCurrent(clamped);
		if (onIndexChange) {
			onIndexChange(clamped);
		}
	}

	const scrollPrev = () => {
		if (currentRef.current <= 0) {
			if (loop) {
				moveTo(maxIndex);
			}
			return;
		}
		moveTo(currentRef.current - 1);
	}

	const scrollNext = () => {
		if (currentRef.current >= maxIndex) {
			if (loop) {
				moveTo(0);
			}
			return;
		}
		moveTo(currentRef.current + 1);
	}

	useEffect(() => {
		if (!autoPlay || itemCount === 0 || autoPlayInterval <= 0) {
			return;
		}
		const timer = setInterval(() => {
			if (currentRef.current >= maxIndex) {
				moveTo(0);
			} else {
				moveTo(currentRef.current + 1);
			}
		}, autoPlayInterval);
		return () => clearInterval(timer);
	}, [autoPlay, autoPlayInterval, maxIndex, itemCount]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			event.preventDefault();
			scrollPrev();
		} else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			event.preventDefault();
			scrollNext();
		}
	}

	const contextValue: CarouselContextValue = {
		orientation: orientation,
		index: current,
		itemCount: itemCount,
		itemsPerView: itemsPerView,
		gap: gap,
		canScrollPrev: loop ? itemCount > 0 : current > 0,
		canScrollNext: loop ? itemCount > 0 : current < maxIndex,
		scrollPrev: scrollPrev,
		scrollNext: scrollNext,
		scrollTo: moveTo,
		registerItemCount: setItemCount
	};

	const generateClassName = () => {
		var className = "blue-orange-carousel";
		if (orientation === CarouselOrientation.VERTICAL) {
			className += " blue-orange-carousel-vertical";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	return (
		<CarouselContext.Provider value={contextValue}>
			<div
				className={generateClassName()}
				role="region"
				aria-roledescription="carousel"
				tabIndex={0}
				onKeyDown={handleKeyDown}
				style={style}>
				{children}
			</div>
		</CarouselContext.Provider>
	)
}
