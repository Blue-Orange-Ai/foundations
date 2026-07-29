import React, {useState} from "react";

import './SliderDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Slider, SliderOrientation, SliderValue} from "../../../../components/inputs/slider/Slider";
import {InputValidationResult} from "../../../../components/inputs/validation/InputValidation";

interface Props {
}

export const SliderDevelopment: React.FC<Props> = ({}) => {

	const [volume, setVolume] = useState<SliderValue>(40);

	const [priceRange, setPriceRange] = useState<SliderValue>([20, 70]);

	const validateBudget = (value: SliderValue): Promise<InputValidationResult> => {
		const amount = Array.isArray(value) ? value[0] : value;
		if (amount > 800) {
			return Promise.resolve({state: "error", message: "That is over the approval limit."});
		}
		return Promise.resolve({state: "success", message: "Within the approval limit."});
	}

	return (
		<PaddedPage>
			<PageHeading>Slider</PageHeading>
			<Description>
				A draggable value selector. Pass a number for one thumb or an array for a range — both
				work with the pointer and the keyboard.
			</Description>

			<GeneralHeading>Single value</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider label="Volume" value={volume} showValue={true} onChange={setVolume}></Slider>
			</div>

			<GeneralHeading>Range</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider
					label="Price range"
					value={priceRange}
					showValue={true}
					formatValue={(value) => "£" + value}
					onChange={setPriceRange}></Slider>
			</div>

			<GeneralHeading>Steps</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider label="Temperature" min={16} max={28} step={0.5} value={21} showValue={true}
						formatValue={(value) => value + "°C"}></Slider>
			</div>

			<GeneralHeading>Vertical</GeneralHeading>
			<div className="blue-orange-slider-development-row">
				<Slider orientation={SliderOrientation.VERTICAL} value={30}></Slider>
				<Slider orientation={SliderOrientation.VERTICAL} value={60}></Slider>
				<Slider orientation={SliderOrientation.VERTICAL} value={[20, 80]}></Slider>
			</div>

			<GeneralHeading>Disabled</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider label="Locked" value={50} showValue={true} disabled={true}></Slider>
			</div>

			<GeneralHeading>With validation</GeneralHeading>
			<Description>Validation runs when the drag finishes — anything over 800 is rejected.</Description>
			<div className="blue-orange-slider-development-block">
				<Slider
					label="Monthly budget"
					min={0}
					max={1000}
					step={50}
					value={400}
					showValue={true}
					formatValue={(value) => "£" + value}
					validate={validateBudget}></Slider>
			</div>
		</PaddedPage>
	)
}
