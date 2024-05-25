import React, {ReactNode, useState} from "react";

import './SideBarHeaderItem.css'
import {SideBarState} from "../../default/SideBar";
import {Media} from "@blue-orange-ai/foundations-clients";
import {RenderMedia} from "../../../../media/default/RenderMedia";
import {ButtonIcon} from "../../../../buttons/button-icon/ButtonIcon";

interface Props {
	label: string,
	labelStyle?: React.CSSProperties,
	state: SideBarState,
	media?: Media,
	action?: ReactNode,
	changeState?: (state: SideBarState) => void
}

export const SideBarHeaderItem: React.FC<Props> = ({
													   label,
													   state,
													   media,
													   labelStyle={},
													   action,
													   changeState}) => {


	const [closedHoverState, setClosedHoverState] = useState(false);

	const changeSideBarState = (state: SideBarState) => {
		if (changeState) {
			changeState(state);
		}
	}

	return (
		<div className="blue-orange-sidebar-header-item no-select">
			{state == SideBarState.OPEN &&
				<div className="blue-orange-sidebar-header-item-cont">
					{media != undefined &&
						<div className="blue-orange-sidebar-header-item-media">
							<RenderMedia media={(media as Media)} height={32} width={32} borderRadius={"4px"}></RenderMedia>
						</div>
					}
					<div className="blue-orange-sidebar-header-item-media-body" style={labelStyle}>{label}</div>
					{action &&
						<div className="blue-orange-sidebar-header-item-action">
							{action}
						</div>
					}
				</div>
			}
			{state == SideBarState.CLOSED &&
				<div className="blue-orange-sidebar-header-item-small-cont">
					{media != undefined &&
						<div
							onMouseOver={() => setClosedHoverState(true)}
							onMouseLeave={() => setClosedHoverState(false)}>
							{closedHoverState &&
								<ButtonIcon
									icon="ri-arrow-right-double-fill"
									onClick={() => changeSideBarState(SideBarState.OPEN)}></ButtonIcon>
							}
							{!closedHoverState && <RenderMedia media={(media as Media)} height={32} width={32} borderRadius={"4px"}></RenderMedia>}
						</div>
					}
					{media == undefined &&
						<div className="blue-orange-sidebar-header-item-media">
							<ButtonIcon
								icon="ri-arrow-right-double-fill"
								onClick={() => changeSideBarState(SideBarState.OPEN)}></ButtonIcon>
						</div>
					}
				</div>
			}
		</div>
	)
}