import React, {ReactNode} from "react";

import './AvatarList.css'
import {User} from "@Blue-Orange-Ai/foundations-clients";
import {Avatar} from "../avatar/Avatar";

interface Props {
	users: Array<User>;
	height?: number;
	overlap?: number;
	zIndexBase?: number;
	border?: number;
	backgroundColor?: string;
	borderRadius?: string;
	overflowNum?: number;
}

interface filteredUser {
	user: User | undefined,
	style: React.CSSProperties,
	overflow: boolean,
	overflowNum: number
}
export const AvatarList: React.FC<Props> = ({
												users,
												height = 42,
												overlap = 10,
												zIndexBase = 0,
												border = 2,
												backgroundColor = "white",
												borderRadius = "50%",
												overflowNum = 5
											}) => {

	const calculateTotalWidth = () => {
		return Math.min(users.length, overflowNum + 1) * height - ((height * (overlap / 100)) * (Math.min(users.length, overflowNum + 1) - 1));
	}

	const generateFilteredUsers = () => {
		var filteredUsers: Array<filteredUser> = [];
		for (var i=0; i < users.length; i++) {
			var style: React.CSSProperties = {
				position: "absolute",
				zIndex: zIndexBase + i,
				minWidth: height + "px",
				maxWidth: height + "px",
				minHeight: height + "px",
				maxHeight: height + "px",
				backgroundColor: backgroundColor,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: borderRadius,
				left: (height * i - (height * overlap / 100) * i) + "px"
			}
			if (i >= overflowNum) {
				filteredUsers.push({
					user: undefined,
					overflow: true,
					style: style,
					overflowNum: users.length - i
				})
				break;
			}
			filteredUsers.push({
				user: users[i],
				overflow: false,
				style: style,
				overflowNum: 0
			})
		}
		return filteredUsers;
	}

	const avatarListStyleProperties: React.CSSProperties = {
		width: calculateTotalWidth() + "px",
		height: height + "px"
	}

	const filteredUsers = generateFilteredUsers();

	const overflowStyle: React.CSSProperties = {
		height: height - border + "px",
		width: height - border + "px",
		borderRadius: borderRadius
	}


	return (
		<div className='blue-orange-avatar-list' style={avatarListStyleProperties}>
			{filteredUsers.map((filteredUser, index) => (
				<div key={index} className='blue-orange-avatar-item' style={filteredUser.style}>
					{filteredUser.overflow &&
						<div className='blue-orange-avatar-overflow' style={overflowStyle}>
							<i className="ri-add-line"></i>
							{filteredUser.overflowNum}
						</div>
					}
					{!filteredUser.overflow && filteredUser.user != undefined &&
						<Avatar
							user={filteredUser.user}
							height={height - border}
							width={height - border}></Avatar>}
				</div>
			))}
		</div>
	)
}