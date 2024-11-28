import React from "react";

import './RuleCondition.css'
import {TagInput} from "../../inputs/tags/simple/TagInput";
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {DropdownItemIcon} from "../../inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";

interface Props {
}

export const RuleCondition: React.FC<Props> = ({}) => {

	return (
		<div className={"blue-orange-rule-condition-cont"}>
			{/*<TagInput whitelist={["Id", "Age", "Orange"]} maxTags={1} enforceWhitelist={true} onChange={(tags: string[]) => console.log(tags)}></TagInput>*/}
			<Dropdown filter={true}>
				<DropdownItemIcon src={"ri-paragraph"} label={"Text Variable"} value={"variable-value"} selected={false}></DropdownItemIcon>
				<DropdownItemIcon src={"ri-calendar-fill"} label={"Date Variable"} value={"date-variable-value"} selected={false}></DropdownItemIcon>
				<DropdownItemIcon src={"ri-hashtag"} label={"Number Variable"} value={"number-variable-value"} selected={false}></DropdownItemIcon>
				<DropdownItemIcon src={"ri-globe-line"} label={"Geo Variable"} value={"geo-variable-value"} selected={false}></DropdownItemIcon>
			</Dropdown>
		</div>
	)
}