import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {
    Badge,
    Button,
    ButtonIcon,
    ButtonType,
    Cell,
    CellAlignment,
    CheckboxCell, CopyInput, DateDisplay, DateInput, Description, ErrorBlockAlert,
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

import '../group-management/group-search/GroupSearch.css'
import {v4 as uuidv4} from "uuid";
import {BearerToken, BearerTokenCreationRequest, Group} from "@blue-orange-ai/foundations-clients";

interface Props {
	groupRedirectUri?: string
}

export const BearerTokenManagement: React.FC<Props> = ({groupRedirectUri="/groups/"}) => {

	const { addToast } = useContext(ToastContext);

    const [tokens, setTokens] = useState<BearerToken[]>([])

    const [createTokenModal, setCreateTokenModal] = useState(false);

    const [tempTokenStore, setTempTokenStore] = useState<string>("")

    const [tokenCreatedModal, setTokenCreatedModal] = useState(false);

    const [createTokenLoading, setCreateTokenLoading] = useState(false);

    const initialisedRef = useRef(false);

    const getTokens = useCallback(async () => {
        const tokens = await passport.getBearerTokens();
        setTokens(tokens);
    }, [])

    const getEmptyTokenRequest = (): BearerTokenCreationRequest => {
        return {
            name: "",
            expiration: new Date()
        }
    }

    const [createTokenRequest, setCreateTokenRequest] = useState<BearerTokenCreationRequest>(getEmptyTokenRequest())

    const updateTitle = (title: string) => {
        setCreateTokenRequest({...createTokenRequest, name: title})
    }

    const updateExpiry = (expiry: Date) => {
        setCreateTokenRequest({...createTokenRequest, expiration: expiry})
    }

    const deleteToken = useCallback(async (tokenId: string | undefined) => {
        if (tokenId) {
            await passport.revokeBearerToken(tokenId);
            await getTokens();
        }
    }, [])

    const saveBearerTokenRequest = useCallback(async (createRequest: BearerTokenCreationRequest) => {
        setCreateTokenLoading(true);
        const token = await passport.createBearerToken(createRequest);
        setTempTokenStore(token);
        await getTokens();
        setCreateTokenLoading(false);
        setCreateTokenModal(false);
        setTokenCreatedModal(true);
    }, [])

    useEffect(() => {
        if (!initialisedRef.current) {
            initialisedRef.current = true;
            getTokens();
        }
    }, [])

	return (
		<>
			<PaddedPage>
				<div className="passport-group-search-main-heading">
					<div className="passport-group-search-main-heading-txt">
						<PageHeading>User Tokens</PageHeading>
					</div>
					<div className="passport-group-search-main-heading-btns">
						<ButtonIcon icon={"ri-add-line"} label={"Create Bearer Token"} onClick={() => {
                            setCreateTokenRequest(getEmptyTokenRequest());
                            setCreateTokenLoading(false);
                            setCreateTokenModal(true)}
						}></ButtonIcon>
					</div>
				</div>
				<div>
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
									}}>Name</Cell>
									<Cell
										alignment={CellAlignment.CENTER}
										style={{
										backgroundColor: "#f7f8f9",
										fontWeight: "600",
										border: "none",
										borderBottom: "1px solid #e0e1e2",
										borderLeft: "none",
										borderTop: "none"
									}}>Expiry</Cell>
                                    <Cell
                                        alignment={CellAlignment.CENTER}
                                        style={{
                                            backgroundColor: "#f7f8f9",
                                            fontWeight: "600",
                                            border: "none",
                                            borderBottom: "1px solid #e0e1e2",
                                            borderLeft: "none",
                                            borderTop: "none"
                                        }}>Revoke Token</Cell>
								</Row>
							</THead>
							<TBody>
								{tokens.map((item, index) => (
									<Row key={item.id + "-" + index}>
										<Cell
											style={{
											border: "none",
											borderLeft: "none",
											borderBottom: index == (tokens.length - 1) ? "none" : "1px solid #e0e1e2",
											borderTop: "none",
											cursor: "pointer"
										}}>
											<div className="passport-user-groups-primary-cell">
												<div
													className="passport-user-groups-primary-cell-main">
													{item.title}
												</div>
											</div>
										</Cell>
                                        <Cell
                                            alignment={CellAlignment.CENTER}
                                            style={{border: "none", borderBottom: index == (tokens.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2", cursor: "pointer"}}>
                                            <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                <DateDisplay targetDate={item.expiry}></DateDisplay>
                                            </div>
                                        </Cell>
                                        <Cell
                                            alignment={CellAlignment.CENTER}
                                            style={{border: "none", borderBottom: index == (tokens.length -1) ? "none" : "1px solid #e0e1e2", borderTop: "1px solid #e0e1e2"}}>
                                            <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                <ButtonIcon icon="ri-delete-bin-line" onClick={() => deleteToken(item.id)}></ButtonIcon>
                                            </div>
                                        </Cell>
									</Row>
								))}
							</TBody>
						</Table>
					</div>
				</div>
			</PaddedPage>
            {createTokenModal &&
				<Modal onClose={() => setCreateTokenModal(false)}>
					<ModalHeader label={"Create Token"} onClose={() => setCreateTokenModal(false)}></ModalHeader>
					<ModalBody>
						<InputForm paddingBottom={50}>
							<Input label={"Name"} value={createTokenRequest.name} onChange={updateTitle}></Input>
							<DateInput label={"Expiry Date"} value={createTokenRequest.expiration} onChange={updateExpiry}></DateInput>
						</InputForm>
					</ModalBody>
					<ModalFooter>
						<ModalFooterLeft>
							<Button text={"Cancel"} buttonType={ButtonType.SECONDARY}
									onClick={() => setCreateTokenModal(false)}></Button>
						</ModalFooterLeft>
						<ModalFooterRight>
							<Button text={"Create"} buttonType={ButtonType.PRIMARY} onClick={() => saveBearerTokenRequest(createTokenRequest)}
									isLoading={createTokenLoading}></Button>
						</ModalFooterRight>
					</ModalFooter>
				</Modal>
			}
            {tokenCreatedModal &&
                <Modal onClose={() => setTokenCreatedModal(false)}>
                    <ModalHeader label={"Token Created"} onClose={() => setTokenCreatedModal(false)}></ModalHeader>
                    <ModalBody>
                        <InputForm paddingBottom={50}>
                            <Description>Please copy you token once this modal closes you will not be able to get the token again.</Description>
                            <CopyInput label={"Name"} value={tempTokenStore}></CopyInput>
                        </InputForm>
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterRight>
                            <Button text={"Close"} buttonType={ButtonType.SECONDARY}
                                    onClick={() => setTokenCreatedModal(false)}></Button>
                        </ModalFooterRight>
                    </ModalFooter>
                </Modal>
            }
		</>
	)
}