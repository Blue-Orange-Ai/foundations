import React, {useEffect, useRef, useState} from "react";

import './UserGroupTableCheckBox.css';
import {DefaultCheckbox} from "../../../utils/defaultcheckbox/DefaultCheckbox";
import {GroupSelectionState} from "../usergrouptable/UserGroupTable";

interface Props {
	groupId:number;
	groupSelectionState: Array<GroupSelectionState>;
	change: Date | undefined
}

export const UserGroupTableCheckBox: React.FC<Props> = ({
															groupId,
															groupSelectionState,
															change}) => {
	const getGroupSelectionState = (groupId: number) => {
		var groupSelection = groupSelectionState.find(group => group.groupId === groupId);
		if (groupSelection != null) {
			return groupSelection.state
		}
		return false;
	}

	const [isChecked, setIsChecked] = useState(getGroupSelectionState(groupId));

	useEffect(() => {
		setIsChecked(getGroupSelectionState(groupId));
	}, [groupSelectionState, groupId, change]);


	return (
		<DefaultCheckbox checked={isChecked} readonly={true}></DefaultCheckbox>
	);
};