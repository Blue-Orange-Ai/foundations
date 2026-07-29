import React, {useState} from "react";

import './CarouselDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Carousel} from "../../../components/carousel/carousel/Carousel";
import {CarouselOrientation} from "../../../components/carousel/carousel/CarouselContext";
import {CarouselContent} from "../../../components/carousel/carousel-content/CarouselContent";
import {CarouselItem} from "../../../components/carousel/carousel-item/CarouselItem";
import {CarouselPrevious} from "../../../components/carousel/carousel-previous/CarouselPrevious";
import {CarouselNext} from "../../../components/carousel/carousel-next/CarouselNext";
import {Card} from "../../../components/card/card/Card";
import {CardHeader} from "../../../components/card/card-header/CardHeader";
import {CardTitle} from "../../../components/card/card-title/CardTitle";
import {CardDescription} from "../../../components/card/card-description/CardDescription";

interface Props {
}

const SLIDES = [1, 2, 3, 4, 5];

export const CarouselDevelopment: React.FC<Props> = ({}) => {

	const [index, setIndex] = useState(0);

	return (
		<PaddedPage>
			<PageHeading>Carousel</PageHeading>
			<Description>
				A slider built from plain transforms — no extra dependency. The controls, the arrow
				keys and an optional timer all move it.
			</Description>

			<GeneralHeading>One item at a time</GeneralHeading>
			<div className="blue-orange-carousel-development-block">
				<Carousel>
					<CarouselPrevious></CarouselPrevious>
					<CarouselContent>
						{SLIDES.map(slide => (
							<CarouselItem key={slide}>
								<div className="blue-orange-carousel-development-slide">{slide}</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselNext></CarouselNext>
				</Carousel>
			</div>

			<GeneralHeading>Three items in view</GeneralHeading>
			<div className="blue-orange-carousel-development-block">
				<Carousel itemsPerView={3} gap={12}>
					<CarouselPrevious></CarouselPrevious>
					<CarouselContent>
						{SLIDES.map(slide => (
							<CarouselItem key={slide}>
								<Card>
									<CardHeader>
										<CardTitle>{"Slide " + slide}</CardTitle>
										<CardDescription>Any content can sit in an item.</CardDescription>
									</CardHeader>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselNext></CarouselNext>
				</Carousel>
			</div>

			<GeneralHeading>Looping and controlled</GeneralHeading>
			<Description>{"Currently showing slide " + (index + 1) + " of " + SLIDES.length + "."}</Description>
			<div className="blue-orange-carousel-development-block">
				<Carousel loop={true} index={index} onIndexChange={setIndex}>
					<CarouselPrevious></CarouselPrevious>
					<CarouselContent>
						{SLIDES.map(slide => (
							<CarouselItem key={slide}>
								<div className="blue-orange-carousel-development-slide">{slide}</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselNext></CarouselNext>
				</Carousel>
			</div>

			<GeneralHeading>Vertical</GeneralHeading>
			<div className="blue-orange-carousel-development-block blue-orange-carousel-development-vertical">
				<Carousel orientation={CarouselOrientation.VERTICAL} gap={8}>
					<CarouselPrevious></CarouselPrevious>
					<CarouselContent>
						{SLIDES.map(slide => (
							<CarouselItem key={slide}>
								<div className="blue-orange-carousel-development-slide">{slide}</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselNext></CarouselNext>
				</Carousel>
			</div>
		</PaddedPage>
	)
}
