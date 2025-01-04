import React from "react";
import {Loading} from "../../../utils/loading/Loading";


import './LoadingUsers.css'

interface Props {
}

export const LoadingUsers: React.FC<Props> = ({}) => {
	return (
		<div className="passport-user-management-loading-users">
			<div className="passport-user-management-loading-users-loading">
				<Loading fontSize="6rem" color="#b0b0b0"></Loading>
			</div>
		</div>
	)
}