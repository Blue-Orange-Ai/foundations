import React, {useState} from "react";

import "./ResetPassword.css"

import {DefaultInput} from "../../../utils/defaultinput/DefaultInput";
import {PhoneInput} from "../../../utils/phoneinput/PhoneInput";
import Passport, {Address, Telephone, User} from "../../../utils/sdks/passport/Passport";
import {DefaultTextArea} from "../../../utils/defaulttextarea/DefaultTextArea";
import {AddressInput} from "../../../utils/addressinput/AddressInput";
import {DefaultBtn} from "../../../utils/defaultbtn/DefaultBtn";

interface Props {
	user?: User
}

export const ResetPassword: React.FC<Props> = ({user}) => {

	const defaultUser: User = {
		address: undefined,
		avatar: undefined,
		color: "",
		created: new Date(),
		defaultUser: false,
		disabled: false,
		domain: "",
		email: "",
		forcePasswordReset: false,
		lastActive: new Date(),
		locked: false,
		name: "",
		notes: "",
		serviceUser: false,
		telephone: undefined,
		username: ""

	}

	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);

	const changePassword = (password: string) => {
		setPassword(password);
	}

	const updatePassword = () => {
		if (password != "") {
			var passport = new Passport("http://localhost:8080");
			if (user != null && user.id != null) {
				passport.adminUpdatePassword(user.id, {password: password})
					.then(user => {
						setLoading(false);
					})
					.catch(error => {
						console.log(error)
						setLoading(false);
					});
			}
		}
	}

	return (
		<div className="passport-profile-main-page">
			<div className="passport-profile-main-page-cont">
				<h1 className="passport-profile-main-heading">Change Password</h1>
				<p className="passport-default-body-text">This is an administrative function that will overwrite the users password.</p>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">New Password</div>
					<DefaultInput placeholder="Password" isPassword={true} onInputChange={changePassword}></DefaultInput>
				</div>
				<div className="passport-profile-save-group">
					<DefaultBtn
						label="Reset" style={{width: "150px"}} isLoading={loading} onClick={updatePassword}></DefaultBtn>
				</div>
			</div>

		</div>

	)
}