import React from "react";

import './PassportManagement.css';
import {Description, PaddedPage, PageHeading, Tab, Tabs} from "@blue-orange-ai/foundations-core";
import {UserSearch} from "../user-management/user-search/UserSearch";
import {GroupSearch} from "../group-management/group-search/GroupSearch";
import {BearerTokenManagement} from "../bearer-token-management/BearerTokenManagement";


interface Props {
}

export const PassportManagement: React.FC<Props> = ({
}) => {


    return (
        <>
            <div className="blue-orange-search-index-editor">
                <div className="blue-orange-index-editor-header">
                    <div className="blue-orange-index-editor-header-row">
                        <PageHeading>Passport Management</PageHeading>
                    </div>
                    <div className="blue-orange-index-editor-header-row">
                        <Description>General Management for your application</Description>
                    </div>

                </div>
                <Tabs
                    persistInUrl={true}
                    urlParamName="passport-management"
                    headerStyle={{paddingLeft: "60px", paddingRight: "60px", width: "calc(100% - 120px"}}>
                    <Tab uuid={"passport-management-user-search"} name={"Users"}>
                        <UserSearch></UserSearch>
                    </Tab>
                    <Tab uuid={"passport-management-group-search"} name={"Groups"}>
                        <GroupSearch></GroupSearch>
                    </Tab>
                    <Tab uuid={"passport-management-tokens"} name={"Tokens"}>
                        <BearerTokenManagement></BearerTokenManagement>
                    </Tab>

                </Tabs>
            </div>
        </>

    )

};