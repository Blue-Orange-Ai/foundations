import React, {useEffect, useRef, useState} from "react";

import './UserGroupTableCheckBox.css';
import {Checkbox} from "@blue-orange-ai/foundations-core";
import {GroupSelectionState} from "../user-group-table/UserGroupTable";

interface Props {
	groupId:string;
	groupSelectionState: Array<GroupSelectionState>;
	change: Date | undefined
}

export const UserGroupTableCheckBox: React.FC<Props> = ({
															groupId,
															groupSelectionState,
															change}) => {
	const getGroupSelectionState = (groupId: string) => {
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
		<Checkbox checked={isChecked} readonly={true}></Checkbox>
	);
};