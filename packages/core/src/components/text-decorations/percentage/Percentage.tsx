import React, {ReactNode} from "react";

import './Percentage.css'

interface Props {
	percent: number,
	decimalPlaces?: number,
	numberFormat?: string
}

export const Percentage: React.FC<Props> = ({percent, decimalPlaces, numberFormat="en-AU"}) => {

	const formatNumber = () => {
		if (decimalPlaces) {
			return new Intl.NumberFormat(numberFormat, {
				style: 'percent',
				minimumFractionDigits: decimalPlaces,
				maximumFractionDigits: decimalPlaces,
			}).format(percent)
		}
		return new Intl.NumberFormat(numberFormat, {
			style: 'percent'
		}).format(percent)
	}

	const formattedNumber = formatNumber();

	return (
		<>{formattedNumber}</>
	)
}