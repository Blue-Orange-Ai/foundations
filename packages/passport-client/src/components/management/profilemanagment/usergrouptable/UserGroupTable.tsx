import React, {ChangeEvent, MouseEventHandler, useEffect, useImperativeHandle, useRef, useState} from "react";

import "./UserGroupTable.css"

import Passport, {User, UserGroup} from "../../../utils/sdks/passport/Passport";
import {DefaultBtnCircleIcon} from "../../../utils/defaultbtncircleicon/DefaultBtnCircleIcon";
import {type} from "os";
import {ContextMenu} from "../../../utils/contextmenu/ContextMenu";
import {IContextMenuItem} from "../../../../interfaces/AppInterfaces";
import {UserGroupTableCheckBox} from "../usergrouptablecheckbox/UserGroupTableCheckBox";
import {DefaultCheckbox} from "../../../utils/defaultcheckbox/DefaultCheckbox";

interface Props {
	user?: User,
	query?: string,
	page?: number,
	size?: number,
	changeRequest?: Date;
	onSelectedGroups?: (selectedGroups: Array<number>) => void;
}

export type GroupSelectionState = {
	groupId: number,
	state: boolean
}

export const UserGroupTable: React.FC<Props> = ({
													changeRequest,
													onSelectedGroups,
													user,
													query,
													page=0,
													size=20}) => {

	const isInitialMount = useRef(true);

	const componentElem = useRef<HTMLDivElement>(null);

	const [loading, setLoading] = useState(false);

	const [empty, setEmpty] = useState(false);

	const [groups, setGroups] = useState<Array<UserGroup>>([]);

	const [groupSelectionState, setGroupSelectionState] = useState<Array<GroupSelectionState>>([]);

	const [latestSelected, setLatestSelected] = useState<number | undefined>(undefined);

	const [count, setCount] = useState(300);

	const [workingPage, setWorkingPage] = useState(page);

	const [workingSize, setWorkingSize] = useState(size);

	const [forceCheckBoxRender, setForceCheckBoxRender] = useState(new Date());


	useEffect(() => {
		if (!isInitialMount.current) {
			setWorkingPage(0);
			getUserGroups(query === undefined ? "" : query, 0, workingSize);
		}
		return () => {
		};
	}, [query]);

	useEffect(() => {
		if (!isInitialMount.current) {
			publicSearch();
		}
	}, [changeRequest]);

	const initGroupSelectionState = (groups: Array<UserGroup>) => {
		var states: Array<GroupSelectionState> = [];
		for (let group of groups) {
			states.push({
				groupId: group.groupId,
				state: false
			})
		}
		setGroupSelectionState(states);
	}

		const getGroupSelectionState = (groupId: number) => {
			var groupSelection = groupSelectionState.find(group => group.groupId === groupId);
			if (groupSelection != null) {
				return groupSelection.state
			}
			return false;
		}

	const getGlobalGroupSelectionState = () : boolean => {
		if (groupSelectionState.length == 0) {
			return false;
		}
		for (let groupSelection of groupSelectionState) {
			if (!groupSelection.state) {
				return false;
			}
		}
		return true;
	}

	const changeGlobalSelectionState = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		var desiredState = !getGlobalGroupSelectionState();
		for (let groupSelection of groupSelectionState) {
			groupSelection.state = desiredState;
		}
		broadcastSelectedGroups(groupSelectionState);
		setForceCheckBoxRender(new Date())
	}

	const getGroupsBetweenLatestSelected = (groupId: number) => {
		if (latestSelected === undefined) {
			return [groupId];
		}
		var toggleGroups: Array<number> = [];
		var found = false;
		var finished = false;
		for (let group of groups) {
			if (!found && (group.groupId === groupId || group.groupId === latestSelected)) {
				found = true;
				toggleGroups.push(group.groupId);
			} else if (found && (group.groupId === groupId || group.groupId === latestSelected)) {
				finished = true;
				toggleGroups.push(group.groupId);
				break;
			} else if (found) {
				toggleGroups.push(group.groupId);
			}
		}
		if (!finished) {
			return [groupId];
		}
		return toggleGroups.filter(number => number !== latestSelected);
	}


	const toggleSelectionStates = (groupIds: Array<number>) => {
		var newGroupSelectionState = groupSelectionState;
		for (let groupId of groupIds) {
			newGroupSelectionState = newGroupSelectionState.map(item => {
				if (item.groupId === groupId) {
					return { ...item, state: !item.state };
				}
				return item;
			});
		}
		setGroupSelectionState(newGroupSelectionState);
		broadcastSelectedGroups(newGroupSelectionState);
	}
	const toggleSelectionState = (groupId:number, event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (event.shiftKey) {
			toggleSelectionStates(getGroupsBetweenLatestSelected(groupId));
		} else {
			toggleSelectionStates([groupId]);
			setLatestSelected(groupId);
		}
		setForceCheckBoxRender(new Date())
	}

	const isDescendantOf = (parent:HTMLElement | null, child:HTMLElement | null) =>{
		if (parent && child) {
			if (parent === child) {
				return child
			}
			try{
				var node = child.parentElement;
				while (node != null){
					if (node === parent){
						return node;
					}
					node = node.parentElement;
				}
				return null;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	const getUserGroups = (query: string, page: number, size: number) => {
		var passport = new Passport("http://localhost:8080");
		if (user != null && user.id != null) {
			passport.adminGetUserGroups(user.id, {
				query: query,
				page: page,
				size: size
			})
				.then(userGroupSearchResult => {
					setLoading(false);
					setCount(userGroupSearchResult.count);
					setGroups(userGroupSearchResult.result);
					setEmpty(userGroupSearchResult.count === 0);
					initGroupSelectionState(userGroupSearchResult.result);
					setForceCheckBoxRender(new Date());
				})
				.catch(error => {
					setLoading(false);
					console.log(error)
				});
		}
	}

	const publicSearch = () => {
		getUserGroups(query === undefined ? "" : query, workingPage, workingSize);
	}

	const handleGlobalMouseDown = (event: MouseEvent) => {
		if (!isDescendantOf(componentElem.current, event.target as HTMLElement)) {
			setLatestSelected(undefined);
		}
	};


	useEffect(() => {
		document.addEventListener('mousedown', handleGlobalMouseDown);
		isInitialMount.current = false;
		getUserGroups("", workingPage, workingSize)
		return () => {
			document.removeEventListener('mousedown', handleGlobalMouseDown);
		};
	}, []);

	const generateItemsPerPageContextMenu = () => {
		var contextMenu: Array<IContextMenuItem> = []
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>10</div>",
			value: 10
		});
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>25</div>",
			value: 25
		});
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>50</div>",
			value: 50
		});
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>100</div>",
			value: 100
		});
		return contextMenu;
	}

	const generateItemsPageContextMenu = () => {
		var contextMenu: Array<IContextMenuItem> = []
		var items = Math.ceil(count / workingSize);
		for (var i=0; i < items; i++) {
			contextMenu.push({
				label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Page number:</span>" + (i + 1) + "</div>",
				value: i
			});
		}
		return contextMenu;
	}

	const contextMenuItemsPerPage = generateItemsPerPageContextMenu();

	const contextMenuItemsPages = generateItemsPageContextMenu();

	const contextMenuItemsPerPageClicked = (item: IContextMenuItem) => {
		setWorkingPage(0);
		setWorkingSize(item.value);
	}

	const contextMenuPageClicked = (item: IContextMenuItem) => {
		setWorkingPage(item.value);
	}

	const getSelectedGroups = (groupSelectionStates: Array<GroupSelectionState>) => {
		var selectedGroups = [];
		for (let selectionState of groupSelectionStates) {
			if (selectionState.state) {
				selectedGroups.push(selectionState.groupId);
			}
		}
		return selectedGroups;
	}

	const broadcastSelectedGroups = (groupSelectionStates: Array<GroupSelectionState>) => {
		var selectedGroups = getSelectedGroups(groupSelectionStates);
		if (onSelectedGroups) {
			onSelectedGroups(selectedGroups);
		}
	}

	return (
		<div ref={componentElem}>
			{empty &&
				<div className="passport-user-group-table">
					<div className="passport-user-group-table-empty">
						<div className="passport-user-group-table-empty-avatar">
							<i className="ri-folders-line"></i>
						</div>
						<div className="passport-user-group-table-empty-avatar-text no-select">No groups found</div>
					</div>
				</div>
			}
			{!empty &&
				<div>
					<div className="passport-user-group-table">
						<table className="passport-user-group-table-elem">
							<thead>
							<tr>
								<th onClick={changeGlobalSelectionState}><DefaultCheckbox checked={getGlobalGroupSelectionState()} readonly={true} update={forceCheckBoxRender}/></th>
								<th>Group Name</th>
							</tr>
							</thead>
							<tbody>
							{groups.map(group => (
								<tr key={group.groupId}>
									<td onClick={(event) => toggleSelectionState(group.groupId, event)}>
										<UserGroupTableCheckBox groupId={group.groupId} groupSelectionState={groupSelectionState} change={forceCheckBoxRender}></UserGroupTableCheckBox>
									</td>
									<td>{group.groupName}</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
					<div className="passport-user-group-footer">
						<div className="passport-user-group-footer-left">
							<ContextMenu
								width={150}
								items={contextMenuItemsPerPage}
								maxHeight={250}
								onClick={(item) => contextMenuItemsPerPageClicked(item)}
							>
								<div className="passport-user-group-table-footer-general-btn passport-user-group-table-footer-batch-size-select no-select">
									<span className="passport-user-group-table-footer-select-info">Items per page:</span>
									{workingSize}
									<span className="passport-user-group-table-footer-select-control"><i className="ri-expand-up-down-fill"></i></span>
								</div>
							</ContextMenu>
							<div className="passport-user-group-table-footer-user-info">{workingPage * workingSize}-{Math.min(count, workingPage * workingSize + workingSize)} of {count} items</div>
						</div>
						<div className="passport-user-group-footer-right">
							<ContextMenu
								width={150}
								items={contextMenuItemsPages}
								maxHeight={250}
								onClick={(item) => contextMenuPageClicked(item)}
							>
								<div className="passport-user-group-table-footer-general-btn passport-user-group-table-footer-page-select no-select">
									<span className="passport-user-group-table-footer-select-info">Page number:</span> {workingPage + 1}
									<span className="passport-user-group-table-footer-select-control"><i className="ri-expand-up-down-fill"></i></span>
								</div>
							</ContextMenu>
							<div className="passport-user-group-table-footer-prev-next-btn">
								<DefaultBtnCircleIcon icon="ri-arrow-left-s-fill" label="Previous Page" isDisabled={workingPage <= 0}></DefaultBtnCircleIcon>
							</div>
							<div className="passport-user-group-table-footer-prev-next-btn">
								<DefaultBtnCircleIcon icon="ri-arrow-right-s-fill" label="Next Page" isDisabled={workingPage + 1 >= Math.ceil(count / workingSize)}></DefaultBtnCircleIcon>
							</div>
						</div>
					</div>
				</div>
			}
		</div>

	)
}