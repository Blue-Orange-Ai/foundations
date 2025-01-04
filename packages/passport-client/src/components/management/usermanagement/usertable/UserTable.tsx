import React, {useEffect, useState} from "react";
import {IUser} from "../../../../interfaces/AppInterfaces";

import './UserTable.css'
import {UserRow} from "../userrow/UserRow";
import {UserTableFooter} from "../usertablefooter/UserTableFooter";
import Passport, {
	SearchDirection,
	User,
	UserSearchField,
	UserSearchResult
} from "../../../utils/sdks/passport/Passport";
import {AddUserGroupCheckbox} from "../../profilemanagment/addusergroupcheckbox/AddUserGroupCheckbox";

interface Props {
	query: string,
	page: number,
	size: number,
	forceSearch?: Date,
	setLoading?: (state: boolean) => void;
	updateUserSearchResult?: (searchResult: UserSearchResult) => void;
}

export const UserTable: React.FC<Props> = ({query, page, size, forceSearch, setLoading, updateUserSearchResult}) => {


	const [searchField, setSearchField] = useState<UserSearchField>(UserSearchField.NAME)

	const [searchDirection, setSearchDirection] = useState<SearchDirection>(SearchDirection.ASC)

	const [users, setUsers] = useState<Array<User>>([])


	const search = () => {
		var passport = new Passport("http://localhost:8080");
		if (setLoading) {
			setLoading(true);
		}
		passport.searchUsers({
			query: query,
			page: page,
			size: size,
			filter: {
				field: searchField,
				direction: searchDirection
			}

		})
			.then(userSearchResult => {
				setUsers(userSearchResult.result);
				if (setLoading) {
					setLoading(false);
				}
				if (updateUserSearchResult) {
					updateUserSearchResult(userSearchResult);
				}
			})
			.catch(error => {
				console.log(error)
				if (setLoading) {
					setLoading(false);
				}
			});
	}

	useEffect(() => {
		search();
	}, []);

	useEffect(() => {
		search();
	}, [query, forceSearch]);

	return (
		<div className="passport-user-management-table-cont">
			<table className="passport-user-management-table">
				<thead>
					<tr>
						<th className="passport-user-management-check-box-col">
							<div className="passport-user-management-check-box-cont">
								<input type="checkbox"/>
							</div>
						</th>
						<th className="passport-user-management-general-col">
							<div className="passport-user-management-table-general-header">Name</div>
						</th>
						<th className="passport-user-management-general-col">
							<div className="passport-user-management-table-general-header">Domain</div>
						</th>
						<th className="passport-user-management-general-col">
							<div className="passport-user-management-table-general-header">Status</div>
						</th>
						<th className="passport-user-management-general-col">
							<div className="passport-user-management-table-general-header">Last Login</div>
						</th>
						<th className="passport-user-management-general-col">
							<div className="passport-user-management-table-general-header">Created</div>
						</th>
					</tr>
				</thead>
				<tbody>
				{users.map(user => (
					<UserRow key={user.id} user={user}></UserRow>
				))}
				</tbody>

			</table>
		</div>
	)
}