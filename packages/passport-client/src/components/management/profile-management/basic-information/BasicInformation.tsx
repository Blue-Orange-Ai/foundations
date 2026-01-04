import React, {useCallback, useState} from "react";

import "./BasicInformation.css"
import {Address, Telephone, User, UserState} from "@blue-orange-ai/foundations-clients";
import {usePassport} from "../../../providers/PassportProvider";
import {AddressInput, Button, ButtonType, Input, PhoneInput} from "@blue-orange-ai/foundations-core";

interface Props {
	user?: User,
	reloadUser?: () => void;
}

export const BasicInformation: React.FC<Props> = ({user, reloadUser}) => {

	const passport = usePassport();

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

	const getUser = useCallback(async () => {
		if (workingUser.id != null) {
			const user = await passport.get(workingUser.id);
            setWorkingUser(user);
            setLoading(false);
		} else {
			setLoading(false)
		}


	}, [workingUser]);

	const saveUser = () => {
		setLoading(true)
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
					<Input
                        placeholder="Full Name"
                        value={workingUser.name}
                        onChange={changeName}></Input>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Username</div>
					<Input
                        placeholder="Username"
                        value={workingUser.username}
                        preventSpaces={true}
                        onChange={changeUsername}></Input>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Email</div>
					<Input
                        placeholder="Email"
                        preventSpaces={true}
                        value={workingUser.email}
                        onChange={changeEmail}></Input>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Phone Number</div>
					<PhoneInput
                        telephone={workingUser.telephone}
                        onChange={changeTelephone}></PhoneInput>
				</div>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Address</div>
					<AddressInput
                        address={workingUser.address}
                        onChange={changeAddress}></AddressInput>
				</div>
				<div className="passport-profile-save-group">
					<Button
                        buttonType={ButtonType.PRIMARY}
						text="Save"
                        style={{width: "150px"}}
                        isLoading={loading}
                        onClick={saveUser}></Button>
				</div>
			</div>

		</div>

	)
}