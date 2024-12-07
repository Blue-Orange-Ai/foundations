import React from "react";

import './RenderComment.css'
import {Avatar} from "../../avatar/avatar/Avatar";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {Badge} from "../../text-decorations/badge/Badge";
import {RenderHtml} from "../../text-decorations/render-html/RenderHtml";
import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";

interface Props {
}

export const RenderComment: React.FC<Props> = ({}) => {

	const exampleContent = "<h3>Hello world</h3><p>This is a de<strong>monstrati</strong>on of the rend<em>ering content associ</em>ated <s>with the rick te</s>xt editor</p><pre><code>Here is a code block that we can add to the system</code></pre><ul><li><p>asdklasdk alsdk</p></li><li><p>asd asdkal;s dkasd</p></li><li><p>asd jlasdjaklsd asd</p></li><li><p>ad lasdjklasdj lasdjlkasd</p></li><li><p>asdja skdjaksldj akdsad</p></li><li><p>asdkl;a sdlalsd kasld</p></li></ul><p>asl;dk al;sdkl;askd l;askda</p><p>sd kas;ldkas;ld kasd</p><p>asd kal;sdk;as kd;lasdk</p>"

	const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.HEADING, label: "Sort Direction", value:""},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.SEPARATOR, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	const moreButtonStyle: React.CSSProperties = {
		border: "none"
	}

	return (
		<div className="blue-orange-comments-render-cont">
			<div className="blue-orange-comments-render-avatar-cont">
				<Avatar user={undefined} height={38} width={38}></Avatar>
			</div>
			<div className="blue-orange-comments-render-body">
				<div className="blue-orange-comments-render-body-header">
					<div className="blue-orange-comments-render-body-header-left">
						<span className="blue-orange-comments-render-body-header-title">Tom Seneviratne</span>
						<span className="blue-orange-comments-render-body-header-secondary"> commented 5 days ago</span>
					</div>
					<div className="blue-orange-comments-render-body-header-right">
						<Badge>
							<div>Contributor</div>
						</Badge>
						<ContextMenu maxHeight={200} items={contextMenuItems}>
							<ButtonIcon icon={"ri-more-line"} style={moreButtonStyle}></ButtonIcon>
						</ContextMenu>
					</div>
				</div>
				<div className="blue-orange-comments-render-body-cont">
					<RenderHtml html={exampleContent}></RenderHtml>
				</div>
			</div>
		</div>
	)
}