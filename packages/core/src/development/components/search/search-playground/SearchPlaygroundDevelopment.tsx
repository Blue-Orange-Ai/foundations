import React, {useCallback, useEffect, useRef, useState} from "react";

import {BlueOrangeSearch, Index} from "@blue-orange-ai/foundations-clients";
import {SearchPlayground} from "../../../../components/search/search-playground/SearchPlayground";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SEARCH_PLAYGROUND_PROPS: Array<PropSpec> = [
	{
		name: "searchClient",
		type: "BlueOrangeSearch",
		description: "The client the playground runs its queries through. Without one it builds a query but cannot execute it."
	},
	{
		name: "index",
		type: "Index",
		description: "The index being searched. Left off, the playground falls back to a demo index with an empty schema."
	}
];

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
		<ComponentDoc
			title="Search Playground"
			description="The query builder, the results and the raw request side by side — a place to work a search out against a real index before it is written into an application. It needs a search service to talk to, so it shows an empty index until one is reachable."
			name="SearchPlayground"
			previewHeight={420}
			previewCentered={false}
			props={SEARCH_PLAYGROUND_PROPS}
			preview={() => (
				<div style={{width: "100%"}}>
					{!loading &&
						<SearchPlayground
							searchClient={searchClient}
							index={index ?? undefined}
						></SearchPlayground>
					}
				</div>
			)}>
		</ComponentDoc>
	)
}
