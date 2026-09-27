import React, {useContext, useEffect, useState} from "react";
import {
	Badge,
	Button,
	ButtonIcon,
	ButtonType,
	Cell,
	CellAlignment,
	CheckboxCell, ErrorBlockAlert,
	Input,
	InputForm,
	Modal,
	ModalBody, ModalFooter,
	ModalFooterLeft, ModalFooterRight,
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

import './GroupSearch.css'
import {v4 as uuidv4} from "uuid";
import {Group} from "@blue-orange-ai/foundations-clients";
import {useNavigate} from "react-router-dom";

interface Props {
	groupRedirectUri?: string
}

export const GroupSearch: React.FC<Props> = ({groupRedirectUri="/groups/"}) => {

	const { addToast } = useContext(ToastContext);

	const navigate = useNavigate();

	const [group, setGroup] = useState<Group | undefined>(undefined);

	const [groups, setGroups] = useState<Array<Group>>([]);

	const [newGroupName, setNewGroupName] = useState<string>("");

	const [addGroupModal, setAddGroupModal] = useState<boolean>(false);

	const [addGroupLoading, setAddGroupLoading] = useState<boolean>(false);

	const [addGroupErrorMsg, setAddGroupErrorMsg] = useState<string>("");

	const [addGroupError, setAddGroupError] = useState<boolean>(false);

	const getGroups = (query: string) => {
		passport.searchGroups({
			page: 0,
			query: query,
			size: 100
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

	const searchGroups = (searchQuery: string) => {
		getGroups(searchQuery);
	}

	const groupClicked = (group: Group) => {
		navigate(groupRedirectUri + group.id)
	}

	const createGroup = () => {
		if (newGroupName != "") {
			const newGroupNameLowerCase = newGroupName.toLowerCase();
			setAddGroupLoading(true);
			passport.createGroup({
				description: "",
				excludedUsers: [],
				externallyManaged: false,
				name: newGroupNameLowerCase,
				service: "user-generated",
				serviceAccount: false
			}).then(result => {
				setAddGroupLoading(false);
				setAddGroupModal(false);
				navigate(groupRedirectUri + result.id);
			}).catch(response => {
				setAddGroupLoading(false);
				setAddGroupError(true);
				setAddGroupErrorMsg(response.message);
			})
		}

	}

	useEffect(() => {
		getGroups("");
	}, []);


	return (
		<>
			<PaddedPage>
				<div className="passport-group-search-main-heading">
					<div className="passport-group-search-main-heading-txt">
						<PageHeading>System Groups</PageHeading>
					</div>
					<div className="passport-group-search-main-heading-btns">
						<ButtonIcon icon={"ri-add-line"} label={"Create Group"} onClick={() => {
							setNewGroupName("");
							setAddGroupModal(true)}
						}></ButtonIcon>
					</div>
				</div>
				<div>
					<div className="passport-group-search-header">
						<div className="passport-group-search-cont">
							<SearchInput onSearchEvent={searchGroups}></SearchInput>
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
									}}>Group</Cell>
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
								</Row>
							</THead>
							<TBody>
								{groups.map((item, index) => (
									<Row key={item.id + "-" + index} hoverEffect={false} onClick={() => groupClicked(item)}>
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
										<Cell
											alignment={CellAlignment.CENTER}
											style={{border: "none", borderBottom: index == (groups.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
											<div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
												{item.externallyManaged && <Badge>External</Badge>}
												{!item.externallyManaged && <Badge style={{backgroundColor: "#ba4a00"}}>Internal</Badge>}
											</div>

										</Cell>
									</Row>
								))}
							</TBody>
						</Table>
					</div>
				</div>
			</PaddedPage>
			{addGroupModal &&
				<Modal onClose={() => setAddGroupModal(false)}>
					<ModalHeader label={"Add Member"} onClose={() => setAddGroupModal(false)}></ModalHeader>
					<ModalBody>
						<InputForm paddingBottom={50}>
							<Input label={"Group Name"} value={newGroupName} onChange={setNewGroupName}></Input>
							{addGroupError && <ErrorBlockAlert title="An error occurred creating your group" description={addGroupErrorMsg}></ErrorBlockAlert>}
						</InputForm>
					</ModalBody>
					<ModalFooter>
						<ModalFooterLeft>
							<Button text={"Cancel"} buttonType={ButtonType.SECONDARY}
									onClick={() => setAddGroupModal(false)}></Button>
						</ModalFooterLeft>
						<ModalFooterRight>
							<Button text={"Create"} buttonType={ButtonType.PRIMARY} onClick={createGroup}
									isLoading={addGroupLoading}></Button>
						</ModalFooterRight>
					</ModalFooter>
				</Modal>
			}
		</>
	)
}