import React, {useContext, useEffect, useState} from "react";
import {
	Badge,
	Button,
	ButtonIcon,
	ButtonType,
	Cell,
	CellAlignment, CheckboxCell, Dropdown, DropdownItemIcon,
	InputForm,
	Metric,
	Modal,
	ModalBody,
	ModalFooter,
	ModalFooterLeft,
	ModalFooterRight,
	ModalHeader,
	PaddedPage,
	PageHeading,
	Row,
	SearchInput,
	Table,
	TBody,
	THead,
	ToastContext,
	ToasterType,
	ToastLocation
} from "@blue-orange-ai/foundations-core";


import passport from "@blue-orange-ai/foundations-core/src/components/config/BlueOrangePassportConfig";

import './GroupAdmin.css'
import {v4 as uuidv4} from "uuid";
import {useNavigate, useParams} from "react-router-dom";
import {
	Group,
	GroupMember,
	GroupMemberSearchQuery,
	GroupMemberType,
	GroupPermission, SimpleGroupMember,
	User
} from "@blue-orange-ai/foundations-clients";

interface Props {
	groupId: string,
	group: Group,
	userRedirectUri?: string,
	groupRedirectUri?: string,
	deleteRedirectUri?: string,
}

export const GroupAdmin: React.FC<Props> = ({groupId, group, userRedirectUri = "/users/", groupRedirectUri="/groups/", deleteRedirectUri="/groups"}) => {

	const { addToast } = useContext(ToastContext);

	const navigate = useNavigate();

	const convertPermissionToText = (permission: GroupPermission) => {
		if (permission == GroupPermission.READ) {
			return "Read"
		} else if (permission == GroupPermission.EDITOR) {
			return "Edit"
		} else if (permission == GroupPermission.OWNER) {
			return "Owner"
		}
		return "Unknown"
	}

	const convertPermissionToSelection = (permission: GroupPermission) => {
		if (permission == GroupPermission.READ) {
			return "READ"
		} else if (permission == GroupPermission.EDITOR) {
			return "EDIT"
		} else if (permission == GroupPermission.OWNER) {
			return "OWNER"
		}
		return "Unknown"
	}

	const [groups, setGroups] = useState<Array<Group>>([]);

	const [users, setUsers] = useState<Array<User>>([]);

	const [groupMembers, setGroupMembers] = useState<Array<GroupMember>>([]);

	const [deleteGroupModal, setDeleteGroupModal] = useState<boolean>(false);

	const [editGroupModal, setEditGroupModal] = useState<boolean>(false);

	const [removeGroupLoading, setRemoveGroupLoading] = useState<boolean>(false);

	const [editGroupPermission, setEditGroupPermission] = useState<string>("READ");

	const [addMemberPermission, setAddMemberPermission] = useState<string>("READ");

	const [addMemberType, setAddMemberType] = useState<string>("GROUP");

	const [focusMember, setFocusMember] = useState<GroupMember | undefined>(undefined);

	const [editGroupLoading, setEditGroupLoading] = useState<boolean>(false);

	const [addMemberModal, setAddMemberModal] = useState<boolean>(false);

	const [selectedMembers, setSelectedMembers] = useState<Array<string>>([]);

	const [addGroupLoading, setAddGroupLoading] = useState<boolean>(false);

	const getUsers = (query: string) => {
		if (groupId) {
			passport.searchUsers({
				page: 0,
				query: query,
				size: 20
			}).then(result => {
				setUsers(result.result);
			}).catch(response => {
				addToast({
					id: uuidv4(),
					heading: "An error occurred whilst attempting to retrieve users",
					description: response.message,
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		}
	}

	const getGroups = (query: string) => {
		if (groupId) {
			passport.searchGroups({
				page: 0,
				query: query,
				size: 20
			}).then(result => {
				setGroups(result.result);
			}).catch(response => {
				addToast({
					id: uuidv4(),
					heading: "An error occurred whilst attempting to retrieve groups",
					description: response.message,
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		}
	}

	const deleteGroup = () => {
		passport.adminDeleteGroup({
			groupId: groupId
		}).then(result => {
			navigate(deleteRedirectUri)
		}).catch(response => {
			addToast({
				id: uuidv4(),
				heading: "An error occurred whilst attempting to delete this group",
				description: response.message,
				location: ToastLocation.TOP_RIGHT,
				toastType: ToasterType.ERROR,
				ttl: 5000})
		})
	}

	const getMembers = (searchQuery: GroupMemberSearchQuery) => {
		passport.adminSearchGroupMembers(groupId as string, searchQuery)
			.then(response => {
				if (response.result == null) {
					setGroupMembers([]);
				} else {
					setGroupMembers(response.result);
				}
			}).catch(response => {
				setGroupMembers(response.result);
				addToast({
				id: uuidv4(),
				heading: "An error occurred whilst attempting to retrieve group members",
				description: response.message,
				location: ToastLocation.TOP_RIGHT,
				toastType: ToasterType.ERROR,
				ttl: 5000})
		})
	}

	const searchMembers = (searchQuery: string) => {
		getMembers({
			page: 0,
			query: searchQuery,
			size: 20
		})
	}

	const searchUsers = (searchQuery: string) => {
		getUsers(searchQuery);
	}

	const searchGroups = (searchQuery: string) => {
		getGroups(searchQuery);
	}

	const memberClicked = (member: GroupMember) => {
		if (member.type == GroupMemberType.USER) {
			navigate(userRedirectUri + member.referenceId);
		} else {
			navigate(groupRedirectUri + member.referenceId);
		}

	}

	const removeMemberFromGroup = () => {
		if (group && focusMember) {
			setRemoveGroupLoading(true);
			passport.adminRemoveMembersFromGroup({
				member: {
					memberId: focusMember.referenceId
				},
				groupName: group.name
			})
				.then(result => {
					setRemoveGroupLoading(false);
					setEditGroupModal(false);
					addToast({
						id: uuidv4(),
						heading: "Group Removed",
						description: "",
						location: ToastLocation.TOP_RIGHT,
						toastType: ToasterType.SUCCESS,
						ttl: 5000})
					getMembers({
						page: 0,
						query: "",
						size: 20
					})
				}).catch(reason => {
				setRemoveGroupLoading(false);
				setEditGroupModal(false);
				addToast({
					id: uuidv4(),
					heading: "An error occurred removing group.",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		}
	}

	const editGroup = () => {
		if (group && focusMember) {
			setEditGroupLoading(true);
			var permission: GroupPermission = GroupPermission.READ;
			if (editGroupPermission == "OWNER") {
				permission = GroupPermission.OWNER;
			} else if (editGroupPermission == "EDIT") {
				permission = GroupPermission.EDITOR;
			}
			passport.adminUpdateMemberPermission({
				groupId: group.id as string,
				memberId: focusMember.referenceId,
				type: focusMember.type,
				permission: permission
				})
				.then(result => {
					setEditGroupLoading(false);
					setEditGroupModal(false);
					addToast({
						id: uuidv4(),
						heading: "Group Permission Updated",
						description: "",
						location: ToastLocation.TOP_RIGHT,
						toastType: ToasterType.SUCCESS,
						ttl: 5000})
					getMembers({
						page: 0,
						query: "",
						size: 20
					})
				}).catch(reason => {
				setEditGroupLoading(false);
				setEditGroupModal(false);
				addToast({
					id: uuidv4(),
					heading: "An error occurred updating the group.",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		}
	}

	const isMemberSelected = (id: string) =>{
		for (var i=0; i < selectedMembers.length; i++) {
			if (selectedMembers[i] == id) {
				return true;
			}
		}
		return false;
	}

	const setMemberSelectionState = (referenceId: string, state: boolean) =>{
		var newSelection: Array<string> = []
		for (var i=0; i < selectedMembers.length; i++) {
			if (selectedMembers[i] == referenceId) {
				continue;
			}
			newSelection.push(selectedMembers[i]);
		}
		if (state) {
			newSelection.push(referenceId);
		}
		setSelectedMembers(newSelection);
	}

	const addMembersToGroup = () => {
		if (selectedMembers.length > 0 && group) {
			var addMembers: Array<SimpleGroupMember> = [];
			var permission: GroupPermission = GroupPermission.READ;
			if (addMemberPermission == "OWNER") {
				permission = GroupPermission.OWNER;
			} else if (addMemberPermission == "EDIT") {
				permission = GroupPermission.READ;
			}
			for (var i=0; i < selectedMembers.length; i++) {
				addMembers.push({
					memberId: selectedMembers[i],
					permission: permission
				})
			}
			setAddGroupLoading(true);
			passport.adminAddMembersToGroup({
				members: addMembers,
				id: group.id
			}).then((result) => {
				setAddGroupLoading(false);
				getMembers({
					page: 0,
					query: "",
					size: 20
				})
				setAddMemberModal(false);
				addToast({
					id: uuidv4(),
					heading: "Groups added",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.SUCCESS,
					ttl: 5000})
			}).catch((error) => {
				setAddGroupLoading(false);
				addToast({
					id: uuidv4(),
					heading: "An error occurred while adding groups",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		}
	}

	useEffect(() => {
		getMembers({
			page: 0,
			query: "",
			size: 20
		})
	}, []);

	return (
		<>
			<PaddedPage>
				{group &&
					<>
						<div className="passport-group-main-heading">
							<div className="passport-group-main-heading-txt">
								<PageHeading>{group.name}</PageHeading>
							</div>
							<div className="passport-group-main-heading-btns">
								<ButtonIcon icon={"ri-delete-bin-7-fill"}
											onClick={() => setDeleteGroupModal(true)}></ButtonIcon>
							</div>
						</div>
						<InputForm>
							<Metric text={group.id as string} label={"Group Id"}></Metric>
							<div>
								<div className="passport-groups-user-search-header">
									<div className="passport-groups-user-search-cont">
										<SearchInput onSearchEvent={searchMembers}></SearchInput>
									</div>
									<div className="passport-groups-user-search-controls">
										<ButtonIcon icon={"ri-add-line"} label={"Add Member"} onClick={() => {
											getUsers("")
											getGroups("")
											setAddMemberPermission("READ")
											setAddMemberModal(true);
										}}></ButtonIcon>
									</div>
								</div>
								<div className="passport-groups-users-search-table">
									<Table>
										<THead>
											<Row hoverEffect={false}>
												<Cell style={{
													backgroundColor: "#f7f8f9",
													fontWeight: "600",
													border: "none",
													borderBottom: "1px solid #e0e1e2",
													borderLeft: "none",
													borderTop: "none"
												}}>Member</Cell>
												<Cell style={{
													backgroundColor: "#f7f8f9",
													fontWeight: "600",
													border: "none",
													borderBottom: "1px solid #e0e1e2",
													borderTop: "none"
												}}>Permission</Cell>
												<Cell
													alignment={CellAlignment.CENTER}
													style={{
													backgroundColor: "#f7f8f9",
													fontWeight: "600",
													border: "none",
													borderBottom: "1px solid #e0e1e2",
													borderTop: "none"
												}}>Edit</Cell>
											</Row>
										</THead>
										<TBody>
											{groupMembers.map((item, index) => (
												<Row key={item.groupId + "-" + index} hoverEffect={false}>
													<Cell style={{
														border: "none",
														borderLeft: "none",
														borderBottom: index == (groupMembers.length - 1) ? "none" : "1px solid #e0e1e2",
														borderTop: "none"
													}} onClick={() => memberClicked(item)}>
														<div className="passport-user-groups-primary-cell">
															<div className="passport-user-groups-primary-cell-main">
																{item.referenceId}
															</div>
														</div>
													</Cell>
													<Cell style={{
														border: "none",
														borderBottom: index == (groupMembers.length - 1) ? "none" : "1px solid #e0e1e2",
														borderTop: "1px solid #e0e1e2"
													}}>
														{item.permission == GroupPermission.OWNER && <Badge style={{
															width: "fit-content",
															backgroundColor: "#1b4f72"
														}}>{convertPermissionToText(item.permission)}</Badge>}
														{item.permission == GroupPermission.EDITOR && <Badge style={{
															width: "fit-content",
															backgroundColor: "#145a32"
														}}>{convertPermissionToText(item.permission)}</Badge>}
														{item.permission == GroupPermission.READ && <Badge style={{
															width: "fit-content",
															backgroundColor: "#626567"
														}}>{convertPermissionToText(item.permission)}</Badge>}
													</Cell>
													<Cell alignment={CellAlignment.CENTER} style={{
														border: "none",
														borderBottom: index == (groupMembers.length - 1) ? "none" : "1px solid #e0e1e2",
														borderTop: "1px solid #e0e1e2"
													}}>
														<div className="passport-user-profile-group-edit-btn">
															<ButtonIcon icon={"ri-pencil-line"} onClick={() => {
																setFocusMember(item);
																setEditGroupPermission(convertPermissionToSelection(item.permission));
																setEditGroupModal(true);
															}}></ButtonIcon>
														</div>
													</Cell>
												</Row>
											))}
										</TBody>
									</Table>
								</div>
							</div>
						</InputForm>
					</>

				}
				{
					deleteGroupModal &&
					<Modal minWidth={400} width={400} onClose={() => setDeleteGroupModal(false)}>
						<ModalHeader label={"Delete User"} onClose={() => setDeleteGroupModal(false)}></ModalHeader>
						<ModalBody>
							<p style={{marginBottom: "50px"}}>Are you sure you want to delete this group? Once deleted all linked data will no longer
								be recoverable.</p>
						</ModalBody>
						<ModalFooter>
							<ModalFooterLeft>
								<Button text={"Cancel"} buttonType={ButtonType.SECONDARY}
										onClick={() => setDeleteGroupModal(false)}></Button>
							</ModalFooterLeft>
							<ModalFooterRight>
								<Button text={"Delete Group"} buttonType={ButtonType.DANGER} onClick={() => {
									setDeleteGroupModal(false);
									deleteGroup();
								}}></Button>
							</ModalFooterRight>
						</ModalFooter>
					</Modal>
				}
				{editGroupModal &&
					<Modal minWidth={600} width={600} onClose={() => setEditGroupModal(false)}>
						<ModalHeader label={"Edit Group"} onClose={() => setEditGroupModal(false)}></ModalHeader>
						<ModalBody>
							<InputForm paddingBottom={40}>
								<Dropdown label={"Permission"} onSelection={(item) => setEditGroupPermission(item.reference)}>
									<DropdownItemIcon src={"ri-shield-star-fill"} label={"Owner"} value={"OWNER"} selected={editGroupPermission == "OWNER"}></DropdownItemIcon>
									<DropdownItemIcon src={"ri-pencil-fill"} label={"Edit"} value={"EDIT"} selected={editGroupPermission == "EDIT"}></DropdownItemIcon>
									<DropdownItemIcon src={"ri-eye-fill"} label={"Read"} value={"READ"} selected={editGroupPermission == "READ"}></DropdownItemIcon>
								</Dropdown>
							</InputForm>
						</ModalBody>
						<ModalFooter>
							<ModalFooterLeft>
								<Button text={"Remove"} buttonType={ButtonType.SECONDARY} onClick={removeMemberFromGroup} isLoading={removeGroupLoading}></Button>
							</ModalFooterLeft>
							<ModalFooterRight>
								<Button text={"Update"} buttonType={ButtonType.PRIMARY} onClick={editGroup} isLoading={editGroupLoading}></Button>
							</ModalFooterRight>
						</ModalFooter>
					</Modal>
				}
				{
					addMemberModal &&
					<Modal minWidth={600} width={600} onClose={() => setAddMemberModal(false)}>
						<ModalHeader label={"Add Member"} onClose={() => setAddMemberModal(false)}></ModalHeader>
						<ModalBody>
							<InputForm paddingBottom={40}>
								<Dropdown label={"Member Type"} onSelection={(item) => setAddMemberType(item.reference)}>
									<DropdownItemIcon src={"ri-shield-star-fill"} label={"Group"} value={"GROUP"} selected={addMemberType == "GROUP"}></DropdownItemIcon>
									<DropdownItemIcon src={"ri-pencil-fill"} label={"User"} value={"USER"} selected={addMemberType == "USER"}></DropdownItemIcon>
								</Dropdown>
								<Dropdown label={"Permission"} onSelection={(item) => setAddMemberPermission(item.reference)}>
									<DropdownItemIcon src={"ri-shield-star-fill"} label={"Owner"} value={"OWNER"} selected={addMemberPermission == "OWNER"}></DropdownItemIcon>
									<DropdownItemIcon src={"ri-pencil-fill"} label={"Edit"} value={"EDIT"} selected={addMemberPermission == "EDIT"}></DropdownItemIcon>
									<DropdownItemIcon src={"ri-eye-fill"} label={"Read"} value={"READ"} selected={addMemberPermission == "READ"}></DropdownItemIcon>
								</Dropdown>
								{addMemberType == "GROUP" &&
									<div>
										<div className="passport-groups-user-search-header">
											<div className="passport-groups-user-search-cont">
												<SearchInput onSearchEvent={searchGroups}></SearchInput>
											</div>
										</div>
										<div className="passport-groups-users-search-table-modal">
											<Table>
												<THead>
													<Row hoverEffect={false}>
														<Cell style={{
															backgroundColor: "#f7f8f9",
															fontWeight: "600",
															border: "none",
															borderBottom: "1px solid #e0e1e2",
															borderLeft: "none",
															borderTop: "none"
														}}><div></div></Cell>
														<Cell style={{
															backgroundColor: "#f7f8f9",
															fontWeight: "600",
															border: "none",
															borderBottom: "1px solid #e0e1e2",
															borderLeft: "none",
															borderTop: "none"
														}}>Group</Cell>
													</Row>
												</THead>
												<TBody>
													{groups.map((item, index) => (
														<Row key={item.id + "-" + index} hoverEffect={false}>
															<CheckboxCell
																state={isMemberSelected(item.id as string)}
																onClick={(state) => {setMemberSelectionState((item.id as string), state)}}
																style={{
																border: "none",
																borderLeft: "none",
																borderBottom: index == (groups.length - 1) ? "none" : "1px solid #e0e1e2",
																borderTop: "none"
															}}></CheckboxCell>
															<Cell style={{
																border: "none",
																borderLeft: "none",
																borderBottom: index == (groups.length - 1) ? "none" : "1px solid #e0e1e2",
																borderTop: "none"
															}}>
																<div className="passport-user-groups-primary-cell">
																	<div
																		className="passport-user-groups-primary-cell-main">
																		{item.name}
																	</div>
																</div>
															</Cell>
														</Row>
													))}
												</TBody>
											</Table>
										</div>
									</div>
								}
								{addMemberType == "USER" &&
									<div>
										<div className="passport-groups-user-search-header">
											<div className="passport-groups-user-search-cont">
												<SearchInput onSearchEvent={searchUsers}></SearchInput>
											</div>
										</div>
										<div className="passport-groups-users-search-table-modal">
											<Table>
												<THead>
													<Row hoverEffect={false}>
														<Cell style={{
															backgroundColor: "#f7f8f9",
															fontWeight: "600",
															border: "none",
															borderBottom: "1px solid #e0e1e2",
															borderLeft: "none",
															borderTop: "none"
														}}><div></div></Cell>
														<Cell style={{
															backgroundColor: "#f7f8f9",
															fontWeight: "600",
															border: "none",
															borderBottom: "1px solid #e0e1e2",
															borderLeft: "none",
															borderTop: "none"
														}}>User</Cell>
													</Row>
												</THead>
												<TBody>
													{users.map((item, index) => (
														<Row key={item.id + "-" + index} hoverEffect={false}>
															<CheckboxCell
																state={isMemberSelected(item.id as string)}
																onClick={(state) => {setMemberSelectionState((item.id as string), state)}}
																style={{
																border: "none",
																borderLeft: "none",
																borderBottom: index == (users.length - 1) ? "none" : "1px solid #e0e1e2",
																	maxWidth: "60px",
																borderTop: "none"
															}}></CheckboxCell>
															<Cell style={{
																border: "none",
																borderLeft: "none",
																borderBottom: index == (users.length - 1) ? "none" : "1px solid #e0e1e2",
																borderTop: "none"
															}}>
																<div className="passport-user-groups-primary-cell">
																	<div
																		className="passport-user-groups-primary-cell-main">
																		{item.username}
																	</div>
																</div>
															</Cell>
														</Row>
													))}
												</TBody>
											</Table>
										</div>
									</div>
								}
								{selectedMembers.length > 1 && <div className="passport-groups-add-member-search-table-info">{selectedMembers.length} members selected</div>}
								{selectedMembers.length == 1 && <div className="passport-groups-add-member-search-table-info">{selectedMembers.length} members selected</div>}
							</InputForm>
						</ModalBody>
						<ModalFooter>
							<ModalFooterLeft>
								<Button text={"Cancel"} buttonType={ButtonType.SECONDARY}
										onClick={() => setAddMemberModal(false)} isLoading={removeGroupLoading}></Button>
							</ModalFooterLeft>
							<ModalFooterRight>
								<Button text={"Update"} buttonType={ButtonType.PRIMARY} onClick={addMembersToGroup}
										isLoading={addGroupLoading}></Button>
							</ModalFooterRight>
						</ModalFooter>
					</Modal>
				}
			</PaddedPage>
		</>
	)
}