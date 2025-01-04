import React from "react";
import {IUser} from "../../../../interfaces/AppInterfaces";

import './EmptyUsers.css'

interface Props {
	user?: IUser
}
export const EmptyUsers: React.FC<Props> = ({}) => {



	return (
		<div className="passport-user-management-empty-users">
			<div className="passport-user-management-empty-users-avatar">
				<div className="passport-user-management-empty-users-avatar-icon">
					<i className="ri-user-4-line"></i>
				</div>
			</div>
			<div className="passport-user-management-empty-users-message">No users found</div>
		</div>
	)
}