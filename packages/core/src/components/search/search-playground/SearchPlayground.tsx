import React, {useCallback, useEffect, useMemo, useState} from "react";

import './SearchPlayground.css';
import {BlueOrangeSearchQuery, BlueOrangeSearchQueryOperand, BlueOrangeSearchQueryCompositeCondition, BlueOrangeSearchQueryComponent, SearchQueryEditor} from "../search-query-editor/SearchQueryEditor";
import {DataTable, TableField, TableFieldSortState, TableFieldType} from "../../table/data-table/DataTable";
import {
    BlueOrangeSearch, Query, QueryOperand, QueryCompositeCondition, Index, SchemaProperty,
    SearchRecord
} from "@blue-orange-ai/foundations-clients";

interface Props {
    searchClient?: BlueOrangeSearch;
    index?: Index;
}

export const SearchPlayground: React.FC<Props> = ({ searchClient, index: externalIndex }) => {

    const defaultIndex: Index = {
        name: "demo-index",
        displayName: "Demo Search Query",
        description: "Build a BlueOrange search Query using a schema",
        schema: {
            properties: []
        }
    }

    const index = externalIndex ?? defaultIndex;
    const pageSize = 25;

    const [query, setQuery] = useState<BlueOrangeSearchQuery>({
        index: index.name,
        filter: false,
        page: 1,
        size: pageSize,
        minimumShouldMatch: 1,
        rootCondition: {
            operand: BlueOrangeSearchQueryOperand.AND,
            components: []
        }
    });

    const [searchResults, setSearchResults] = useState<SearchRecord[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const handleQueryChange = (updatedQuery: BlueOrangeSearchQuery) => {
        setQuery(updatedQuery);
        setCurrentPage(1);
        executeSearch(updatedQuery, 1, false);
    };

    const executeSearch = useCallback(async (searchQuery: BlueOrangeSearchQuery, page: number, append: boolean = false) => {
        if (!searchClient) return;

        setLoading(true);
        try {
            const convertedQuery: Query = {
                ...searchQuery,
                page,
                rootCondition: convertRootCondition(searchQuery.rootCondition)
            };
            const response = await searchClient.search(convertedQuery);
            
            if (append) {
                setSearchResults(prev => [...prev, ...(response.results ?? [])]);
            } else {
                setSearchResults(response.results ?? []);
            }
            setTotalCount(response.count ?? 0);
            setCurrentPage(page);
            setHasSearched(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, [searchClient]);

    const handleSearch = useCallback(() => {
        setSearchResults([]);
        setCurrentPage(1);
        executeSearch(query, 1, false);
    }, [query, executeSearch]);

    const handleLoadMore = useCallback(() => {
        if (loading) return;
        const nextPage = currentPage + 1;
        executeSearch(query, nextPage, true);
    }, [query, currentPage, loading, executeSearch]);

    const hasMoreResults = totalCount > searchResults.length;

    const convertRootCondition = (condition: BlueOrangeSearchQueryCompositeCondition): QueryCompositeCondition => {
        const operand = condition.operand === BlueOrangeSearchQueryOperand.OR 
            ? QueryOperand.OR 
            : condition.operand === BlueOrangeSearchQueryOperand.NOT 
            ? QueryOperand.NOT 
            : QueryOperand.AND;
        
        return {
            operand,
            components: condition.components.map((component: BlueOrangeSearchQueryComponent) => {
                if ('operand' in component && 'components' in component) {
                    return convertRootCondition(component as BlueOrangeSearchQueryCompositeCondition);
                }
                return component as any;
            })
        };
    };

    const mapSchemaTypeToTableFieldType = (schemaType: string): TableFieldType => {
        const normalized = schemaType.toUpperCase();
        switch (normalized) {
            case 'INTEGER':
            case 'LONG':
            case 'FLOAT':
            case 'DOUBLE':
                return TableFieldType.NUMBER;
            case 'DATE':
                return TableFieldType.DATE;
            case 'BOOLEAN':
                return TableFieldType.STRING;
            case 'GEO_POINT':
            case 'OBJECT':
            case 'VECTOR':
                return TableFieldType.STRUCT;
            case 'TEXT':
            case 'KEYWORDS':
            case 'SEARCH_AS_YOU_TYPE':
            default:
                return TableFieldType.STRING;
        }
    };

    const convertPropertyToTableField = (property: SchemaProperty): TableField => {
        return {
            label: property.displayName ?? property.apiName,
            apiName: property.apiName,
            type: mapSchemaTypeToTableFieldType(property.type),
            sortable: true,
            filterable: false,
            statistics: false,
            sortState: TableFieldSortState.UNSORTED
        };
    };

    const displaySchema: Array<TableField> = useMemo(() => {
        return index.schema.properties.map(convertPropertyToTableField);
    }, [index.schema.properties]);

    useEffect(() => {
        handleSearch()
    }, []);

    return (
        <div className="blue-orange-search-playground">
            <div className="blue-orange-search-playground-query-cont">
                <SearchQueryEditor
                    showHeader={false}
                    index={index}
                    query={query}
                    onSave={handleQueryChange}
                    reportChangesOnSaveOnly={false}></SearchQueryEditor>
            </div>
            <div className="blue-orange-search-playground-body-cont">
                <DataTable
                    persistKey="datatable-development"
                    schema={displaySchema}
                    data={searchResults}
                    loading={loading}
                    loadingPlaceholderRows={2}
                    showRowNumbers={false}
                    enableInfiniteScroll={hasSearched && hasMoreResults}
                    onEndReached={handleLoadMore}
                    showLoadingRow={loading && currentPage > 1}
                    resizableColumns={true}
                    reorderableColumns={true}
                    cellsSelectable={false}
                    rowSelectable={true}
                    ></DataTable>
            </div>
        </div>
    )

};