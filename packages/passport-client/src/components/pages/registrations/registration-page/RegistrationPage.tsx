import {
	AddressInput,
	AvatarEmpty, Button, ButtonType,
	Checkbox,
	Input,
	InputForm,
	PaddedPage,
	PageHeading,
	PhoneInput
} from "@blue-orange-ai/foundations-core";
import React, {useEffect, useState} from "react";


import {Address, Telephone} from "@blue-orange-ai/foundations-clients";
import passport from "@blue-orange-ai/foundations-core/src/components/config/BlueOrangePassportConfig";
import Cookies from "js-cookie";
import {useLocation, useNavigate} from "react-router-dom";
import {ErrorAlert} from "../../../utils/alerts/login/erroralert/ErrorAlert";

import './RegistrationPage.css'

interface Props {
	defaultDomain?: string,
	defaultRedirectUri?: string,
	signInUri?: string,
	passwordResetUri?: string,
	showTermsAgreement?: boolean,
	termsLink?: string,
	privacyLink?: string,
	notificationLink?: string,
	showUsername?: boolean,
	showName?: boolean,
	showAddress?: boolean,
	showPhone?: boolean,
}

export const RegistrationPage: React.FC<Props> = ({
													  defaultDomain="root",
													  defaultRedirectUri="/login",
													  signInUri="/login",
													  passwordResetUri="/reset",
													  showTermsAgreement = true,
													  termsLink = "/terms",
													  privacyLink = "/privacy",
													  notificationLink = "/notifcation",
													  showUsername=true,
													  showName=true,
													  showPhone=true,
													  showAddress=true
}) => {


	const location = useLocation();

	const navigate = useNavigate();

	const defaultErrorInputStyle: React.CSSProperties = {
		border: "1.5px solid #b03a2e",
		backgroundColor: "#fadbd8",
		color: "#b03a2e"
	}

	const termsErrorStyle: React.CSSProperties = {
		color: "#b03a2e"
	}

	const [username, setUsername] = useState("");

	const [usernameStyle, setUsernameStyle] = useState<React.CSSProperties>({});

	const [termsAndConditionsState, setTermsAndConditionsState] = useState(!showTermsAgreement);

	const [termsAndConditionsStyle, setTermsAndConditionsStyle] = useState<React.CSSProperties>({});

	const [email, setEmail] = useState("");

	const [emailStyle, setEmailStyle] = useState<React.CSSProperties>({});

	const [fullName, setFullName] = useState("");

	const [fullNameStyle, setFullNameStyle] = useState<React.CSSProperties>({});

	const [password, setPassword] = useState("");

	const [passwordStyle, setPasswordStyle] = useState<React.CSSProperties>({});

	const [password2, setPassword2] = useState("");

	const [password2Style, setPassword2Style] = useState<React.CSSProperties>({});

	const [telephone, setTelephone] = useState<Telephone | undefined>(undefined);

	const [telephoneStyle, setTelephoneStyle] = useState<React.CSSProperties>({});

	const [address, setAddress] = useState<Address | undefined>(undefined);

	const [addressStyle, setAddressStyle] = useState<React.CSSProperties>({});

	const [error, setError] = useState(false);

	const [errorDescription, setErrorDescription] = useState("");

	const [loading, setLoading] = useState(false);


	const login = () => {
		setError(false);
		setLoading(true);
		passport.login({
			username: username,
			password: password,
			domain: defaultDomain
		}).then(response => {
			const expiryDate = new Date(response.expiry);
			Cookies.set("authorization", response.token, { expires: expiryDate});
			setLoading(false);
			if (response.forcePasswordReset) {
				navigate(passwordResetUri);
			}
			const searchParams = new URLSearchParams(location.search);
			const redirectUri = searchParams.get('redirect_uri');
			if (redirectUri) {
				navigate(decodeURIComponent(redirectUri));
			} else {
				navigate(defaultRedirectUri);
			}
		}).catch(response => {
			setError(true);
			setErrorDescription(response);
			setLoading(false);
		})
	}

	const validateSubmission = (): boolean => {
		var error = false;
		var errorMessage = ""
		if (showName && fullName == "") {
			error = true;
			errorMessage = "The name field cannot be empty";
			setFullNameStyle(defaultErrorInputStyle);
		}
		if (showUsername && username == "") {
			error = true;
			errorMessage = errorMessage == "" ? "You must provide a valid username." : errorMessage + "\nYou must provide a valid username.";
			setUsernameStyle(defaultErrorInputStyle);
		}
		if (email == "") {
			error = true;
			errorMessage = errorMessage == "" ? "You must provide a valid email." : errorMessage + "\nYou must provide a valid email.";
			setEmailStyle(defaultErrorInputStyle);
		}
		if (showPhone && (telephone == undefined || telephone.number == "")) {
			error = true;
			errorMessage = errorMessage == "" ? "You must provide a valid telephone number." : errorMessage + "\nYou must provide a valid telephone number.";
			setTelephoneStyle(defaultErrorInputStyle);
		}
		if (showAddress && (address == undefined || address.address == "" || address.city == "" || address.state == "" || address.postcode == "" || address.country == "")) {
			error = true;
			errorMessage = errorMessage == "" ? "You must provide a valid address." : errorMessage + "\nYou must provide a valid address.";
			setAddressStyle(defaultErrorInputStyle);
		}
		if (password != password2 || password .length < 8) {
			error = true;
			errorMessage = errorMessage == "" ? "Your passwords do not match or your password is not greater than 8 characters." : errorMessage + "\nYour passwords do not match or your password is not greater than 8 characters.";
			setPasswordStyle(defaultErrorInputStyle)
			setPassword2Style(defaultErrorInputStyle)
		}
		if (!termsAndConditionsState) {
			error = true;
			errorMessage = errorMessage == "" ? "You must accept the terms and conditions, privacy policy and notification settings to register an account." : errorMessage + "\nYou must accept the terms and conditions, privacy policy and notification settings to register an account.";
			setTermsAndConditionsStyle(termsErrorStyle)
		}
		setErrorDescription(errorMessage);
		return error;
	}

	const clearErrorStyling = () => {
		setFullNameStyle({});
		setUsernameStyle({});
		setEmailStyle({});
		setTelephoneStyle({});
		setAddressStyle({});
		setPasswordStyle({});
		setPassword2Style({});
		setTermsAndConditionsStyle({})
		setError(false)
	}

	const register = () => {
		clearErrorStyling();
		if (!validateSubmission()) {
			setLoading(true);
			passport.register({
				address: address,
				avatar: undefined,
				color: "",
				domain: defaultDomain,
				email: email,
				forcePasswordReset: false,
				name: fullName,
				password: password,
				serviceUser: false,
				telephone: telephone,
				username: username
			}).then(response => {
				login()
			}).catch(response => {
				setError(true);
				setErrorDescription(response);
				setLoading(false);
			})
		} else {
			setError(true);
		}

	}

	return (
		<PaddedPage>
			<InputForm paddingBottom={20} verticalMargin={15}>
				<div className="passport-register-avatar-cont">
					<div className="passport-register-page-empty-avatar">
						<AvatarEmpty height={80}></AvatarEmpty>
					</div>
				</div>
				<div className="passport-register-main-headings">
					<h2 className="passport-register-main-heading">Create an account</h2>
					<p className="passport-register-main-headings-description">If you already have an account? <a href={signInUri}>Click here to sign</a></p>
				</div>
				{ showName && <Input label={"Name"} placeholder={"Full Name"} onChange={setFullName} style={fullNameStyle}></Input> }
				{ showUsername && <Input label={"Username"} preventSpaces={true} placeholder={"Username"} style={usernameStyle} onChange={setUsername}></Input> }
				<Input label={"Email"} isEmail={true} placeholder={"Email"} style={emailStyle} onChange={setEmail}></Input>
				{ showPhone && <PhoneInput label={"Telephone"} style={telephoneStyle} onChange={setTelephone}></PhoneInput> }
				{ showAddress && <AddressInput label={"Address"} style={addressStyle} onChange={setAddress}></AddressInput> }
				<Input label={"Password"} isPassword={true} style={passwordStyle} placeholder={"Password"} onChange={setPassword}></Input>
				<Input label={"Re-Enter Password"} isPassword={true} style={password2Style} placeholder={"Re Enter Password"} onChange={setPassword2}></Input>
				{showTermsAgreement &&
					<div className="passport-registration-page-checkbox-group">
						<Checkbox checked={termsAndConditionsState}
								  onCheckboxChange={(s) => setTermsAndConditionsState(s)}></Checkbox>
						<p className="passport-registration-terms-of-service-text" style={termsAndConditionsStyle}>I agree with the <a href={termsLink} target="_blank">Terms of Service</a>, <a href={privacyLink} target="_blank">Privacy Policy</a> and default <a href={notificationLink} target="_blank">Notification Settings</a>.
						</p>
					</div>
				}
			</InputForm>
			<Button
				buttonType={ButtonType.PRIMARY}
				text={"Create User"}
				isLoading={loading}
				onClick={register}
			></Button>
			{ error &&
				<div className="passport-registration-page-plain-error-message">
					<ErrorAlert title={"An error occurred"} description={errorDescription}></ErrorAlert>
				</div>
			}
		</PaddedPage>
	)
}