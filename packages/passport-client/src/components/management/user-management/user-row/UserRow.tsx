import React, {useState} from "react";

import "./UserRow.css"
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {User, UserState} from "@blue-orange-ai/foundations-clients";
import {Avatar} from "@blue-orange-ai/foundations-core";


interface Props {
	user?: User
}

export const UserRow: React.FC<Props> = ({user}) => {

	const navigate = useNavigate();

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

	const rowClicked = () => {
		if (user != undefined && user.id !== undefined) {
			navigate("/users/" + user.id);
		}
	}

	const formatDate = (date: Date | string | undefined): string => {
		if (date === undefined) {
			return "N/A";
		}
		return moment(date).format('Do MMM YYYY');
	}


	return (
		<tr className="passport-user-management-user-row">
			<td>
				<div className="passport-user-management-check-box-cont">
					<input type="checkbox"/>
				</div>
			</td>
			<td onClick={rowClicked}>
				<div className="passport-user-management-user">
					<div className="passport-user-management-user-avatar">
						<Avatar user={user === undefined ? defaultUser : user} height={42} width={42}></Avatar>
					</div>
					<div className="passport-user-management-user-basic-details">
						<div className="passport-user-management-user-basic-details-name">{user === undefined || user.name == undefined ? "Unknown Name" : user.name}</div>
						<div className="passport-user-management-user-basic-details-email">{user === undefined || user.username == undefined ? "" : user.username}{user !== undefined && user.username !== undefined && user.email !== undefined ? " | " : ""}{user === undefined || user.email === undefined ? "" : user.email}</div>
					</div>
				</div>
			</td>
			<td onClick={rowClicked}>
				<div>
					<div className="passport-user-management-date-render">{user?.domain}</div>
				</div>
			</td>
			<td onClick={rowClicked}>
				<div className="passport-user-management-status-block">
					{user?.state == UserState.LOCKED && <div className="passport-user-management-status-pill passport-user-management-status-pill-locked">Locked</div>}
					{user?.state == UserState.DISABLED && <div className="passport-user-management-status-pill passport-user-management-status-pill-inactive">Disabled</div>}
					{user?.state == UserState.LOCKED && <div className="passport-user-management-status-pill passport-user-management-status-pill-active">Active</div>}
				</div>
			</td>
			<td onClick={rowClicked}>
				<div className="passport-user-management-date-render">{formatDate(user?.lastActive)}</div>
			</td>
			<td onClick={rowClicked}>
				<div className="passport-user-management-date-render">{formatDate(user?.created)}</div>
			</td>
		</tr>
	)
}