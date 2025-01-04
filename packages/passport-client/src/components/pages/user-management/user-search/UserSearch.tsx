import React, {useContext, useEffect, useState} from "react";
import {
	AddressInput,
	AvatarEmpty,
	Badge,
	Button,
	ButtonIcon,
	ButtonType,
	Cell,
	CellAlignment,
	Checkbox,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerFooterLeft, DrawerFooterRight,
	DrawerHeader,
	DrawerPosition,
	Input,
	InputForm,
	ModalFooterRight,
	PaddedPage,
	PageHeading,
	PhoneInput,
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

import './UserSearch.css'
import {v4 as uuidv4} from "uuid";
import {Address, Group, Telephone, User, UserState} from "@blue-orange-ai/foundations-clients";
import {useNavigate} from "react-router-dom";

interface Props {
	userRedirectUri?: string
}

export const UserSearch: React.FC<Props> = ({userRedirectUri="/users/"}) => {

	const { addToast } = useContext(ToastContext);

	const navigate = useNavigate();

	const defaultErrorInputStyle: React.CSSProperties = {
		border: "1.5px solid #b03a2e",
		backgroundColor: "#fadbd8",
		color: "#b03a2e"
	}

	const [group, setGroup] = useState<Group | undefined>(undefined);

	const [users, setUsers] = useState<Array<User>>([]);

	const [newGroupName, setNewGroupName] = useState<string>("");

	const [createUserModal, setCreateUserModal] = useState<boolean>(false);

	const [addGroupLoading, setAddGroupLoading] = useState<boolean>(false);

	const [addGroupErrorMsg, setAddGroupErrorMsg] = useState<string>("");

	const [addGroupError, setAddGroupError] = useState<boolean>(false);

	const [email, setEmail] = useState("");

	const [emailStyle, setEmailStyle] = useState<React.CSSProperties>({});

	const [fullName, setFullName] = useState("");

	const [fullNameStyle, setFullNameStyle] = useState<React.CSSProperties>({});

	const [password, setPassword] = useState("");

	const [passwordStyle, setPasswordStyle] = useState<React.CSSProperties>({});

	const [password2, setPassword2] = useState("");

	const [password2Style, setPassword2Style] = useState<React.CSSProperties>({});

	const [username, setUsername] = useState("");

	const [telephone, setTelephone] = useState<Telephone | undefined>(undefined);

	const [telephoneStyle, setTelephoneStyle] = useState<React.CSSProperties>({});

	const [address, setAddress] = useState<Address | undefined>(undefined);

	const [addressStyle, setAddressStyle] = useState<React.CSSProperties>({});

	const [error, setError] = useState(false);

	const [forcePasswordReset, setForcePasswordReset] = useState(false);

	const [errorDescription, setErrorDescription] = useState("");

	const [createUserLoading, setCreateUserLoading] = useState(false);

	const validateSubmission = (): boolean => {
		var error = false;
		var errorMessage = ""
		if (email == "") {
			error = true;
			errorMessage = errorMessage == "" ? "You must provide a valid email." : errorMessage + "\nYou must provide a valid email.";
			setEmailStyle(defaultErrorInputStyle);
		}
		if (password != password2 || password .length < 8) {
			error = true;
			errorMessage = errorMessage == "" ? "Your passwords do not match or your password is not greater than 8 characters." : errorMessage + "\nYour passwords do not match or your password is not greater than 8 characters.";
			setPasswordStyle(defaultErrorInputStyle)
			setPassword2Style(defaultErrorInputStyle)
		}
		setError(error)
		setErrorDescription(errorMessage);
		return !error;
	}

	const getUsers = (query: string) => {
		passport.searchUsers({
			page: 0,
			query: query,
			size: 100
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

	const userClicked = (user: User) => {
		navigate(userRedirectUri + user.id)
	}

	const createUser = () => {
		if (validateSubmission()) {
			const newGroupNameLowerCase = newGroupName.toLowerCase();
			setAddGroupLoading(true);
			passport.create({
				name: fullName,
				username: username,
				email: email,
				password: password,
				color: "",
				avatar: undefined,
				telephone: telephone,
				address: address,
				forcePasswordReset: forcePasswordReset,
				domain: "internal",
				serviceUser: false
			}).then(result => {
				setCreateUserLoading(false);
				setCreateUserModal(false);
				navigate(userRedirectUri + result.id);
			}).catch(response => {
				setAddGroupLoading(false);
				setAddGroupError(true);
				setAddGroupErrorMsg(response.message);
			})
		}

	}

	useEffect(() => {
		getUsers("");
	}, []);


	return (
		<>
			<PaddedPage>
				<div className="passport-group-search-main-heading">
					<div className="passport-group-search-main-heading-txt">
						<PageHeading>System Users</PageHeading>
					</div>
					<div className="passport-group-search-main-heading-btns">
						<ButtonIcon icon={"ri-add-line"} label={"Create Group"} onClick={() => {
							setCreateUserModal(true)}
						}></ButtonIcon>
					</div>
				</div>
				<div>
					<div className="passport-group-search-header">
						<div className="passport-group-search-cont">
							<SearchInput onSearchEvent={getUsers}></SearchInput>
						</div>
					</div>
					<div className="passport-groups-search-table">
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
									}}>User</Cell>
									<Cell
										alignment={CellAlignment.CENTER}
										style={{
										backgroundColor: "#f7f8f9",
										fontWeight: "600",
										border: "none",
										borderBottom: "1px solid #e0e1e2",
										borderLeft: "none",
										borderTop: "none"
									}}>Domain</Cell>
									<Cell
										alignment={CellAlignment.CENTER}
										style={{
											backgroundColor: "#f7f8f9",
											fontWeight: "600",
											border: "none",
											borderBottom: "1px solid #e0e1e2",
											borderLeft: "none",
											borderTop: "none"
										}}>Created</Cell>
									<Cell
										alignment={CellAlignment.CENTER}
										style={{
											backgroundColor: "#f7f8f9",
											fontWeight: "600",
											border: "none",
											borderBottom: "1px solid #e0e1e2",
											borderLeft: "none",
											borderTop: "none"
										}}>Management</Cell>
									<Cell
										alignment={CellAlignment.CENTER}
										style={{
											backgroundColor: "#f7f8f9",
											fontWeight: "600",
											border: "none",
											borderBottom: "1px solid #e0e1e2",
											borderLeft: "none",
											borderTop: "none"
										}}>State</Cell>

								</Row>
							</THead>
							<TBody>
								{users.map((item, index) => (
									<Row key={item.id + "-" + index} hoverEffect={false} onClick={() => userClicked(item)}>
										<Cell style={{
											border: "none",
											borderLeft: "none",
											borderBottom: index == (users.length - 1) ? "none" : "1px solid #e0e1e2",
											borderTop: "none"
										}}>
											<div className="passport-user-search-primary-cell">
												<div
													className="passport-user-search-primary-cell-main">
													{item.email == "" ? "No Email Registered" : item.email}
												</div>
												<div className="passport-user-search-primary-cell-secondary">
													{new Date(item.lastActive).toLocaleString()}
													{item.username == "" ? "" : " | " + item.username}
													{item.name == "" ? "" : " | " + item.name}
												</div>
											</div>
										</Cell>
										<Cell
											alignment={CellAlignment.CENTER}
											style={{border: "none", borderBottom: index == (users.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
											{item.domain}
										</Cell>
										<Cell
											alignment={CellAlignment.CENTER}
											style={{border: "none", borderBottom: index == (users.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
											{new Date(item.created).toLocaleString()}
										</Cell>
										<Cell
											alignment={CellAlignment.CENTER}
											style={{border: "none", borderBottom: index == (users.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
											<div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
												{item.domain.toLowerCase() !== "root" && item.domain.toLowerCase() !== "internal" && item.domain.toLowerCase() !== "management" && <Badge>External</Badge>}
												{(item.domain.toLowerCase() == "root" || item.domain.toLowerCase() == "internal" || item.domain.toLowerCase() !== "management") && <Badge style={{backgroundColor: "#ba4a00"}}>Internal</Badge>}
											</div>
										</Cell>
										<Cell
											alignment={CellAlignment.CENTER}
											style={{border: "none", borderBottom: index == (users.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
											<div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
												{item.state == UserState.ACTIVE && <Badge style={{backgroundColor: "#154360"}}>Active</Badge>}
												{item.state.toString() == UserState.LOCKED && <Badge>Locked</Badge>}
												{item.state.toString() == UserState.DELETED && <Badge>Deleted</Badge>}
												{item.state.toString() == UserState.DISABLED && <Badge>Disabled</Badge>}
											</div>
										</Cell>
									</Row>
								))}
							</TBody>
						</Table>
					</div>
				</div>
			</PaddedPage>
			{createUserModal &&
				<Drawer height={"90vh"} position={DrawerPosition.BOTTOM} onClose={() => setCreateUserModal(false)}>
					<DrawerHeader label={"Add Member"} onClose={() => setCreateUserModal(false)}></DrawerHeader>
					<DrawerBody>
						<InputForm paddingBottom={20} verticalMargin={15}>
							<div className="passport-register-avatar-cont">
								<div className="passport-register-page-empty-avatar">
									<AvatarEmpty height={80}></AvatarEmpty>
								</div>
							</div>
							<div className="passport-register-main-headings">
								<h2 className="passport-register-main-heading">Create New User</h2>
							</div>
							<Input label={"Name"} placeholder={"Full Name"} onChange={setFullName}></Input>
							<Input label={"Username"} preventSpaces={true} placeholder={"Username"}
								   onChange={setUsername}></Input>
							<Input label={"Email"} required={true} isEmail={true} placeholder={"Email"}
								   style={emailStyle} onChange={setEmail}></Input>
							<PhoneInput label={"Telephone"} onChange={setTelephone}></PhoneInput>
							<AddressInput label={"Address"} onChange={setAddress}></AddressInput>
							<Input label={"Password"} required={true} isPassword={true} style={passwordStyle}
								   placeholder={"Password"} onChange={setPassword}></Input>
							<Input label={"Re-Enter Password"} required={true} isPassword={true} style={password2Style}
								   placeholder={"Re Enter Password"} onChange={setPassword2}></Input>
							<div className="passport-registration-page-checkbox-group">
								<Checkbox checked={forcePasswordReset}
										  onCheckboxChange={(s) => setForcePasswordReset(s)}></Checkbox>
								<p className="passport-registration-terms-of-service-text">Force Password Reset</p>
							</div>
						</InputForm>
					</DrawerBody>
					<DrawerFooter>
						<DrawerFooterLeft>
							<Button text={"Cancel"} buttonType={ButtonType.SECONDARY}
									onClick={() => setCreateUserModal(false)}></Button>
						</DrawerFooterLeft>
						<DrawerFooterRight>
							<Button text={"Create"} buttonType={ButtonType.PRIMARY} onClick={createUser}
									isLoading={createUserLoading}></Button>
						</DrawerFooterRight>
					</DrawerFooter>
				</Drawer>
			}
		</>
	)
}