// @ts-ignore
import React, {useContext, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Workspace.css'
import {SearchIndexes} from "../../components/search-indexes/SearchIndexes";
import {SearchProvider} from "../../components/providers/SearchProvider";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {


	return (
		<SearchProvider uri="http://localhost:8080" authCookie="authorization">
			<div className="workspace-main-window">
				<SearchIndexes></SearchIndexes>
			</div>
		</SearchProvider>
	)
}