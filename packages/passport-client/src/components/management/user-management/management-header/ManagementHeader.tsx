import React from "react";

import './ManagementHeader.css';
import {SearchInput2} from "../../../utils/searchinput2/SearchInput2";
import {ButtonIcon} from "@blue-orange-ai/foundations-core";

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
					<ButtonIcon icon="ri-download-line" label={selectedUsersCount <= 0 ? "Download all users" : "Download selected users"} onClick={download}></ButtonIcon>
				</div>
				<div className="passport-header-management-header-btn-right-margin">
					<ButtonIcon icon="ri-add-line" label="Create new user" onClick={createUser}></ButtonIcon>
				</div>
				<div>
					<ButtonIcon icon="ri-delete-bin-7-line" label="Delete selected users" onClick={deleteUsers} isDisabled={selectedUsersCount <= 0}></ButtonIcon>
				</div>
			</div>
		</div>
	)
}