import React, {useContext, useEffect, useState} from "react";
import {
	ToastContext,
	ToasterType,
	ToastLocation
} from "@blue-orange-ai/foundations-core";


import passport from "@blue-orange-ai/foundations-core/src/components/config/BlueOrangePassportConfig";

import './GroupPage.css'
import {v4 as uuidv4} from "uuid";
import {useParams} from "react-router-dom";
import {
	Group
} from "@blue-orange-ai/foundations-clients";
import {GroupAdmin} from "../group-admin/GroupAdmin";

interface Props {
	userRedirectUri?: string,
	groupRedirectUri?: string,
	deleteRedirectUri?: string,
}

export const GroupPage: React.FC<Props> = ({userRedirectUri = "/users/", groupRedirectUri="/groups/", deleteRedirectUri="/groups"}) => {

	const { addToast } = useContext(ToastContext);

	const { groupId } = useParams();

	const [group, setGroup] = useState<Group | undefined>(undefined);

	const getGroup = () => {
		if (groupId) {
			passport.adminGetGroup({
				id: groupId
			}).then(result => {
				setGroup(result);
			}).catch(response => {
				addToast({
					id: uuidv4(),
					heading: "An error occurred whilst attempting to retrieve the group",
					description: response.message,
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		}
	}

	useEffect(() => {
		getGroup();
	}, [groupId]);


	return (
		<>
			{groupId && group &&
				<GroupAdmin
					groupId={groupId}
					group={group}
					userRedirectUri={userRedirectUri}
					deleteRedirectUri={deleteRedirectUri}
					groupRedirectUri={groupRedirectUri}></GroupAdmin>}
		</>
	)
}