import React, {useContext, useEffect, useState} from "react";
import {ToastContext, ToasterType, ToastLocation} from "@blue-orange-ai/foundations-core";


import passport from "@blue-orange-ai/foundations-core/src/components/config/BlueOrangePassportConfig";

import './UserProfileAdmin.css'
import {UserProfile} from "../user-profile/UserProfile";
import {User} from "@blue-orange-ai/foundations-clients";
import {v4 as uuidv4} from "uuid";
import {useParams} from "react-router-dom";

interface Props {
}

export const UserProfileAdmin: React.FC<Props> = ({}) => {

	const { addToast } = useContext(ToastContext);

	const { userId } = useParams();

	const [user, setUser] = useState<User | undefined>(undefined);

	const getReferencedUser = (userId: string) => {
		passport.get(userId)
			.then(user => {
				setUser(user);
			})
			.catch(response => {
				addToast({id: uuidv4(),
					heading: "An error occurred whilst attempting to retrieve your user object",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
	}

	useEffect(() => {
		if (userId) {
			getReferencedUser(userId)
		}
	}, [userId]);

	return (
		<>
			{user && <UserProfile profileUser={user} admin={true}></UserProfile>}
		</>
	)
}