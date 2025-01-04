import React from "react";
import {IconPos} from "../../../../interfaces/AppInterfaces";

import './ManagementHeader.css';
import {SearchInput} from "../../../utils/searchinput/SearchInput";
import {DefaultBtnIcon} from "../../../utils/defaultbtnicon/DefaultBtnIcon";
import {DefaultBtnCircleIcon} from "../../../utils/defaultbtncircleicon/DefaultBtnCircleIcon";
import {SearchInput2} from "../../../utils/searchinput2/SearchInput2";

interface Props {
	loading: boolean;
	selectedUsersCount: number;
	updateQuery: (value: string) => void;
	download: () => void;
	createUser: () => void;
	deleteUsers: () => void;
}

export const ManagementHeader: React.FC<Props> = ({loading, selectedUsersCount, updateQuery, download, createUser, deleteUsers}) => {

	return (
		<div className="passport-header-management-header">
			<div className="passport-header-management-header-left-cont">
				<div className="passport-header-management-header-title">User Management</div>
			</div>
			<div className="passport-header-management-header-center-cont">
				<SearchInput2 icon={loading ? "ri-loader-4-line rotate-spinner" : "ri-search-line"} label={"Search users"} onSearchEvent={updateQuery}></SearchInput2>
			</div>
			<div className="passport-header-management-header-right-cont">
				<div className="passport-header-management-header-btn-right-margin passport-header-management-header-download-users">
					<DefaultBtnCircleIcon icon="ri-download-line" label={selectedUsersCount <= 0 ? "Download all users" : "Download selected users"} onClick={download}></DefaultBtnCircleIcon>
				</div>
				<div className="passport-header-management-header-btn-right-margin">
					<DefaultBtnCircleIcon icon="ri-add-line" label="Create new user" onClick={createUser}></DefaultBtnCircleIcon>
				</div>
				<div>
					<DefaultBtnCircleIcon icon="ri-delete-bin-7-line" label="Delete selected users" onClick={deleteUsers} isDisabled={selectedUsersCount <= 0}></DefaultBtnCircleIcon>
				</div>
			</div>
		</div>
	)
}