import {
	AddressInput,
	Avatar,
	Badge,
	Button,
	ButtonIcon,
	ButtonType,
	Cell,
	CellAlignment,
	CheckboxCell,
	Dropdown,
	DropdownItemIcon,
	DropdownItemText,
	ErrorBlockAlert,
	Input,
	InputForm,
	Metric,
	MetricWithAction,
	Modal,
	ModalBody,
	ModalFooter,
	ModalFooterLeft,
	ModalFooterRight,
	ModalHeader,
	PaddedPage,
	PhoneInput,
	Row,
	SearchInput,
	Table,
	TBody,
	THead,
	ToastContext,
	ToasterType,
	ToastLocation,
	Toggle
} from "@blue-orange-ai/foundations-core";
import React, {useContext, useEffect, useState} from "react";

import './UserProfile.css'
import {
	AddGroup,
	Address,
	Avatar as AvatarObj,
	Group,
	GroupPermission,
	GroupSearchQuery,
	Telephone,
	User,
	UserGroup,
	UserState
} from "@blue-orange-ai/foundations-clients";
import passport from "@blue-orange-ai/foundations-core/src/components/config/BlueOrangePassportConfig";
import {v4 as uuidv4} from "uuid";
import {useNavigate} from "react-router-dom";

interface Props {
	profileUser: User,
	admin?: boolean,
	userDeleted?: () => void,
	groupsRedirectUri?: string
}

