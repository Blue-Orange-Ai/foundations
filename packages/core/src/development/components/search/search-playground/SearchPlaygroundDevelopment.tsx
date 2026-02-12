import React, {useCallback, useEffect, useRef, useState} from "react";

import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {BlueOrangeSearch, Index} from "@blue-orange-ai/foundations-clients";
import {SearchPlayground} from "../../../../components/search/search-playground/SearchPlayground";

interface Props {
}

export const SearchPlaygroundDevelopment: React.FC<Props> = ({}) => {

	const searchClient = new BlueOrangeSearch("http://localhost:8091", "");

    const [indexName, setIndexName] = useState<string>("test-index-all-types");

    const [index, setIndex] = useState<Index | null>(null)

    const initRef = useRef<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true)

    const loadIndex = useCallback(async () => {
        if (!indexName) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const loadedIndex = await searchClient.getIndex(indexName);
            if (!loadedIndex) {
            } else {
                setIndex(loadedIndex);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [indexName, searchClient]);

    useEffect(() => {
        if (!initRef.current) {
            initRef.current = true;
            loadIndex();
        }

    }, [indexName, searchClient]);

	return (
        <div>
            <PageHeading>Search Playground Editor</PageHeading>
            {!loading &&
                <SearchPlayground
                    searchClient={searchClient}
                    index={index}
                ></SearchPlayground>
            }
        </div>
	)
}
