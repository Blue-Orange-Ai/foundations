import React, {useState} from "react";

import "./ProfileAdmin.css"
import "react-toggle/style.css"
import {Passport, User, UserState} from "@blue-orange-ai/foundations-clients";
import {Button, ButtonType, Dropdown, DropdownItemIcon, TextArea} from "@blue-orange-ai/foundations-core";

interface Props {
	user?: User
}

export const ProfileAdmin: React.FC<Props> = ({user}) => {

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

	const inputUser: User = user == undefined ? defaultUser : user;

	const [workingUser, setWorkingUser] = useState(inputUser);

    const [loading, setLoading] = useState(false);

    const convertStringToUserState = (state: string): UserState => {
        if (state == "LOCKED") {
            return UserState.LOCKED
        } else if (state == "DELETED") {
            return UserState.DELETED
        } else if (state == "DISABLED") {
            return UserState.DISABLED
        } else {
            return UserState.ACTIVE
        }
    }

    const convertUserStateToString = (state: UserState): string => {
        return state.toString()
    }

    const changeUserState = (state: string) => {
        setWorkingUser((prevUser) => ({...prevUser, state: convertStringToUserState(state)}));
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
                <Dropdown label={"Permission"} onSelection={(item) => changeUserState(item.reference)}>
                    <DropdownItemIcon src={"ri-shield-star-fill"} label={"Locked"} value={"Locked"} selected={workingUser.state == UserState.LOCKED}></DropdownItemIcon>
                    <DropdownItemIcon src={"ri-user-forbid-line"} label={"Disabled"} value={"DISABLED"} selected={workingUser.state == UserState.DISABLED}></DropdownItemIcon>
                    <DropdownItemIcon src={"ri-eye-fill"} label={"Deleted"} value={"DELETED"} selected={workingUser.state == UserState.DELETED}></DropdownItemIcon>
                    <DropdownItemIcon src={"ri-eye-fill"} label={"Active"} value={"ACTIVE"} selected={workingUser.state == UserState.ACTIVE}></DropdownItemIcon>
                </Dropdown>
				<div className="passport-profile-input-group">
					<div className="default-input-label-text">Notes</div>
					<TextArea
                        style={{minHeight: "100px"}}
                        onChange={changeNotes}></TextArea>
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