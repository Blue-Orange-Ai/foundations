import React, {useEffect, useRef, useState} from "react";

import "./ProfileAdmin.css"
import "react-toggle/style.css"

import Passport, {User} from "../../../utils/sdks/passport/Passport";
import {DefaultTextArea} from "../../../utils/defaulttextarea/DefaultTextArea";
import {DefaultBtn} from "../../../utils/defaultbtn/DefaultBtn";
import Toggle from "react-toggle";

interface Props {
	user?: User
}

export const ProfileAdmin: React.FC<Props> = ({user}) => {

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

	const inputUser: User = user == undefined ? defaultUser : user;

	const [workingUser, setWorkingUser] = useState(inputUser);

	const [loading, setLoading] = useState(false);

	const changeLocked = () => {
		workingUser.locked = !workingUser.locked;
	}

	const changeDisabled = () => {
		workingUser.disabled = !workingUser.disabled;
		setWorkingUser(workingUser);
	}

	const changeNotes = (text: string) => {
		workingUser.notes = text;
		setWorkingUser(workingUser);
	}

	const saveUser = () => {
		setLoading(true)
		var passport = new Passport("http://localhost:8080");
		passport.save(workingUser)
			.then(user => {
				setWorkingUser(user);
				setLoading(false);
			})
			.catch(error => {
				if (user !== undefined) {
					setWorkingUser(user as User)
				}
			});

	}

	return (
		<div className="passport-profile-main-page">
			<div className="passport-profile-main-page-cont">
				<h1 className="passport-profile-main-heading">Administrative Functions</h1>
				<div className="passport-profile-toggle-group">
					<div className="default-input-label-text">Locked</div>
					<Toggle defaultChecked={workingUser.locked} onChange={changeLocked}></Toggle>
				</div>
				<div className="passport-profile-toggle-group">
					<div className="default-input-label-text">Disabled</div>
					<Toggle defaultChecked={workingUser.disabled} onChange={changeDisabled}></Toggle>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Notes</div>
					<DefaultTextArea style={{minHeight: "100px"}} onInputChange={changeNotes}></DefaultTextArea>
				</div>
				<div className="passport-profile-save-group">
					<DefaultBtn
						label="Save" style={{width: "150px"}} isLoading={loading} onClick={saveUser}></DefaultBtn>
				</div>
			</div>

		</div>

	)
}