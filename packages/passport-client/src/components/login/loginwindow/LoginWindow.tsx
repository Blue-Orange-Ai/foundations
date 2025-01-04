import React, {useRef, useState} from "react";
import {ApplicationAvatar} from "../applicationavatar/ApplicationAvatar";
import Passport, { UserLoginRequest, UserLoginResponse } from "../../utils/sdks/passport/Passport"
import Cookies from "js-cookie"

import './LoginWindow.css';
import {DefaultInput} from "../../utils/defaultinput/DefaultInput";
import {DefaultBtn} from "../../utils/defaultbtn/DefaultBtn";
import {InfoAlert} from "../../utils/alerts/login/infoalert/InfoAlert";
import {SuccessAlert} from "../../utils/alerts/login/successalert/SuccessAlert";
import {ErrorAlert} from "../../utils/alerts/login/erroralert/ErrorAlert";
import {useNavigate} from "react-router-dom";

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
				password: password
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
				{ infoAlert && <InfoAlert title="Test Error Alert" description={alertMessage}></InfoAlert>}
				{ successAlert && <SuccessAlert title="Test Error Alert" description={alertMessage}></SuccessAlert>}
				{ errorAlert && <ErrorAlert title="Test Error Alert" description={alertMessage}></ErrorAlert>}
			</div>
			<div className="passport-login-label">
				<span className="passport-login-label-text">Username | Email</span>
			</div>
			<div className="passport-login-username-input">
				<DefaultInput
					placeholder="Username | Email"
					preventSpaces={true}
					style={loginInputStyle}
					onInputChange={(value) => usernameEntered(value)}
				></DefaultInput>
			</div>
			<div className="passport-login-label">
				<span className="passport-login-label-text">Password</span>
				<button className="passport-forgot-password">Forgot Password</button>
			</div>
			<div className="passport-login-password-password">
				<DefaultInput
					placeholder="Password"
					isPassword={true}
					style={loginInputStyle}
					onInputChange={(value) => passwordEntered(value)}
				></DefaultInput>
			</div>
			<div className="passport-login-password-enter-btn">
				<DefaultBtn
					label="Login"
					isDisabled={!validInput}
					isLoading={loading}
					style={{width: "80%", maxWidth: "500px"}}
					onClick={() => submitRequest()}
				></DefaultBtn>
			</div>

		</div>
	)
}