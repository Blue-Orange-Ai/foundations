import React, {useState} from "react";

import './SearchIndexEditor.css';
import {Tabs} from "../../layouts/tabs/tabs/Tabs";
import {Tab} from "../../layouts/tabs/tab/Tab";
import {PageHeading} from "../../text-decorations/page-heading/PageHeading";
import {Description} from "../../text-decorations/description/Description";
import {SearchPlayground} from "../search-playground/SearchPlayground";
import {InputForm} from "../../inputs/form/InputForm";
import {CopyInput} from "../../inputs/copy-input/CopyInput";
import {PaddedPage} from "../../layouts/pages/padded-page/PaddedPage";
import {Input} from "../../inputs/input/Input";
import {TextArea} from "../../inputs/textarea/TextArea";
import {TagInput} from "../../inputs/tags/simple/TagInput";
import {SchemaEditor} from "../schema-editor/SchemaEditor";
import {SearchUsage} from "../search-usage/SearchUsage";
import {Modal} from "../../layouts/modal/modal/Modal";
import {ModalHeader} from "../../layouts/modal/modal-header/ModalHeader";
import {ModalBody} from "../../layouts/modal/modal-body/ModalBody";
import {ModalFooter} from "../../layouts/modal/modal-footer/ModalFooter";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {Button, ButtonType} from "../../buttons/button/Button";
import {ModalFooterRight} from "../../layouts/modal/modal-footer-right/ModalFooterRight";
import {ModalFooterLeft} from "../../layouts/modal/modal-footer-left/ModalFooterLeft";

interface Props {
}

export const SearchIndexEditor: React.FC<Props> = ({}) => {

    const [basicEditModal, setBasicEditModal] = useState(false);

    return (
        <>
            {basicEditModal &&
                <Modal onClose={() => setBasicEditModal(false)}>
                    <ModalHeader label="Edit Basic Index Information"></ModalHeader>
                    <ModalBody>
                        <InputForm>
                            <Input label="Name"></Input>
                            <Input label="Display Name"></Input>
                            <TextArea label="Description"></TextArea>
                        </InputForm>
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterLeft>
                            <Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={() => setBasicEditModal(false)}></Button>
                        </ModalFooterLeft>
                        <ModalFooterRight>
                            <Button text={"Save"} onClick={() => setBasicEditModal(false)}>Save</Button>
                        </ModalFooterRight>


                    </ModalFooter>
                </Modal>
            }
            <div className="blue-orange-search-index-editor">
                <div className="blue-orange-index-editor-header">
                    <div className="blue-orange-index-editor-header-row">
                        <PageHeading>Search Index Editor</PageHeading>
                        <div className="blue-orange-index-editor-header-controls">
                            <ButtonIcon icon="ri-pencil-line" onClick={() => setBasicEditModal(true)}></ButtonIcon>
                        </div>
                    </div>
                    <div className="blue-orange-index-editor-header-row">
                        <Description>This is where the description of the search index will go</Description>
                    </div>

                </div>
                <Tabs headerStyle={{paddingLeft: "60px", paddingRight: "60px", width: "calc(100% - 120px"}}>
                    <Tab

                        name="Home"
                        uuid="search-index-editor-home">
                        <PaddedPage>
                            <SearchUsage></SearchUsage>
                        </PaddedPage>

                    </Tab>
                    <Tab name="Schema" uuid="search-index-editor-schema">
                        <PaddedPage>
                            <SchemaEditor readOnly={false}></SchemaEditor>
                        </PaddedPage>
                    </Tab>
                    <Tab name="Index Data" uuid="search-index-editor-data-index">
                        <PaddedPage>
                            <InputForm>
                                <TextArea label="Index Data" style={{"minHeight": "200px"}}></TextArea>
                            </InputForm>
                            <div className="search-index-editor-data-index-btn-group">
                                <Button text={"Index"} buttonType={ButtonType.PRIMARY} isLoading={false}></Button>
                            </div>
                        </PaddedPage>
                    </Tab>
                    <Tab name="Plaground" uuid="search-index-editor-playground">
                        <SearchPlayground></SearchPlayground>
                    </Tab>
                </Tabs>
                {/*<div className="blue-orange-index-editor-tab-cont">*/}
                {/*    */}
                {/*</div>*/}

            </div>
        </>

    )

};