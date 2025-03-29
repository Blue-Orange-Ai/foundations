import React, {ReactNode} from "react";

import './NumberUnits.css'

interface Props {
	value: number,
	unit: string,
	decimalPlaces?: number,
	numberFormat?: string
}

export const NumberUnits: React.FC<Props> = ({value, unit, decimalPlaces, numberFormat="en-AU"}) => {

	const formatNumber = () => {
		if (decimalPlaces) {
			return new Intl.NumberFormat(numberFormat, {
				style: "unit",
				unit: unit,
				minimumFractionDigits: decimalPlaces,
				maximumFractionDigits: decimalPlaces,
			}).format(value)
		}
		return new Intl.NumberFormat(numberFormat, {
			style: "unit",
			unit: unit,
		}).format(value)
	}

	const formattedNumber = formatNumber();

	return (
		<>{formattedNumber}</>
	)
}