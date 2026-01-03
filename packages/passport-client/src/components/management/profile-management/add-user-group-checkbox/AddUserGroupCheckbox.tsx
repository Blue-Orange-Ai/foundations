import React, {useEffect, useRef, useState} from "react";

import './AddUserGroupCheckbox.css';
import {Checkbox} from "@blue-orange-ai/foundations-core";

interface Props {
	groupId:string|undefined;
	selectedGroups: Array<string>;
	change: Date | undefined
}

export const AddUserGroupCheckbox: React.FC<Props> = ({
												  groupId,
												  selectedGroups,
														  change}) => {
	const getGroupSelectionState = (groupId: string | undefined) => {
		if (groupId === undefined) {
			return false;
		}
		var groupSelection = selectedGroups.find(selectedGroupId => selectedGroupId === groupId);
		if (groupSelection != null) {
			return true
		}
		return false;
	}

	const [isChecked, setIsChecked] = useState(getGroupSelectionState(groupId));

	useEffect(() => {
		setIsChecked(getGroupSelectionState(groupId));
	}, [selectedGroups, groupId, change]);


	return (
		<Checkbox checked={isChecked} readonly={true}></Checkbox>
	);
};