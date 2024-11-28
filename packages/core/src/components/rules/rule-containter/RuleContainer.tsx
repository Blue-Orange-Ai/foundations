import React from "react";

import './RuleContainer.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {RuleCondition} from "../rule-condition/RuleCondition";
import {TagInput} from "../../inputs/tags/simple/TagInput";

interface Props {
}

export const RuleContainer: React.FC<Props> = ({}) => {

	return (
		<div className="blue-orange-rule-container">
			<div className="blue-orange-rule-header">
				<div className="blue-orange-rule-header-label">Test Rule Interface</div>
				<div className="blue-orange-rule-header-controls">
					<ButtonIcon icon={"ri-edit-fill"} label={"Edit"}></ButtonIcon>
					<ButtonIcon icon={"ri-delete-bin-7-fill"} label={"Delete"}></ButtonIcon>
				</div>
			</div>
			<RuleCondition>
			</RuleCondition>
		</div>
	)
}