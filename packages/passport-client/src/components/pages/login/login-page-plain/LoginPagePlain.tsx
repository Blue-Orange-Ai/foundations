import React, {useEffect, useState} from "react";
import {
	AvatarEmpty,
	Button,
	ButtonType,
	Dropdown,
	DropdownItemObj, DropdownItemText,
	DropdownItemType,
	Input,
	InputForm
} from "@blue-orange-ai/foundations-core";


import passport from "@blue-orange-ai/foundations-core/src/components/config/BlueOrangePassportConfig";
import {ErrorAlert} from "../../../utils/alerts/login/erroralert/ErrorAlert";

import './LoginPagePlain.css'
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
	domainSelection?: boolean,
	domains?: Array<string>,
	defaultDomain?: string,
	defaultRedirectUri?: string,
	passwordResetUri?: string,
	registerUri?: string,
	allowRegistrations?: boolean
}

export const LoginPagePlain: React.FC<Props> = ({
															  domainSelection=false,
															  domains=["root"],
															  defaultDomain="root",
															  defaultRedirectUri="/",
															  passwordResetUri="/reset",
															  registerUri="/register",
															  allowRegistrations=true
														  }) => {

	const location = useLocation();

	const navigate = useNavigate();

	const defaultErrorInputStyle: React.CSSProperties = {
		border: "1.5px solid #b03a2e",
		backgroundColor: "#fadbd8",
		color: "#b03a2e"
	}

	const updateDomainSelection = (selectedDomain: string, domains: Array<string>) => {
		var domainDropdownItems: Array<DropdownItemObj> = [];
		domains.forEach(domain => {
			domainDropdownItems.push({
				label: domain,
				reference: domain,
				selected: domain == selectedDomain,
				type: DropdownItemType.TEXT
			})
		})
		return domainDropdownItems;
	}

	const [username, setUsername] = useState("");

	const [usernameStyle, setUsernameStyle] = useState<React.CSSProperties>({});

	const [password, setPassword] = useState("");

	const [passwordStyle, setPasswordStyle] = useState<React.CSSProperties>({});

	const [loading, setLoading] = useState(false);

	const [error, setError] = useState(false);

	const [errorDescription, setErrorDescription] = useState("");

	const [domain, setDomain] = useState(defaultDomain);

	const [domainItems, setDomainItems] = useState(updateDomainSelection(defaultDomain, domains));

	const inputStyle: React.CSSProperties = {
		backgroundColor: "white"
	};

	const validate = (): boolean => {
		var error = false;
		var errorMessage = ""
		if (username == "") {
			error = true;
			errorMessage = "The username or email cannot be empty";
			setUsernameStyle(defaultErrorInputStyle);
		}
		if (password == "") {
			error = true;
			errorMessage = "The password or email cannot be empty";
			setPasswordStyle(defaultErrorInputStyle);
		}
		setErrorDescription(errorMessage)
		return error;
	}

	const clearErrorState = () => {
		setError(false);
		setUsernameStyle({});
		setPasswordStyle({});
	}

	const login = () => {
		clearErrorState()
		if (!validate()) {
			setLoading(true);
			passport.login({
				username: username,
				password: password,
				domain: domain
			}).then(response => {
				console.log("success");
				console.log(response);
				const expiryDate = new Date(response.expiry);
				Cookies.set("authorization", response.token, { expires: expiryDate});
				setLoading(false);
				if (response.forcePasswordReset) {
					navigate(passwordResetUri);
				}
				const searchParams = new URLSearchParams(location.search);
				const redirectUri = searchParams.get('redirect_uri');
				if (redirectUri) {
					// Decode the redirect URI before using it
					navigate(decodeURIComponent(redirectUri));
				} else {
					navigate(defaultRedirectUri);
				}
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
		<div className="passport-login-page-plain">
			<div className="passport-login-page-plain-input-form">
				<div className="passport-login-avatar-cont">
					<div className="passport-login-page-empty-avatar">
						<AvatarEmpty height={80}></AvatarEmpty>
					</div>
				</div>
				{ error &&
					<div className="passport-login-page-plain-error-message">
						<ErrorAlert title={"An error occurred"} description={errorDescription}></ErrorAlert>
					</div>
				}
				<InputForm verticalMargin={15}>
					{domainSelection &&
						<Dropdown style={{backgroundColor: "#e0e1e2"}} onSelection={item => {setDomainItems(updateDomainSelection(item.label, domains))}}>
							{domains.map((domain, index) => (
								<DropdownItemText key={domain} value={domain} label={domain} selected={domain == defaultDomain}></DropdownItemText>
							))}
						</Dropdown>
					}
					<Input
						placeholder={"Username | Email"}
						value={username}
						label={"Username"}
						style={inputStyle}
						enterEvent={login}
						onChange={(value) => setUsername(value)}
					></Input>
					<div className="passport-login-page-plain-password-cont">
						<Input
							placeholder={"Password"}
							label={"Password"}
							value={password}
							isPassword={true}
							style={inputStyle}
							enterEvent={login}
							onChange={(value) => setPassword(value)}
						></Input>
						<button className="passport-login-page-plain-forgot-password-btn">Forgot Password</button>
					</div>

				</InputForm>
				<div className="passport-login-page-plain-primary-btn-cont">
					<Button
						buttonType={ButtonType.PRIMARY}
						text={"Login"}
						isLoading={loading}
						onClick={login}
					></Button>
					{allowRegistrations &&
						<div className="passport-login-page-plain-sign-up">Don't have an account? <a
							href={registerUri}>Sign Up</a>
						</div>
					}
				</div>

			</div>
		</div>
	)
}