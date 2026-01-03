import React, {useState} from "react";

import "./ResetPassword.css"
import {Passport, User, UserState} from "@blue-orange-ai/foundations-clients";
import {Button, ButtonType, Input} from "@blue-orange-ai/foundations-core";

interface Props {
	user?: User
}

export const ResetPassword: React.FC<Props> = ({user}) => {

	const defaultUser: User = {
        addressVerified: false,
        emailVerified: false,
        phoneVerified: false,
        state: UserState.ACTIVE,
        address: undefined,
        avatar: undefined,
        color: "",
        created: new Date(),
        defaultUser: false,
        domain: "",
        email: "",
        forcePasswordReset: false,
        lastActive: new Date(),
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
					<Input
                        placeholder="Password"
                        isPassword={true}
                        onChange={changePassword}></Input>
				</div>
				<div className="passport-profile-save-group">
					<Button
						buttonType={ButtonType.PRIMARY}
                        text="Reset" style={{width: "150px"}}
                        isLoading={loading}
                        onClick={updatePassword}></Button>
				</div>
			</div>

		</div>

	)
}