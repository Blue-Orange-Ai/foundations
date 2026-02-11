import React, {useState, useEffect, useCallback} from "react";

import "./IndexManagement.css"

import {useParams, useNavigate} from "react-router-dom";
import {SearchIndexEditor} from "../search-index-editor/SearchIndexEditor";
import {useSearch, useAllIndexesPath} from "../providers/SearchProvider";
import {Button, ButtonIconPos, ButtonType, ErrorBlockAlert, Loading} from "@blue-orange-ai/foundations-core";
import {Index} from "@blue-orange-ai/foundations-clients";

interface IndexLoadError{
    state: boolean,
    message: string
}


interface Props {
}
export const IndexManagement: React.FC<Props> = () => {

    const searchClient = useSearch();
    const navigate = useNavigate();
    const allIndexesPath = useAllIndexesPath();

    const { indexName } = useParams<{ indexName: string }>();

    const [loading, setLoading] = useState<boolean>(true);

    const [index, setIndex] = useState<Index | null>(null);

    const [loadError, setLoadError] = useState<IndexLoadError>({
        state: false,
        message: ""
    })

    const loadIndex = useCallback(async () => {
        if (!indexName) {
            setLoadError({
                state: true,
                message: "No index name provided"
            });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const loadedIndex = await searchClient.getIndex(indexName);
            if (!loadedIndex) {
                setLoadError({
                    state: true,
                    message: "An index with name: " + indexName + " does not exist"
                });
            } else {
                setIndex(loadedIndex);
                setLoadError({
                    state: false,
                    message: ""
                });
            }

        } catch (error) {
            setLoadError({
                state: true,
                message: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setLoading(false);
        }
    }, [indexName, searchClient]);

    useEffect(() => {
        loadIndex();
    }, [indexName, searchClient]);

    return (
        <>
            {(loading || index === null) && !loadError.state && (
                <div className="blue-orange-search-client-full-page">
                    <Loading fontSize={"40px"} color={"#e0e1e2"}></Loading>
                </div>

            )}
            {!loading && index !== null && !loadError.state &&
                <div className="blue-orange-search-client-full-page-plain">
                    <SearchIndexEditor
                        index={index}
                        searchClient={searchClient}
                    ></SearchIndexEditor>
                </div>

            }
            {loadError.state &&
                <div className="blue-orange-search-client-full-page">
                    <div className="blue-orange-search-client-error-card">
                        <ErrorBlockAlert title={"Index Failed To Load"} description={loadError.message}></ErrorBlockAlert>
                        <Button
                            buttonType={ButtonType.SECONDARY}
                            style={{width: "calc(100% - 20px)"}}
                            text="All Indexes"
                            iconPos={ButtonIconPos.LEFT}
                            icon="ri-arrow-left-line"
                            onClick={() => navigate(allIndexesPath)}
                        ></Button>
                    </div>


                </div>
            }
        </>
    );
};