export const UserProfile: React.FC<Props> = ({profileUser, admin = true, userDeleted, groupsRedirectUri="/groups/"}) => {

	const { addToast } = useContext(ToastContext);

	const navigate = useNavigate();

	const getGroupsUser = (searchQuery: GroupSearchQuery) => {
		passport.currentUserGetUserGroups(searchQuery)
			.then(response => {
				setGroups(response.result);
			}).catch(response => {
			addToast({
				id: uuidv4(),
				heading: "An error occurred whilst attempting to retrieve the current user groups",
				description: response.message,
				location: ToastLocation.TOP_RIGHT,
				toastType: ToasterType.ERROR,
				ttl: 5000})
		})
	}

	const getGroupsAdmin = (searchQuery: GroupSearchQuery) => {
		passport.adminGetUserGroups(user.id as string, searchQuery)
			.then(response => {
				setGroups(response.result);
			}).catch(response => {
			addToast({
				id: uuidv4(),
				heading: "An error occurred whilst attempting to retrieve the current user groups",
				description: response.message,
				location: ToastLocation.TOP_RIGHT,
				toastType: ToasterType.ERROR,
				ttl: 5000})
		})
	}

	const getCompleteGroupsAdmin = (searchQuery: GroupSearchQuery) => {
		passport.searchGroups(searchQuery)
			.then(response => {
				setPotentialGroups(response.result);
			}).catch(response => {
			addToast({
				id: uuidv4(),
				heading: "An error occurred whilst attempting to retrieve system groups",
				description: response.message,
				location: ToastLocation.TOP_RIGHT,
				toastType: ToasterType.ERROR,
				ttl: 5000})
		})
	}

	const getGroups = (searchQuery: GroupSearchQuery) => {
		if (admin) {
			getGroupsAdmin(searchQuery);
		} else {
			getGroupsUser(searchQuery);
		}
	}

	const initTelephone = (telephone: Telephone | undefined): Telephone => {
		if (telephone) {
			return telephone
		}
		return {
			code: undefined,
			country: undefined,
			extension: undefined,
			format: undefined,
			number: undefined
		}
	}

	const initAddress = (address: Address | undefined): Address => {
		if (address) {
			return address
		}
		return {
			address: undefined,
			city: undefined,
			country: undefined,
			postcode: undefined,
			state: undefined
		}
	}

	const initUserState = (user: User): string => {
		if (user.state == UserState.ACTIVE) {
			return "ACTIVE"
		} else if (user.state == UserState.DELETED) {
			return "DELETED";
		} else if (user.state == UserState.LOCKED) {
			return "LOCKED";
		}
		return "DISABLED";
	}

	const getUserState = (state: string): UserState => {
		if (state == "ACTIVE") {
			return UserState.ACTIVE
		} else if (state == "DELETED") {
			return UserState.DELETED;
		} else if (state == "LOCKED") {
			return UserState.LOCKED;
		}
		return UserState.DISABLED;
	}

	const [user, setUser] = useState(profileUser);

	const [updateEmailModal, setUpdateEmailModal] = useState(false);

	const [userUpdating, setUserUpdating] = useState(false);

	const [avatar, setAvatar] = useState(profileUser.avatar);

	const [deleteUserModal, setDeleteUserModal] = useState(false);

	const [updatePasswordModal, setUpdatePasswordModal] = useState(false);

	const [updatePasswordError, setUpdatePasswordError] = useState(false);

	const [oldPassword, setOldPassword] = useState("");

	const [password, setPassword] = useState("");

	const [password2, setPassword2] = useState("");

	const [groups, setGroups] = useState<Array<UserGroup>>([]);

	const [potentialGroups, setPotentialGroups] = useState<Array<Group>>([]);

	const [selectedGroups, setSelectedGroups] = useState<Array<Group>>([]);

	const [focusGroup, setFocusGroup] = useState<UserGroup | undefined>(undefined);

	const [editGroupModal, setEditGroupModal] = useState<boolean>(false);

	const [removeGroupLoading, setRemoveGroupLoading] = useState<boolean>(false);

	const [editGroupLoading, setEditGroupLoading] = useState<boolean>(false);

	const [addGroupModal, setAddGroupModal] = useState<boolean>(false);

	const [addGroupPermission, setAddGroupPermission] = useState<string>("READ");

	const [editGroupPermission, setEditGroupPermission] = useState<string>("READ");

	const [addGroupLoading, setAddGroupLoading] = useState<boolean>(false);

	const [name, setName] = useState(profileUser.name);

	const [username, setUsername] = useState(profileUser.username);

	const [email, setEmail] = useState(profileUser.email);

	const [phone, setPhone] = useState(initTelephone(profileUser.telephone));

	const [address, setAddress] = useState(initAddress(profileUser.address));

	const [forcePasswordReset, setForcePasswordReset] = useState(profileUser.forcePasswordReset);

	const [emailVerified, setEmailVerified] = useState(profileUser.emailVerified);

	const [phoneVerified, setPhoneVerified] = useState(profileUser.phoneVerified);

	const [addressVerified, setAddressVerified] = useState(profileUser.addressVerified);

	const [userState, setUserState] = useState(initUserState(profileUser));

	const deleteUser = () => {
		if (admin) {
			adminDeleteUser();
		} else {
			deleteCurrentUser();
		}
	}

	const adminDeleteUser = () => {
		if (user.id) {
			passport.adminDeleteUser(user.id)
				.then(response => {
					if (userDeleted) {
						userDeleted()
					}
				}).catch(response => {
				addToast({
					id: uuidv4(),
					heading: "An error occurred while deleting this user",
					description: response.message,
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		} else {
			deleteCurrentUser();
		}
	}

	const deleteCurrentUser = () => {
		if (user.id) {
			passport.deleteCurrentAccount()
				.then(response => {
					if (userDeleted) {
						userDeleted()
					}
				}).catch(response => {
				addToast({
					id: uuidv4(),
					heading: "An error occurred while deleting this user",
					description: response.message,
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		}
	}

	const updatePassword = () => {
		if (password != "" && password == password2 && admin) {
			setUpdatePasswordModal(false);
			adminPasswordUpdate();
		} else if (password != "" && password == password2 && oldPassword != "" && !admin) {
			setUpdatePasswordModal(false);
			userPasswordUpdate();
		} else {
			setUpdatePasswordError(true);
		}
	}

	const adminPasswordUpdate = () => {
		if (user.id) {
			passport.adminUpdatePassword(user.id, {
				password: password
			})
				.then(response => {
					addToast({
						id: uuidv4(),
						heading: "Password Updated",
						location: ToastLocation.TOP_RIGHT,
						toastType: ToasterType.SUCCESS,
						ttl: 5000})
				}).catch(response => {
				addToast({
					id: uuidv4(),
					heading: "An error occurred while deleting this user",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		} else {
			deleteCurrentUser();
		}
	}

	const userPasswordUpdate = () => {
		if (user.id) {
			passport.updateCurrentUserPassword({
				oldPassword: oldPassword,
				newPassword: password
			})
				.then(response => {
					addToast({
						id: uuidv4(),
						heading: "Password Updated",
						location: ToastLocation.TOP_RIGHT,
						toastType: ToasterType.SUCCESS,
						ttl: 5000})
				}).catch(response => {
				addToast({
					id: uuidv4(),
					heading: "An error occurred while deleting this user",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
		} else {
			deleteCurrentUser();
		}
	}

	useEffect(() => {
		getGroups({
			page: 0,
			query: "",
			size: 20
		})
	}, []);

	const groupClicked = (groupId: string) => {
		if (admin) {
			navigate(groupsRedirectUri + groupId);
		}
	}

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

	const convertPermissionToValueText = (permission: GroupPermission) => {
		if (permission == GroupPermission.READ) {
			return "READ"
		} else if (permission == GroupPermission.EDITOR) {
			return "EDIT"
		} else if (permission == GroupPermission.OWNER) {
			return "OWNER"
		}
		return "UNKNOWN"
	}

	const searchGroups = (searchQuery: string) => {
		getGroups({
			page: 0,
			query: searchQuery,
			size: 20
		})
	}

	const searchPotentialGroups = (searchQuery: string) => {
		getCompleteGroupsAdmin({
			page: 0,
			query: searchQuery,
			size: 20
		})
	}

	const isGroupSelected = (id: string) =>{
		for (var i=0; i < selectedGroups.length; i++) {
			if (selectedGroups[i].id == id) {
				return true;
			}
		}
		return false;
	}

	const setSelectionState = (group: Group, state: boolean) =>{
		var newSelection = []
		for (var i=0; i < selectedGroups.length; i++) {
			if (selectedGroups[i].id == group.id) {
				continue;
			}
			newSelection.push(selectedGroups[i]);
		}
		if (state) {
			newSelection.push(group);
		}
		setSelectedGroups(newSelection);
	}

	const clearSelectedGroups = () => {
		setSelectedGroups([]);
	}

	const addUserToGroup = () => {
		if (selectedGroups.length > 0) {
			var addGroups: Array<AddGroup> = [];
			var permission: GroupPermission = GroupPermission.READ;
			if (addGroupPermission == "OWNER") {
				permission = GroupPermission.OWNER;
			} else if (addGroupPermission == "EDIT") {
				permission = GroupPermission.READ;
			}
			for (var i=0; i < selectedGroups.length; i++) {
				addGroups.push({
					id: selectedGroups[i].id,
					permission: permission
				})
			}
			setAddGroupLoading(true);
			passport.adminAddGroupsToUser({
				groups: addGroups,
				memberId: user.id as string
			}).then((result) => {
				setAddGroupLoading(false);
				getGroups({
					page: 0,
					query: "",
					size: 20
				})
				setAddGroupModal(false);
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

	const updateCurrentUser = (silent=false, updatedAvatar: AvatarObj | undefined =undefined) => {
		var updateUser: User = {
			id: user.id,
			name: name,
			username: username,
			email: user.email,
			color: user.color,
			avatar: updatedAvatar ?? avatar,
			telephone: phone,
			address: address,
			lastActive: user.lastActive,
			created: user.created,
			state: user.state,
			forcePasswordReset: user.forcePasswordReset,
			domain: user.domain,
			notes: user.notes,
			serviceUser: user.serviceUser,
			defaultUser: user.defaultUser,
			emailVerified: user.emailVerified,
			phoneVerified: user.phoneVerified,
			addressVerified: user.addressVerified
		}
		setUserUpdating(true);
		passport.saveCurrentUser(updateUser)
			.then(updatedUser => {
				setUserUpdating(false);
				setUser(updatedUser);
				setName(updatedUser.name);
				setUsername(updatedUser.username);
				setEmail(updatedUser.email);
				setPhone(initTelephone(updatedUser.telephone));
				setAddress(initAddress(updatedUser.address));
				if (!silent) {
					addToast({
						id: uuidv4(),
						heading: "User Updated",
						description: "",
						location: ToastLocation.TOP_RIGHT,
						toastType: ToasterType.SUCCESS,
						ttl: 5000})
				}
			}).catch(response => {
				setUserUpdating(false);
				setName(user.name);
				setUsername(user.username);
				setEmail(user.email);
				setPhone(initTelephone(user.telephone));
				setAddress(initAddress(user.address));
				addToast({
					id: uuidv4(),
					heading: "An error occurred updating the user",
					description: "",
					location: ToastLocation.TOP_RIGHT,
					toastType: ToasterType.ERROR,
					ttl: 5000})
			})
	}

	const updateUserAdmin = (silent=false) => {
		var updateUser: User = {
			id: user.id,
			name: name,
			username: username,
			email: email,
			color: user.color,
			avatar: user.avatar,
			telephone: phone,
			address: address,
			lastActive: user.lastActive,
			created: user.created,
			state: getUserState(userState),
			forcePasswordReset: forcePasswordReset,
			domain: user.domain,
			notes: user.notes,
			serviceUser: user.serviceUser,
			defaultUser: user.defaultUser,
			emailVerified: emailVerified,
			phoneVerified: phoneVerified,
			addressVerified: addressVerified
		}
		setUserUpdating(true);
		passport.save(updateUser)
			.then(updatedUser => {
				setUserUpdating(false);
				setUser(updatedUser);
				setName(updatedUser.name);
				setUsername(updatedUser.username);
				setEmail(updatedUser.email);
				setPhone(initTelephone(updatedUser.telephone));
				setAddress(initAddress(updatedUser.address));
				setUserState(initUserState(updatedUser));
				setForcePasswordReset(updatedUser.forcePasswordReset);
				setEmailVerified(updatedUser.emailVerified);
				setPhoneVerified(updatedUser.phoneVerified);
				setAddressVerified(updatedUser.addressVerified);
				if (!silent) {
					addToast({
						id: uuidv4(),
						heading: "User Updated",
						description: "",
						location: ToastLocation.TOP_RIGHT,
						toastType: ToasterType.SUCCESS,
						ttl: 5000})
				}
			}).catch(response => {
			setUserUpdating(false);
			setName(user.name);
			setUsername(user.username);
			setEmail(user.email);
			setPhone(initTelephone(user.telephone));
			setAddress(initAddress(user.address));
			setUserState(initUserState(user));
			setForcePasswordReset(user.forcePasswordReset);
			setEmailVerified(user.emailVerified);
			setPhoneVerified(user.phoneVerified);
			setAddressVerified(user.addressVerified);
			addToast({
				id: uuidv4(),
				heading: "An error occurred updating the user",
				description: "",
				location: ToastLocation.TOP_RIGHT,
				toastType: ToasterType.ERROR,
				ttl: 5000})
		})
	}

	const updateUser = (silent=false, updatedAvatar: AvatarObj | undefined =undefined) => {
		if (admin) {
			updateUserAdmin(silent);
		} else {
			updateCurrentUser(silent, updatedAvatar);
		}
	}

	const removeGroupFromUser = () => {
		if (admin) {
			setRemoveGroupLoading(true);
			passport.adminRemoveGroupsFromUser({
				groups: [
					{
						id: focusGroup?.groupId as string,
						permission: focusGroup?.permission as GroupPermission
					}
				],
				memberId: user.id as string})
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
					getGroups({
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
		if (admin) {
			setEditGroupLoading(true);
			var permission: GroupPermission = GroupPermission.READ;
			if (editGroupPermission == "OWNER") {
				permission = GroupPermission.OWNER;
			} else if (editGroupPermission == "EDIT") {
				permission = GroupPermission.EDITOR;
			}
			passport.updateUserGroupPermission({
				permission: permission,
				groupId: focusGroup?.groupId as string,
				userId: user.id as string})
				.then(result => {
					setEditGroupLoading(false);
					setEditGroupModal(false);
					addToast({
						id: uuidv4(),
						heading: "Group Updated",
						description: "",
						location: ToastLocation.TOP_RIGHT,
						toastType: ToasterType.SUCCESS,
						ttl: 5000})
					getGroups({
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

	return (
		<>
			<PaddedPage>
				<div className="passport-user-profile-page-heading">
					<h1 style={{marginRight: "10px"}}>User Profile</h1>
					{user.domain != "root" && user.domain != "internal" && user.domain != "management" &&
						<Badge style={{backgroundColor: "#f7f8f9", border: "1px solid #bdbdbd", color: "#6c6c6c"}}>Externally
							Managed</Badge>
					}
				</div>
				<div className="passport-user-profile-top-section">
					<div className="passport-user-profile-top-section-avatar-cont">
						<Avatar user={user}
								onChange={(avatar: AvatarObj) => {updateUser(true, avatar)}}
								edit={!admin && (user.domain == "root" || user.domain == "internal" || user.domain != "management")}
								height={140} width={140}></Avatar>
					</div>
					<div className="passport-user-profile-top-section-name-username">
						<InputForm>
							<Input label={"Name"} placeholder={"Full Name"} value={name} onChange={(value) => {setName(value)}}></Input>
							<Input label={"Username"} placeholder={"Username"} value={username} onChange={(value) => {setUsername(value)}}></Input>
						</InputForm>
					</div>
				</div>
				<InputForm>
					{admin && <Metric label={"Created"} text={new Date(user.created).toLocaleString()}></Metric>}
					{admin && <Metric label={"Last Active"} text={new Date(user.lastActive).toLocaleString()}></Metric>}
					{!admin && <MetricWithAction text={user.email}
												 label={"Email"} icon={"ri-pencil-fill"}
												 onClick={() => setUpdateEmailModal(true)}
												 valueStyle={{backgroundColor: "#f7f8f9"}}></MetricWithAction>}
					{admin && <Input label={"Email"} placeholder={"Email@gmail.com"} isEmail={true} value={email} onChange={(value) => {setEmail(value)}}></Input>}
					<PhoneInput label={"Telephone"} telephone={phone} onChange={setPhone}></PhoneInput>
					<AddressInput label={"Address"} address={address} onChange={setAddress}></AddressInput>
				</InputForm>
				<hr className="passport-user-profile-seperator"></hr>
				<div className="passport-user-groups-search-header">
					<div className="passport-user-groups-search-cont">
						<SearchInput onSearchEvent={searchGroups}></SearchInput>
					</div>
					{admin &&
						<div className="passport-user-groups-search-controls">
							<ButtonIcon icon={"ri-add-line"} label={"Add Group"} onClick={() => {
								setAddGroupModal(true);
								searchPotentialGroups("");
								setSelectedGroups([]);
								setAddGroupPermission("READ")
							}}></ButtonIcon>
						</div>
					}
				</div>
				<div className="passport-user-groups-search-table">
					<Table>
						<THead>
							<Row hoverEffect={false}>
								<Cell style={{
									backgroundColor: "#f7f8f9",
									fontWeight: "600",
									border: "none",
									borderBottom: "1px solid #e0e1e2",
									borderLeft: "none",
									borderTop: "none"}}>Group Name</Cell>
								<Cell style={{backgroundColor: "#f7f8f9", fontWeight: "600", border: "none", borderBottom: "1px solid #e0e1e2", borderTop: "none"}}>Permission</Cell>
								<Cell style={{backgroundColor: "#f7f8f9", fontWeight: "600", border: "none", borderBottom: "1px solid #e0e1e2", borderTop: "none"}}>Inherited</Cell>
								{admin && <Cell alignment={CellAlignment.CENTER} style={{backgroundColor: "#f7f8f9", fontWeight: "600", border: "none", borderBottom: "1px solid #e0e1e2", borderTop: "none", borderLeft: "none"}}>Edit</Cell>}
							</Row>
						</THead>
						<TBody>
							{groups.map((item, index) => (
								<Row key={item.groupId} hoverEffect={false}>
									<Cell style={{border: "none", borderLeft: "none", borderBottom: index == (groups.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "none"}} onClick={() => groupClicked(item.groupId)}>
										<div className="passport-user-groups-primary-cell">
											<div className="passport-user-groups-primary-cell-main">
												{item.groupName}
												{item.externallyManaged && <span className="passport-user-groups-primary-cell-externally-managed">External</span>}
											</div>
											<div className="passport-user-groups-primary-cell-secondary">{item.groupId}</div>
										</div>
									</Cell>
									<Cell style={{border: "none", borderBottom: index == (groups.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
										{item.permission == GroupPermission.OWNER && <Badge style={{width: "fit-content", backgroundColor: "#1b4f72"}}>{convertPermissionToText(item.permission)}</Badge>}
										{item.permission == GroupPermission.EDITOR && <Badge style={{width: "fit-content", backgroundColor: "#145a32"}}>{convertPermissionToText(item.permission)}</Badge>}
										{item.permission == GroupPermission.READ && <Badge style={{width: "fit-content", backgroundColor: "#626567"}}>{convertPermissionToText(item.permission)}</Badge>}
									</Cell>
									<Cell alignment={CellAlignment.CENTER} style={{border: "none", borderBottom: index == (groups.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
										<div>
											<Badge style={{width: "fit-content", alignItems: "center", justifyContent: "center"}}>{item.inherited ? "Inherited" : "Direct"}</Badge>
										</div>
									</Cell>
									{admin &&
										<Cell alignment={CellAlignment.CENTER} style={{border: "none", borderBottom: index == (groups.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
											<div className="passport-user-profile-group-edit-btn">
												<ButtonIcon icon={"ri-pencil-line"} onClick={() => {
													setEditGroupPermission(convertPermissionToValueText(item.permission));
													setEditGroupModal(true);
													setFocusGroup(item);
												}}></ButtonIcon>
											</div>
										</Cell>
									}
								</Row>
							))}
						</TBody>
					</Table>
				</div>
				<hr className="passport-user-profile-seperator"></hr>
				{admin &&
					<>
						<InputForm>
							<Metric text={user.domain} label={"Domain"}></Metric>
							<Dropdown label={"State"} onSelection={item => setUserState(item.reference)}>
								<DropdownItemText label={"Active"} value={"ACTIVE"}
												  selected={userState == "ACTIVE"}></DropdownItemText>
								<DropdownItemText label={"Locked"} value={"LOCKED"}
												  selected={userState == "LOCKED"}></DropdownItemText>
								<DropdownItemText label={"Disabled"} value={"DISABLED"}
												  selected={userState == "DISABLED"}></DropdownItemText>
								<DropdownItemText label={"Deleted"} value={"DELETED"}
												  selected={userState == "DELETED"}></DropdownItemText>
							</Dropdown>
							<div className="passport-user-profile-toggle-group">
								<div className="blue-orange-default-input-label-cont" style={{marginBottom: "0"}}>Force
									Password
									Reset
								</div>
								<Toggle checked={forcePasswordReset} onChange={setForcePasswordReset}></Toggle>
							</div>
							<div className="passport-user-profile-toggle-group">
								<div className="blue-orange-default-input-label-cont" style={{marginBottom: "0"}}>
									Email Verified
								</div>
								<Toggle checked={emailVerified} onChange={setEmailVerified}></Toggle>
							</div>
							<div className="passport-user-profile-toggle-group">
								<div className="blue-orange-default-input-label-cont" style={{marginBottom: "0"}}>
									Phone Verified
								</div>
								<Toggle checked={phoneVerified} onChange={setPhoneVerified}></Toggle>
							</div>
							<div className="passport-user-profile-toggle-group">
								<div className="blue-orange-default-input-label-cont" style={{marginBottom: "0"}}>
									Address Verified
								</div>
								<Toggle checked={addressVerified} onChange={setAddressVerified}></Toggle>
							</div>
						</InputForm>
					</>
				}
				{(user.domain == "root" || user.domain == "internal" || user.domain == "management") &&
					<>
						<InputForm>
							<div className="passport-user-profile-toggle-group">
								<div className="blue-orange-default-input-label-cont" style={{marginBottom: "0"}}>
									Update Password
								</div>
								<ButtonIcon
									icon={"ri-key-line"}
									onClick={() => setUpdatePasswordModal(true)}
								></ButtonIcon>
							</div>
							<div className="passport-user-profile-toggle-group">
								<div className="blue-orange-default-input-label-cont" style={{marginBottom: "0"}}>
									Delete Account
								</div>
								<ButtonIcon
									icon={"ri-delete-bin-7-fill"}
									style={{color: "white", backgroundColor: "#e11d48"}}
									onClick={() => setDeleteUserModal(true)}
								></ButtonIcon>
							</div>
						</InputForm>
						<hr className="passport-user-profile-seperator"></hr>
						<div className="passport-user-profile-button-group">
							<Button text={"Save"} buttonType={ButtonType.PRIMARY} style={{width: "100px"}} isLoading={userUpdating} onClick={updateUser}></Button>
						</div>
					</>
				}
			</PaddedPage>
			{deleteUserModal &&
				<Modal minWidth={400} width={400} onClose={() => setDeleteUserModal(false)}>
					<ModalHeader label={"Delete User"} onClose={() => setDeleteUserModal(false)}></ModalHeader>
					<ModalBody>
						<p>Are you sure you want to delete this account? Once deleted all linked data will no longer be recoverable.</p>
					</ModalBody>
					<ModalFooter>
						<ModalFooterLeft>
							<Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={() => setDeleteUserModal(false)}></Button>
						</ModalFooterLeft>
						<ModalFooterRight>
							<Button text={"Delete Account"} buttonType={ButtonType.DANGER} onClick={() => {
								setDeleteUserModal(false);
								deleteUser();
							}}></Button>
						</ModalFooterRight>
					</ModalFooter>
				</Modal>
			}
			{updatePasswordModal &&
				<Modal minWidth={600} width={600} onClose={() => {setUpdatePasswordModal(false); setUpdatePasswordError(false)}}>
					<ModalHeader label={"Update Password"} onClose={() => {setUpdatePasswordModal(false); setUpdatePasswordError(false)}}></ModalHeader>
					<ModalBody>
						<InputForm paddingBottom={40}>
							{!admin && <Input label={"Old Password"} isPassword={true} onChange={setOldPassword}></Input>}
							<Input label={"New Password"} isPassword={!admin} onChange={setPassword}></Input>
							<Input label={"Re-enter New Password"} isPassword={!admin} onChange={setPassword2}></Input>
							{updatePasswordError && !admin && <ErrorBlockAlert title={"Error resetting password"} description={"Please make sure that your old password is not empty and that your new password is the same across both inputs."}></ErrorBlockAlert>}
							{updatePasswordError && admin && <ErrorBlockAlert title={"Error resetting password"} description={"Please make sure that your new password is the same across both inputs."}></ErrorBlockAlert>}
						</InputForm>
					</ModalBody>
					<ModalFooter>
						<ModalFooterLeft>
							<Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={() => {setUpdatePasswordModal(false); setUpdatePasswordError(false)}}></Button>
						</ModalFooterLeft>
						<ModalFooterRight>
							<Button text={"Update"} buttonType={ButtonType.PRIMARY} onClick={updatePassword}></Button>
						</ModalFooterRight>
					</ModalFooter>
				</Modal>
			}
			{addGroupModal &&
				<Modal minWidth={600} width={600} onClose={() => setAddGroupModal(false)}>
					<ModalHeader label={"Add Group"} onClose={() => setAddGroupModal(false)}></ModalHeader>
					<ModalBody>
						<InputForm paddingBottom={40}>
							<Dropdown label={"Permission"} onSelection={(item) => setAddGroupPermission(item.reference)}>
								<DropdownItemIcon src={"ri-shield-star-fill"} label={"Owner"} value={"OWNER"} selected={addGroupPermission == "OWNER"}></DropdownItemIcon>
								<DropdownItemIcon src={"ri-pencil-fill"} label={"Edit"} value={"EDIT"} selected={addGroupPermission == "EDIT"}></DropdownItemIcon>
								<DropdownItemIcon src={"ri-eye-fill"} label={"Read"} value={"READ"} selected={addGroupPermission == "READ"}></DropdownItemIcon>
							</Dropdown>
							<div className="passport-user-profile-add-group-table-search-cont">
								<div className="passport-user-profile-add-group-table-search-input">
									<SearchInput label={"Search Groups"} onSearchEvent={searchPotentialGroups}></SearchInput>
								</div>
								<div className="passport-user-profile-add-group-table-search-clear-btn">
									<ButtonIcon icon="ri-forbid-line" label="Clear selected groups" onClick={clearSelectedGroups}></ButtonIcon>
								</div>
							</div>
							<div className="passport-user-profile-add-group-table">
								<Table>
									<THead>
										<Row hoverEffect={false}>
											<Cell style={{backgroundColor: "#f7f8f9", fontWeight: "600", border: "none", borderBottom: "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}><div></div></Cell>
											<Cell style={{backgroundColor: "#f7f8f9", fontWeight: "600", border: "none", borderBottom: "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>Group Name</Cell>
										</Row>
									</THead>
									<TBody>
										{potentialGroups.map((item, index) => (
											<Row key={item.id} hoverEffect={false}>
												<CheckboxCell
													state={isGroupSelected(item.id as string)}
													style={{borderBottom: "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2", borderLeft: "none", borderRight: "none"}}
													onClick={(state) => setSelectionState(item, state)}
												></CheckboxCell>
												<Cell style={{border: "none", borderBottom: "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
													<div className="passport-user-groups-primary-cell">
														<div className="passport-user-groups-primary-cell-main">
															{item.name}
															{item.externallyManaged && <span className="passport-user-groups-primary-cell-externally-managed">External</span>}
														</div>
														<div className="passport-user-groups-primary-cell-secondary">{item.id}</div>
													</div>
												</Cell>
											</Row>
										))}
									</TBody>
								</Table>
							</div>
							{selectedGroups.length > 1 && <div className="passport-user-groups-search-table-info">{selectedGroups.length} groups selected</div>}
							{selectedGroups.length == 1 && <div className="passport-user-groups-search-table-info">{selectedGroups.length} group selected</div>}
						</InputForm>
					</ModalBody>
					<ModalFooter>
						<ModalFooterLeft>
							<Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={() => setAddGroupModal(false)}></Button>
						</ModalFooterLeft>
						<ModalFooterRight>
							<Button text={"Update"} buttonType={ButtonType.PRIMARY} onClick={addUserToGroup} isLoading={addGroupLoading}></Button>
						</ModalFooterRight>
					</ModalFooter>
				</Modal>
			}
			{updateEmailModal &&
				<Modal minWidth={600} width={600} onClose={() => setUpdateEmailModal(false)}>
					<ModalHeader label={"Update Email"} onClose={() => setUpdateEmailModal(false)}></ModalHeader>
					<ModalBody>
						<div className="passport-user-profile-update-email-user-text">Please contact your system administrator to update your email.</div>
					</ModalBody>
					<ModalFooter>
						<ModalFooterRight>
							<Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={() => setUpdateEmailModal(false)}></Button>
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
							<Button text={"Remove"} buttonType={ButtonType.SECONDARY} onClick={removeGroupFromUser} isLoading={removeGroupLoading}></Button>
						</ModalFooterLeft>
						<ModalFooterRight>
							<Button text={"Update"} buttonType={ButtonType.PRIMARY} onClick={editGroup} isLoading={editGroupLoading}></Button>
						</ModalFooterRight>
					</ModalFooter>
				</Modal>
			}
		</>

	)
}