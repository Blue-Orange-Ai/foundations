import React from "react";

import './AvatarDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {Avatar} from "../../../components/avatar/avatar/Avatar";
import {AvatarImage} from "../../../components/avatar/avatarimage/AvatarImage";
import {AvatarEmpty} from "../../../components/avatar/avatarempty/AvatarEmpty";
import {AvatarList} from "../../../components/avatar/avatarlist/AvatarList";
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../components/text-decorations/paragraph/Paragraph";

interface Props {
}

const SAMPLE_FACE = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#7c4dff"/>
  <circle cx="48" cy="38" r="16" fill="rgba(255,255,255,0.9)"/>
  <path d="M16 96 C16 68 80 68 80 96 Z" fill="rgba(255,255,255,0.9)"/>
</svg>`);

export const AvatarDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Avatar</PageHeading>
			<Paragraph>
				Avatar resolves a user into their picture, falling back to AvatarEmpty when there is nothing to show.
				AvatarImage is the plain picture, and AvatarList stacks several with an overflow count.
			</Paragraph>

			<FormHeading label="Avatar"></FormHeading>
			<div className="blue-orange-avatar-development-row">
				<Avatar user={undefined}></Avatar>
				<Avatar user={undefined} tooltip={true}></Avatar>
				<Avatar user={undefined} height={64} width={64}></Avatar>
				<Avatar user={undefined} edit={true}></Avatar>
			</div>

			<FormHeading label="AvatarEmpty — the no picture fallback"></FormHeading>
			<div className="blue-orange-avatar-development-row">
				<div style={{height: "32px", width: "32px", borderRadius: "50%", overflow: "hidden"}}>
					<AvatarEmpty height={32}></AvatarEmpty>
				</div>
				<div style={{height: "48px", width: "48px", borderRadius: "50%", overflow: "hidden"}}>
					<AvatarEmpty height={48}></AvatarEmpty>
				</div>
			</div>

			<FormHeading label="AvatarImage"></FormHeading>
			<div className="blue-orange-avatar-development-row">
				<AvatarImage url={SAMPLE_FACE} height={32} width={32}></AvatarImage>
				<AvatarImage url={SAMPLE_FACE} height={48} width={48}></AvatarImage>
				<AvatarImage url={null} height={48} width={48}></AvatarImage>
			</div>

			<FormHeading label="AvatarList"></FormHeading>
			<div className="blue-orange-avatar-development-row">
				<AvatarList users={[]} overflowNum={3}></AvatarList>
			</div>
		</PaddedPage>
	)
}
