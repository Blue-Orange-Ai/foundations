import React from "react";

import './ApplicationAvatar.css';

interface Props {
	uri?: string,
	alt?: string,
	width?: number,
	height?: number
}
export const ApplicationAvatar: React.FC<Props> = ({uri, alt, width=80, height=80}) => {

	const avatarStyle: React.CSSProperties = {
		height: height + "px",
		width: width + "px",
		borderRadius: "50%",
		overflow: "hidden",
		position: "relative"
	}

	const emptyAvatarStyle: React.CSSProperties = {
		fontSize: height * 0.6 + "px"
	}

	return (
		<div style={avatarStyle}>
			{uri !== undefined && <img className="passport-application-avatar" src={uri} alt={alt}/>}
			{uri === undefined &&
				<div className="passport-application-avatar-empty" style={emptyAvatarStyle}>
					<i className="ri-user-4-line"></i>
				</div>
			}
		</div>

	)
}