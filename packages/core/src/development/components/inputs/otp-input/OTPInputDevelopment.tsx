import React, {useState} from "react";

import './OTPInputDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {InputOTP} from "../../../../components/inputs/otp/input-otp/InputOTP";
import {InputOTPGroup} from "../../../../components/inputs/otp/input-otp-group/InputOTPGroup";
import {InputOTPSlot} from "../../../../components/inputs/otp/input-otp-slot/InputOTPSlot";
import {InputOTPSeparator} from "../../../../components/inputs/otp/input-otp-separator/InputOTPSeparator";
import {InputValidationResult} from "../../../../components/inputs/validation/InputValidation";

interface Props {
}

export const OTPInputDevelopment: React.FC<Props> = ({}) => {

	const [code, setCode] = useState("");

	const [completed, setCompleted] = useState("");

	const validateCode = (value: string): Promise<InputValidationResult> => {
		if (value.length < 6) {
			return Promise.resolve({state: "error", message: "Enter all six digits."});
		}
		if (value !== "123456") {
			return Promise.resolve({state: "error", message: "That code is not right — try 123456."});
		}
		return Promise.resolve({state: "success", message: "Code accepted."});
	}

	return (
		<PaddedPage>
			<PageHeading>OTP Input</PageHeading>
			<Description>
				A one time passcode field. One hidden input holds the value so paste, autofill and
				mobile keyboards all behave, while the slots render each character.
			</Description>

			<GeneralHeading>Default</GeneralHeading>
			<InputOTP maxLength={6} onChange={setCode}></InputOTP>
			<Description>{code ? "Value: " + code : "Nothing entered yet."}</Description>

			<GeneralHeading>Grouped</GeneralHeading>
			<Description>Split the slots with the groups prop, or compose them by hand.</Description>
			<InputOTP
				maxLength={6}
				groups={[3, 3]}
				isNumeric={true}
				label="Verification code"
				onComplete={setCompleted}></InputOTP>
			<Description>{completed ? "Completed with " + completed : "Enter six digits to complete."}</Description>

			<GeneralHeading>Composed by hand</GeneralHeading>
			<InputOTP maxLength={4}>
				<InputOTPGroup>
					<InputOTPSlot index={0}></InputOTPSlot>
					<InputOTPSlot index={1}></InputOTPSlot>
				</InputOTPGroup>
				<InputOTPSeparator icon="ri-close-line"></InputOTPSeparator>
				<InputOTPGroup>
					<InputOTPSlot index={2}></InputOTPSlot>
					<InputOTPSlot index={3}></InputOTPSlot>
				</InputOTPGroup>
			</InputOTP>

			<GeneralHeading>With validation</GeneralHeading>
			<Description>Validation runs on blur — the accepted code is 123456.</Description>
			<InputOTP
				maxLength={6}
				groups={[3, 3]}
				isNumeric={true}
				label="Enter the code we sent you"
				required={true}
				validate={validateCode}></InputOTP>

			<GeneralHeading>Disabled</GeneralHeading>
			<InputOTP maxLength={6} groups={[3, 3]} value="123456" disabled={true}></InputOTP>
		</PaddedPage>
	)
}
