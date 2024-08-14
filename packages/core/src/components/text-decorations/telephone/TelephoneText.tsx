import React, {ReactNode} from "react";

import parsePhoneNumber from 'libphonenumber-js'

import './TelephoneText.css'
import {Telephone} from "@Blue-Orange-Ai/foundations-clients/lib/Passport";

interface Props {
	phone?: string,
	country?: string,
	telephone?: Telephone,
}

export const TelephoneText: React.FC<Props> = ({phone, country, telephone}) => {

	const formatNumber = () => {
		if (phone && country) {
			// @ts-ignore
			const parsedPhone = parsePhoneNumber(phone, country);
			if (parsedPhone) {
				return parsedPhone.formatNational()
			}
			return "Undefined"
		} else if (telephone) {
			// @ts-ignore
			const parsedPhone = parsePhoneNumber(telephone.number, telephone.code);
			if (parsedPhone) {
				return parsedPhone.formatNational()
			}
			return "Undefined"
		}
		return "Undefined";
	}

	const formattedNumber = formatNumber();

	return (
		<>{formattedNumber}</>
	)
}