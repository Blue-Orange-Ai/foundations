import React, {useState} from "react";

import "./BasicInformation.css"

import {DefaultInput} from "../../../utils/defaultinput/DefaultInput";
import {PhoneInput} from "../../../utils/phoneinput/PhoneInput";
import Passport, {Address, Telephone, User} from "../../../utils/sdks/passport/Passport";
import {AddressInput} from "../../../utils/addressinput/AddressInput";
import {DefaultBtn} from "../../../utils/defaultbtn/DefaultBtn";

interface Props {
	user?: User,
	reloadUser?: () => void;
}

export const BasicInformation: React.FC<Props> = ({user, reloadUser}) => {

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

	const inputUser: User = user === undefined ? defaultUser : user;

	const [workingUser, setWorkingUser] = useState(inputUser);

	const [loading, setLoading] = useState(false);

	const changeName = (text: string) => {
		workingUser.name = text;
		setWorkingUser(workingUser);
	}

	const changeUsername = (text: string) => {
		workingUser.username = text;
		setWorkingUser(workingUser);
	}

	const changeEmail = (text: string) => {
		workingUser.email = text;
		setWorkingUser(workingUser);
	}

	const changeTelephone = (telephone: Telephone) => {
		workingUser.telephone = telephone;
		setWorkingUser(workingUser);
	}

	const changeAddress = (address: Address) => {
		workingUser.address = address;
		setWorkingUser(workingUser);
	}

	const getUser = () => {
		var passport = new Passport("http://localhost:8080");
		if (workingUser.id != null) {
			passport.get(workingUser.id)
				.then(user => {
					setWorkingUser(user);
					setLoading(false);
				})
				.catch(error => {
					console.log(error)
					setLoading(false);
				});

		} else {
			setLoading(false)
		}


	}

	const saveUser = () => {
		setLoading(true)
		var passport = new Passport("http://localhost:8080");
		passport.save(workingUser)
			.then(user => {
				setWorkingUser(user);
				setLoading(false);
				if (reloadUser) {
					reloadUser();
				}
			})
			.catch(error => {
				getUser()
			});

	}

	return (
		<div className="passport-profile-main-page">
			<div className="passport-profile-main-page-cont">
				<h1 className="passport-profile-main-heading">Basic Information</h1>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Name</div>
					<DefaultInput placeholder="Full Name" value={workingUser.name} onInputChange={changeName}></DefaultInput>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Username</div>
					<DefaultInput placeholder="Username" value={workingUser.username} preventSpaces={true} onInputChange={changeUsername}></DefaultInput>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Email</div>
					<DefaultInput placeholder="Email" preventSpaces={true} value={workingUser.email} onInputChange={changeEmail}></DefaultInput>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Phone Number</div>
					<PhoneInput telephone={workingUser.telephone} onInputChange={changeTelephone}></PhoneInput>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Address</div>
					<AddressInput address={workingUser.address} onInputChange={changeAddress}></AddressInput>
				</div>
				<div className="passport-profile-save-group">
					<DefaultBtn
						label="Save" style={{width: "150px"}} isLoading={loading} onClick={saveUser}></DefaultBtn>
				</div>
			</div>

		</div>

	)
}