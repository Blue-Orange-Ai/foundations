import React from "react";
import {IAvatar} from "../../../../interfaces/AppInterfaces";

import './ProfilePicNameEmail.css'
import {DefaultInput} from "../../../utils/defaultinput/DefaultInput";
import {DefaultFormHeading} from "../../../utils/defaultformheading/DefaultFormHeading";

// interface Props {
// 	avatar: IAvatar;
// 	name: string;
// 	email: string;
// }

interface Props {
}

export const ProfilePicNameEmail: React.FC<Props> = ({}) => {

	const inputStyle: React.CSSProperties = {
		width: "calc(100% - 10px)"
	}

	return (
		<div className="passport-profile-pic-name-email-cont">
			<div className="passport-profile-pic-name-email-avatar"></div>
			<div className="passport-profile-pic-name-email-ne-group">
				<div className="passport-profile-pic-name-email-name-group">
					<DefaultFormHeading label='Full Name'></DefaultFormHeading>
					<DefaultInput placeholder="Full name" style={inputStyle}></DefaultInput>
				</div>
				<div className="passport-profile-pic-name-email-email-group">
					<DefaultFormHeading label='Email'></DefaultFormHeading>
					<DefaultInput placeholder="Email.." style={inputStyle} isEmail={true}></DefaultInput>
				</div>
			</div>
		</div>
	)
}