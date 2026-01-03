import React, {useRef, useState} from "react";

import "./UserGroups.css"

import {SearchInput2} from "../../../utils/searchinput2/SearchInput2";
import {Passport, User} from "@blue-orange-ai/foundations-clients";
import {ButtonIcon} from "@blue-orange-ai/foundations-core";
import {GroupSelectionState, UserGroupTable} from "../user-group-table/UserGroupTable";
import {AddUserToGroupModal} from "../add-user-to-group-modal/AddUserToGroupModal";

interface Props {
	user?: User
}

export const UserGroups: React.FC<Props> = ({user}) => {


	const [addUserModal, setAddUserModal] = useState(false);

	const [search, setSearch] = useState<Date>();

	const [query, setQuery] = useState("");

	const [selectedGroups, setSelectedGroups] = useState<Array<GroupSelectionState>>([]);

	const [loading, setLoading] = useState(false);

	const handleSearchEvent = (query: string) => {
		setQuery(query);
	}

	const handleModalClose = () => {
		setAddUserModal(false);
		setSearch(new Date())
	}

	const openModalClose = () => {
		setAddUserModal(true);
	}

	const onSelectedGroups = (selectedGroups: Array<GroupSelectionState>) => {
		setSelectedGroups(selectedGroups);
	}

	const deleteSelectedGroups = () => {
		if (selectedGroups.length > 0) {
			var passport = new Passport("http://localhost:8080");
			if (user != null && user.id != null) {
				setLoading(true);
				passport.adminRemoveGroupsFromUser({
					groups: selectedGroups,
					memberId: user.id
				})
					.then(userGroupSearchResult => {
						setLoading(false);
						setSearch(new Date())
					})
					.catch(error => {
						setLoading(false);
					});
			}
		}
	}

	return (
		<div className="passport-profile-main-page">
			<div className="passport-profile-main-page-cont" style={{paddingBottom: "0px"}}>
				<h1 className="passport-profile-main-heading">User Groups</h1>
			</div>
			<div className="passport-filter-table-group">
				<div className="passport-profile-groups-header">
					<SearchInput2 icon={"ri-filter-3-line"} style={{width: "calc(100% - 92px)"}} onSearchEvent={handleSearchEvent}></SearchInput2>
					<div className="passport-group-btn-ctrls">
						<div className="passport-ctrl-btn">
							<ButtonIcon
								icon="ri-add-line"
								label="Add group"
								onClick={openModalClose}></ButtonIcon>
						</div>
						<div className="passport-ctrl-btn">
							<ButtonIcon
								icon="ri-delete-bin-7-line"
								label="Delete selected groups"
								isDisabled={selectedGroups.length <= 0}
								onClick={deleteSelectedGroups}></ButtonIcon>
						</div>
					</div>
				</div>
				<UserGroupTable changeRequest={search} query={query} onSelectedGroups={onSelectedGroups} user={user}></UserGroupTable>
				{addUserModal && <AddUserToGroupModal user={user} onClose={handleModalClose}></AddUserToGroupModal>}
			</div>

		</div>

	)
}