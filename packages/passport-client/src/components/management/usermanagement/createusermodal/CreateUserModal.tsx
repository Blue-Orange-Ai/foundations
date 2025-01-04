import React, {useEffect, useRef, useState} from "react";

import "./CreateUserModal.css"

import Passport, {Group, User} from "../../../utils/sdks/passport/Passport";
import {DefaultBtn} from "../../../utils/defaultbtn/DefaultBtn";
import {SearchInput2} from "../../../utils/searchinput2/SearchInput2";
import {ContextMenu} from "../../../utils/contextmenu/ContextMenu";
import {DefaultBtnCircleIcon} from "../../../utils/defaultbtncircleicon/DefaultBtnCircleIcon";
import {IContextMenuItem} from "../../../../interfaces/AppInterfaces";
import {DefaultCheckbox} from "../../../utils/defaultcheckbox/DefaultCheckbox";

interface Props {
	user?: User,
	onClose?: () => void;
}

export const CreateUserModal: React.FC<Props> = ({user, onClose}) => {

	const [loading, setLoading] = useState(false);

	const [loadingSave, setLoadingSave] = useState(false);

	const modalElem = useRef<HTMLDivElement>(null);

	const [count, setCount] = useState(0);

	const [workingPage, setWorkingPage] = useState(0);

	const [workingSize, setWorkingSize] = useState(20);

	const [selectedGroups, setSelectedGroups] = useState<Array<number>>([]);

	const [groups, setGroups] = useState<Array<Group>>([]);

	const [latestSelected, setLatestSelected] = useState<number | undefined>(undefined);

	const [query, setQuery] = useState("");

	const [forceCheckBoxRender, setForceCheckBoxRender] = useState(new Date());

	useEffect(() => {
		getGroups("", 0, 20);
	}, []);

	useEffect(() => {
	}, [selectedGroups]);

	const closeModal = (e:React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		if (!isDescendantOf(modalElem.current, target) && onClose !== undefined) {
			onClose();
		}
	};

	const forceCloseModal = (e:React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (onClose !== undefined) {
			onClose();
		}
	};

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
		getGroups(query, 0, item.value);
	}

	const contextMenuPageClicked = (item: IContextMenuItem) => {
		setWorkingPage(item.value);
		getGroups(query, item.value, workingSize);
	}

	const nextPage = () => {
		setWorkingPage(workingPage + 1);
		getGroups(query, workingPage + 1, workingSize);
	}

	const prevPage = () => {
		setWorkingPage(workingPage - 1);
		getGroups(query, workingPage - 1, workingSize);
	}


	const clearSelectedGroups = () => {
		setSelectedGroups([]);
	}

	const getSaveLabel = () => {
		if (selectedGroups.length > 0) {
			return "Save selected groups (" + selectedGroups.length + ")"
		}
		return "Save selected groups"
	}

	const saveGroups = () => {
		var passport = new Passport("http://localhost:8080");
		if (user != null && user.id != null) {
			setLoadingSave(true);
			passport.adminAddGroupsToUser({
				groups: selectedGroups,
				userId: user.id
			})
				.then(userGroupSearchResult => {
					setLoadingSave(false);
					if (onClose !== undefined) {
						onClose();
					}
				})
				.catch(error => {
					setLoadingSave(false);
					console.log(error)
				});
		}
	}

	const getGroups = (q:string, p:number, s:number) => {
		var passport = new Passport("http://localhost:8080");
		if (user != null && user.id != null) {
			setLoading(true);
			passport.searchGroups({
				query: q,
				page: p,
				size: s
			})
				.then(userGroupSearchResult => {
					setLoading(false);
					setGroups(userGroupSearchResult.result);
					setCount(userGroupSearchResult.count);
				})
				.catch(error => {
					setLoading(false);
					console.log(error)
				});
		}
	}

	const getGroupsBetweenLatestSelected = (groupId: number) => {
		if (latestSelected === undefined) {
			return [groupId];
		}
		var toggleGroups: Array<number> = [];
		var found = false;
		var finished = false;
		for (let group of groups) {
			if (!found && (group.id === groupId || group.id === latestSelected)) {
				found = true;
				toggleGroups.push(group.id);
			} else if (found && (group.id === groupId || group.id === latestSelected)) {
				finished = true;
				toggleGroups.push(group.id);
				break;
			} else if (found && group.id !== undefined) {
				toggleGroups.push(group.id);
			}
		}
		if (!finished) {
			return [groupId];
		}

		return toggleGroups.filter(number => number !== latestSelected);
	}

	const toggleSelectionStates = (groupIds: Array<number>) => {
		var tmpSelectedGroups = selectedGroups;
		for (let groupId of groupIds) {
			var groupSelection = tmpSelectedGroups.find(selectedGroupId => selectedGroupId === groupId);
			if (groupSelection != null) {
				const sgs = tmpSelectedGroups.filter((element) => element !== groupId);
				tmpSelectedGroups = sgs;
			} else {
				tmpSelectedGroups.push(groupId)
			}
		}
		setSelectedGroups(tmpSelectedGroups);
	}

	const toggleSelectionState = (groupId:number|undefined, event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (groupId !== undefined) {
			if (event.shiftKey) {
				toggleSelectionStates(getGroupsBetweenLatestSelected(groupId));
			} else {
				toggleSelectionStates([groupId]);
				setLatestSelected(groupId);
			}
		}
		setForceCheckBoxRender(new Date());
	}

	const handleSearchEvent = (q: string) => {
		setQuery(q);
		setWorkingPage(0);
		getGroups(q, 0, workingSize);
	}

	return (
		<div className="default-modal-backdrop" onClick={closeModal}>
			<div ref={modalElem} className="passport-add-user-group-modal shadow">
				<div className="default-modal-close-btn" onClick={forceCloseModal}>
					<i className="ri-close-line"></i>
				</div>
				<h1>Add User to Group</h1>
				<p className="default-modal-description">Once added to the group the user will have all of the privileges associated with this group.</p>
				<div className="add-user-group-modal-table-ctrls">
					<SearchInput2 icon={"ri-filter-3-line"} label={"Filter by group name"} style={{width: "calc(100% - 46px)"}} onSearchEvent={handleSearchEvent}></SearchInput2>
					<div className="default-sml-table-ctrl-btn-right">
						<DefaultBtnCircleIcon
							icon={"ri-prohibited-line"}
							label={"Clear selected groups"}
							onClick={clearSelectedGroups}
							isDisabled={selectedGroups.length <= 0}></DefaultBtnCircleIcon>
					</div>
				</div>
				{loading &&
					<div>
						<div className="default-sml-table-container">
							<div className="default-sml-table-empty">
								<div className="default-sml-table-empty-avatar">
									<i className="ri-folders-line"></i>
								</div>
								<div className="default-sml-table-empty-avatar-text no-select">Loading<i className="ri-loader-4-line rotate-spinner" style={{marginLeft: "15px"}}></i></div>
							</div>
						</div>
						<div className="passport-user-group-footer" style={{height: "50px"}}></div>
					</div>
				}
				{!loading && groups.length <= 0 &&
					<div>
						<div className="default-sml-table-container">
							<div className="default-sml-table-empty">
								<div className="default-sml-table-empty-avatar">
									<i className="ri-folders-line"></i>
								</div>
								<div className="default-sml-table-empty-avatar-text no-select">No groups found</div>
							</div>
						</div>
						<div className="passport-user-group-footer" style={{height: "50px"}}></div>
					</div>
				}
				{!loading && groups.length > 0 &&
					<div>
						<div className="default-sml-table-container">
							<table className="default-sml-table" style={{maxHeight: "200px", overflowY: "auto"}}>
								<thead>
								<tr>
									<th></th>
									<th>Group Name</th>
								</tr>
								</thead>
								<tbody>
								{groups.map(group => (
									<tr key={group.id} onClick={(event) => toggleSelectionState(group.id, event)}>
										<td style={{position: "relative"}}>
											{/*<AddUserGroupCheckbox groupId={group.id} selectedGroups={selectedGroups} change={forceCheckBoxRender}></AddUserGroupCheckbox>*/}
										</td>
										<td className="no-select">{group.name}</td>
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
									<DefaultBtnCircleIcon icon="ri-arrow-left-s-fill" label="Previous Page" isDisabled={workingPage <= 0} onClick={prevPage}></DefaultBtnCircleIcon>
								</div>
								<div className="passport-user-group-table-footer-prev-next-btn">
									<DefaultBtnCircleIcon icon="ri-arrow-right-s-fill" label="Next Page" isDisabled={workingPage + 1 >= Math.ceil(count / workingSize)} onClick={nextPage}></DefaultBtnCircleIcon>
								</div>
							</div>
						</div>
					</div>

				}
				<div className="add-user-to-group-submit-btn">
					<DefaultBtn label={getSaveLabel()} isDisabled={selectedGroups.length <= 0} style={{width: "200px"}} isLoading={loadingSave} onClick={saveGroups}></DefaultBtn>
				</div>
			</div>
		</div>

	)
}