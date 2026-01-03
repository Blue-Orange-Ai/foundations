import React, {useRef, useState} from "react";
import {ApplicationAvatar} from "../application-avatar/ApplicationAvatar";
import Cookies from "js-cookie"

import './LoginWindow.css';

import {useNavigate} from "react-router-dom";
import {Passport, UserLoginRequest} from "@blue-orange-ai/foundations-clients";
import {
    Button,
    ButtonType,
    ErrorBlockAlert,
    InfoBlockAlert,
    Input,
    SuccessBlockAlert
} from "@blue-orange-ai/foundations-core";

interface Props {
}

export const LoginWindow: React.FC<Props> = ({}) => {

	var uri = undefined;

	var alt = "Application Logo"

	var width = 100;

	var height = 100;

	const navigate = useNavigate();

	const [username, setUsername] = useState("");

	const [password, setPassword] = useState("");

	const [validInput, setValidInput] = useState(false);

	const [loading, setLoading] = useState(false);

	const [infoAlert, setInfoAlert] = useState(false);

	const [successAlert, setSuccessAlert] = useState(false);

	const [errorAlert, setErrorAlert] = useState(false);

	const [alertMessage, setAlertMessage] = useState("");

	const usernameEntered = (value: string) => {
		setUsername(value);
		isValidSubmission(value, password);
	};

	const passwordEntered = (value: string) => {
		setPassword(value);
		isValidSubmission(username, value);
	};

	const isValidSubmission = (usernameVal: string, passwordVal: string) => {
		if (usernameVal != "" && passwordVal != "") {
			setValidInput(true)
		} else {
			setValidInput(false)
		}
	}

	const enterCheck = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === "Enter") {
			submitRequest();
		}
	}

	const submitRequest = () => {
		if (validInput) {
			setLoading(true);
			var passport = new Passport("http://localhost:8080");
			var loginRequest: UserLoginRequest = {
				username: username,
				password: password,
				domain: "root",
			}
			passport.login(loginRequest)
				.then(loginResponse => {
					Cookies.set("authorization", loginResponse.token)
					setLoading(false);
					setErrorAlert(false);
					setInfoAlert(false);
					setSuccessAlert(false);
					navigate("/users/2")
				})
				.catch(error => {
					setLoading(false);
					setAlertMessage(error);
					setErrorAlert(true);
				});
		}
	}

	const loginInputStyle: React.CSSProperties = {
		width: "80%",
		maxWidth: "calc(500px - 10px)"
	}

	return (
		<div className="passport-main-window" onKeyUp={enterCheck}>
			<div className="passport-main-window-background">
				<img className="passport-main-window-background-img"
					 src="/marek-piwnicki-IbFSwPBGyVo-unsplash.jpg"/>
			</div>
			<div className="passport-application-avatar">
				<ApplicationAvatar
					uri={uri}
					alt={alt}
					width={width}
					height={height}></ApplicationAvatar>
			</div>
			<div className="passport-login-username-input">
				{ infoAlert && <InfoBlockAlert title="Test Error Alert" description={alertMessage}></InfoBlockAlert>}
				{ successAlert && <SuccessBlockAlert title="Test Error Alert" description={alertMessage}></SuccessBlockAlert>}
				{ errorAlert && <ErrorBlockAlert title="Test Error Alert" description={alertMessage}></ErrorBlockAlert>}
			</div>
			<div className="passport-login-label">
				<span className="passport-login-label-text">Username | Email</span>
			</div>
			<div className="passport-login-username-input">
				<Input
					placeholder="Username | Email"
					preventSpaces={true}
					style={loginInputStyle}
					onChange={(value) => usernameEntered(value)}
				></Input>
			</div>
			<div className="passport-login-label">
				<span className="passport-login-label-text">Password</span>
				<button className="passport-forgot-password">Forgot Password</button>
			</div>
			<div className="passport-login-password-password">
				<Input
					placeholder="Password"
					isPassword={true}
					style={loginInputStyle}
					onChange={(value) => passwordEntered(value)}
				></Input>
			</div>
			<div className="passport-login-password-enter-btn">
				<Button
                    buttonType={ButtonType.PRIMARY}
					text="Login"
					isDisabled={!validInput}
					isLoading={loading}
					style={{width: "80%", maxWidth: "500px"}}
					onClick={() => submitRequest()}
				></Button>
			</div>

		</div>
	)
}