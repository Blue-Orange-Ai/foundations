import React, {useState} from "react";
import {IUser} from "../../../../interfaces/AppInterfaces";
import {ManagementHeader} from "../managementheader/ManagementHeader";
import {UserTable} from "../usertable/UserTable";
import {UserTableFooter} from "../usertablefooter/UserTableFooter";
import {EmptyUsers} from "../emptyusers/EmptyUsers";
import {LoadingUsers} from "../loadingusers/LoadingUsers";
import {UserSearchResult} from "../../../utils/sdks/passport/Passport";

interface Props {
}

export const ManagementPage: React.FC<Props> = ({}) => {

	const [pageLoad, setPageLoad] = useState(true);

	const [loading, setLoading] = useState(true);

	const [query, setQuery] = useState("");

	const [page, setPage] = useState(0);

	const [size, setSize] = useState(20);

	const [forceSearch, setForceSearch] = useState(new Date());

	const [selectedUsers, setSelectedUsers] = useState<Array<number>>([])

	const [userSearchResult, setUserSearchResult] = useState<UserSearchResult>({
		count: 0,
		query: {
			query: "",
			page: 0,
			size: 20
		},
		result: []
	})

	const updateLoading = (state: boolean) => {
		setPageLoad(state);
		setLoading(state);
	}

	const updateQuery = (q: string) => {
		setQuery(q);
		setLoading(true);
	}

	const updatePage = (p: number) => {
		setPage(p);
		setLoading(true);
		setForceSearch(new Date());
	}

	const updateSize = (s: number) => {
		setSize(s);
		setLoading(true);
		setForceSearch(new Date());
	}

	const downloadSelectedUsers = () => {

	}

	const deleteSelectedUsers = () => {

	}

	const createUser = () => {

	}

	const updateSearchResult = (searchResult: UserSearchResult) => {
		setUserSearchResult(searchResult);
	}


	return (
		<div className="passport-user-management">
			<ManagementHeader
				updateQuery={updateQuery}
				createUser={createUser}
				deleteUsers={deleteSelectedUsers}
				loading={loading}
				selectedUsersCount={selectedUsers.length}
				download={downloadSelectedUsers}></ManagementHeader>
			<div className={userSearchResult.count === 0 || pageLoad ? "passport-user-management-hidden-table" : "passport-user-management-default-table"}>
				<UserTable query={query} page={page} size={size} setLoading={updateLoading} updateUserSearchResult={updateSearchResult} forceSearch={forceSearch}></UserTable>
			</div>
			{userSearchResult.count === 0 && !pageLoad && <EmptyUsers></EmptyUsers>}
			{pageLoad && <LoadingUsers></LoadingUsers>}
			<UserTableFooter userSearchResult={userSearchResult} updatePage={updatePage} updateSize={updateSize}></UserTableFooter>
		</div>
	)
}