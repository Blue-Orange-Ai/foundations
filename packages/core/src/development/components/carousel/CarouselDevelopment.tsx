import React, {useState} from "react";

import './CarouselDevelopment.css'
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
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const DEMO_SLIDES = ["One", "Two", "Three", "Four", "Five"];

const CAROUSEL_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "A CarouselContent, and whichever controls the carousel should carry."
	},
	{
		name: "orientation",
		type: "CarouselOrientation",
		default: "CarouselOrientation.HORIZONTAL",
		defaultValue: CarouselOrientation.HORIZONTAL,
		control: "select",
		options: [
			{label: "Horizontal", value: CarouselOrientation.HORIZONTAL, code: "CarouselOrientation.HORIZONTAL"},
			{label: "Vertical", value: CarouselOrientation.VERTICAL, code: "CarouselOrientation.VERTICAL"}
		],
		description: "Which way the slides move. The controls turn their arrows to match."
	},
	{
		name: "itemsPerView",
		type: "number",
		default: "1",
		control: "slider",
		min: 1,
		max: 4,
		step: 1,
		description: "How many slides are visible at once. Each item takes its share of the width."
	},
	{
		name: "gap",
		type: "number",
		default: "16",
		control: "slider",
		min: 0,
		max: 48,
		step: 4,
		description: "Space between slides, in pixels. It is taken out of the item width rather than added to it."
	},
	{
		name: "loop",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Wraps around when stepping past either end, instead of stopping there."
	},
	{
		name: "index",
		type: "number",
		control: "number",
		description: "The slide in view. Setting it moves the carousel from the outside."
	},
	{
		name: "onIndexChange",
		type: "(index: number) => void",
		description: "Fires with the new index whenever the carousel moves."
	},
	{
		name: "autoPlay",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Steps the carousel on a timer."
	},
	{
		name: "autoPlayInterval",
		type: "number",
		default: "4000",
		control: "number",
		description: "Milliseconds between automatic steps."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the carousel."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the carousel."
	}
];

const CAROUSEL_ITEM_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The slide's content."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the slide, merged over the width it works out for itself."
	}
];

const CAROUSEL_CONTROL_PROPS: Array<PropSpec> = [
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "Any remixicon class. Left off, an arrow matching the orientation is used."
	},
	{
		name: "ariaLabel",
		type: "string",
		default: "\"Previous slide\"",
		control: "text",
		description: "What a screen reader announces the control as."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the control."
	}
];

const CAROUSEL_NEXT_PROPS: Array<PropSpec> = [
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "Any remixicon class. Left off, an arrow matching the orientation is used."
	},
	{
		name: "ariaLabel",
		type: "string",
		default: "\"Next slide\"",
		control: "text",
		description: "What a screen reader announces the control as."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the control."
	}
];

interface Props {
}

const SLIDES = [1, 2, 3, 4, 5];

export const CarouselDevelopment: React.FC<Props> = ({}) => {

	const [index, setIndex] = useState(0);

	return (
		<ComponentDoc
			title="Carousel"
			description="A slider built from plain transforms, with no extra dependency behind it. The controls, the arrow keys and an optional timer all move it, and it can show more than one item at a time."
			name="Carousel"
			previewHeight={260}
			imports={["CarouselContent", "CarouselItem", "CarouselPrevious", "CarouselNext", "CarouselOrientation"]}
			props={CAROUSEL_PROPS}
			snippetChildren={() => "<CarouselContent>\n\t<CarouselItem>One</CarouselItem>\n\t<CarouselItem>Two</CarouselItem>\n\t<CarouselItem>Three</CarouselItem>\n</CarouselContent>\n<CarouselPrevious></CarouselPrevious>\n<CarouselNext></CarouselNext>"}
			preview={values => (
				<div style={{width: "100%", maxWidth: "420px"}}>
					<Carousel
						orientation={values.orientation}
						itemsPerView={values.itemsPerView}
						gap={values.gap}
						loop={values.loop}
						autoPlay={values.autoPlay}
						autoPlayInterval={values.autoPlayInterval}>
						<CarouselContent>
							{DEMO_SLIDES.map(slide => (
								<CarouselItem key={slide}>
									<div className="blue-orange-carousel-development-slide">{slide}</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious></CarouselPrevious>
						<CarouselNext></CarouselNext>
					</Carousel>
				</div>
			)}
			siblings={[
				{
					name: "CarouselItem",
					description: "One slide. It works out its own width from the carousel's itemsPerView and gap, so nothing has to be sized by hand.",
					props: CAROUSEL_ITEM_PROPS,
					previewHeight: 140,
					snippetChildren: () => "<div>Slide one</div>",
					preview: () => (
						<div className="blue-orange-carousel-development-slide" style={{width: "220px"}}>Slide one</div>
					)
				},
				{
					name: "CarouselPrevious",
					description: "The step back control. It disables itself at the start unless the carousel loops.",
					props: CAROUSEL_CONTROL_PROPS,
					previewHeight: 120,
					preview: values => (
						<Carousel>
							<CarouselContent>
								<CarouselItem>One</CarouselItem>
								<CarouselItem>Two</CarouselItem>
							</CarouselContent>
							<CarouselPrevious icon={values.icon} ariaLabel={values.ariaLabel}></CarouselPrevious>
						</Carousel>
					)
				},
				{
					name: "CarouselNext",
					description: "The step forward control. It disables itself at the end unless the carousel loops.",
					props: CAROUSEL_NEXT_PROPS,
					previewHeight: 120,
					preview: values => (
						<Carousel>
							<CarouselContent>
								<CarouselItem>One</CarouselItem>
								<CarouselItem>Two</CarouselItem>
							</CarouselContent>
							<CarouselNext icon={values.icon} ariaLabel={values.ariaLabel}></CarouselNext>
						</Carousel>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
