import React, {useEffect, useRef, useState} from "react";

import './AddUserGroupCheckbox.css';
import {DefaultCheckbox} from "../../../utils/defaultcheckbox/DefaultCheckbox";

interface Props {
	groupId:number|undefined;
	selectedGroups: Array<number>;
	change: Date | undefined
}

export const AddUserGroupCheckbox: React.FC<Props> = ({
												  groupId,
												  selectedGroups,
														  change}) => {
	const getGroupSelectionState = (groupId: number | undefined) => {
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
		<DefaultCheckbox checked={isChecked} readonly={true}></DefaultCheckbox>
	);
};