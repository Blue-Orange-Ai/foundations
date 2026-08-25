import React from "react";

import './AvatarDevelopment.css'
import {Avatar} from "../../../components/avatar/avatar/Avatar";
import {AvatarImage} from "../../../components/avatar/avatarimage/AvatarImage";
import {AvatarEmpty} from "../../../components/avatar/avatarempty/AvatarEmpty";
import {AvatarList} from "../../../components/avatar/avatarlist/AvatarList";
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const AVATAR_PROPS: Array<PropSpec> = [
	{
		name: "user",
		type: "User | undefined",
		required: true,
		description: "The user whose picture is shown. Undefined — or a user with no avatar — falls back to AvatarEmpty."
	},
	{
		name: "edit",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Makes the avatar clickable, opening the picker that replaces the picture."
	},
	{
		name: "height",
		type: "number",
		default: "80",
		control: "slider",
		min: 24,
		max: 160,
		step: 4,
		description: "Height in pixels."
	},
	{
		name: "width",
		type: "number",
		default: "80",
		control: "slider",
		min: 24,
		max: 160,
		step: 4,
		description: "Width in pixels."
	},
	{
		name: "tooltip",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Names the user on hover."
	},
	{
		name: "modalWidth",
		type: "number",
		default: "500",
		control: "number",
		description: "Width of the picker opened by `edit`."
	},
	{
		name: "onChange",
		type: "(avatar: AvatarObj) => void",
		description: "Fires with the new picture once one has been chosen."
	}
];

const AVATAR_IMAGE_PROPS: Array<PropSpec> = [
	{
		name: "url",
		type: "string | null",
		default: "\"\"",
		description: "Where the picture comes from. Null is treated as no picture."
	},
	{
		name: "height",
		type: "number",
		required: true,
		control: "slider",
		min: 24,
		max: 160,
		step: 4,
		value: 48,
		description: "Height in pixels."
	},
	{
		name: "width",
		type: "number",
		required: true,
		control: "slider",
		min: 24,
		max: 160,
		step: 4,
		value: 48,
		description: "Width in pixels."
	}
];

const AVATAR_EMPTY_PROPS: Array<PropSpec> = [
	{
		name: "height",
		type: "number",
		required: true,
		control: "slider",
		min: 24,
		max: 160,
		step: 4,
		value: 48,
		description: "The height the glyph is sized against — it is drawn at 60% of it."
	}
];

const AVATAR_LIST_PROPS: Array<PropSpec> = [
	{
		name: "users",
		type: "Array<User>",
		required: true,
		description: "Everyone in the stack, in the order they should be drawn."
	},
	{
		name: "height",
		type: "number",
		default: "42",
		control: "slider",
		min: 24,
		max: 96,
		step: 2,
		description: "Height of each avatar in the stack."
	},
	{
		name: "overlap",
		type: "number",
		default: "10",
		control: "slider",
		min: 0,
		max: 40,
		step: 1,
		description: "How many pixels each avatar sits over the one before it."
	},
	{
		name: "zIndexBase",
		type: "number",
		default: "0",
		control: "number",
		description: "The stacking order the first avatar starts from."
	},
	{
		name: "border",
		type: "number",
		default: "2",
		control: "slider",
		min: 0,
		max: 6,
		step: 1,
		description: "Width of the ring drawn around each avatar so the overlap reads."
	},
	{
		name: "backgroundColor",
		type: "string",
		default: "\"white\"",
		control: "color",
		description: "The colour of that ring — usually whatever the stack is sitting on."
	},
	{
		name: "borderRadius",
		type: "string",
		default: "\"50%\"",
		control: "text",
		description: "The corner radius of each avatar. 50% makes them round."
	},
	{
		name: "overflowNum",
		type: "number",
		default: "5",
		control: "slider",
		min: 1,
		max: 10,
		step: 1,
		description: "How many avatars are drawn before the rest become a count."
	}
];

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
		<ComponentDoc
			title="Avatar"
			description="A user's picture, and the pieces it is built from. Avatar resolves a user into their image and falls back to AvatarEmpty when there is nothing to show; AvatarImage is the plain picture; AvatarList stacks several with an overflow count on the end."
			name="Avatar"
			previewHeight={180}
			props={AVATAR_PROPS}
			preview={values => (
				<Avatar
					user={undefined}
					edit={values.edit}
					height={values.height}
					width={values.width}
					tooltip={values.tooltip}
					modalWidth={values.modalWidth}></Avatar>
			)}
			siblings={[
				{
					name: "AvatarImage",
					description: "The picture on its own, at a fixed size. A null or missing url renders an empty image rather than throwing.",
					props: AVATAR_IMAGE_PROPS,
					previewHeight: 160,
					preview: values => (
						<AvatarImage url={SAMPLE_FACE} height={values.height} width={values.width}></AvatarImage>
					)
				},
				{
					name: "AvatarEmpty",
					description: "The fallback glyph, sized against the height it is given. It fills whatever it is put in, so a round frame is the parent's job.",
					props: AVATAR_EMPTY_PROPS,
					previewHeight: 160,
					preview: values => (
						<div style={{height: values.height + "px", width: values.height + "px", borderRadius: "50%", overflow: "hidden"}}>
							<AvatarEmpty height={values.height}></AvatarEmpty>
						</div>
					)
				},
				{
					name: "AvatarList",
					description: "Several users overlapped into a single stack, with the count of everyone past the limit shown on the end.",
					props: AVATAR_LIST_PROPS,
					previewHeight: 160,
					preview: values => (
						<AvatarList
							users={[]}
							height={values.height}
							overlap={values.overlap}
							border={values.border}
							backgroundColor={values.backgroundColor}
							borderRadius={values.borderRadius}
							overflowNum={values.overflowNum}></AvatarList>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
