import React, {useCallback, useEffect, useMemo, useState} from "react";

import './SearchPlayground.css';
import {BlueOrangeSearchQuery, BlueOrangeSearchQueryOperand, BlueOrangeSearchQueryCompositeCondition, BlueOrangeSearchQueryComponent, BlueOrangeSearchQueryTermType, SearchQueryEditor} from "../search-query-editor/SearchQueryEditor";
import {DataTable, TableField, TableFieldSortState, TableFieldType} from "../../table/data-table/DataTable";
import {IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";
import {
    BlueOrangeSearch, Query, QueryOperand, QueryCompositeCondition, Index, SchemaProperty,
    SearchRecord, SortCondition, SortDirection
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
        },
        sortConditions: []
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
                rootCondition: convertRootCondition(searchQuery.rootCondition),
                sortConditions: searchQuery.sortConditions
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

    const handleColumnSort = (field: TableField, direction: SortDirection | null) => {
        const updatedQuery = { ...query };
        
        if (direction === null) {
            updatedQuery.sortConditions = [];
        } else {
            updatedQuery.sortConditions = [{
                field: field.apiName,
                direction: direction
            }];
        }
        
        setQuery(updatedQuery);
        setCurrentPage(1);
        executeSearch(updatedQuery, 1, false);
    };

    const getSortStateForField = (apiName: string): TableFieldSortState => {
        const sortCondition = query.sortConditions?.find(sc => sc.field === apiName);
        if (!sortCondition) {
            return TableFieldSortState.UNSORTED;
        }
        return sortCondition.direction === SortDirection.ASC 
            ? TableFieldSortState.SORTED_ASC 
            : TableFieldSortState.SORTED_DESC;
    };

    const createSortMenuItems = (field: TableField): IContextMenuItem[] => {
        return [
            {
                label: "Sort Ascending",
                type: IContextMenuType.CONTENT,
                value: { field, direction: SortDirection.ASC }
            },
            {
                label: "Sort Descending",
                type: IContextMenuType.CONTENT,
                value: { field, direction: SortDirection.DESC }
            },
            {
                label: "Clear Sort",
                type: IContextMenuType.CONTENT,
                value: { field, direction: null }
            }
        ];
    };

    const convertPropertyToTableField = (property: SchemaProperty): TableField => {
        return {
            label: property.displayName ?? property.apiName,
            apiName: property.apiName,
            type: mapSchemaTypeToTableFieldType(property.type),
            sortable: true,
            filterable: false,
            statistics: false,
            sortState: getSortStateForField(property.apiName),
            dropDownItems: createSortMenuItems({
                label: property.displayName ?? property.apiName,
                apiName: property.apiName,
                type: mapSchemaTypeToTableFieldType(property.type),
                sortable: true,
                filterable: false,
                statistics: false,
                sortState: getSortStateForField(property.apiName)
            })
        };
    };

    const displaySchema: Array<TableField> = useMemo(() => {
        return index.schema.properties.map(convertPropertyToTableField);
    }, [index.schema.properties, query.sortConditions]);

    const handleHeaderDropdownSelected = (item: IContextMenuItem) => {
        if (item.value && item.value.field && item.value.direction !== undefined) {
            handleColumnSort(item.value.field, item.value.direction);
        }
    };

    const handleAddAsFilter = (field: TableField, values: string[], fieldType: TableFieldType) => {
        if (values.length === 0) return;

        const property = index.schema.properties.find(p => p.apiName === field.apiName);
        if (!property) return;

        let newComponent: BlueOrangeSearchQueryComponent;

        if (fieldType === TableFieldType.NUMBER || fieldType === TableFieldType.CURRENCY) {
            const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
            if (numericValues.length === 0) return;

            if (numericValues.length === 1) {
                newComponent = {
                    numericCondition: {
                        field: field.apiName,
                        gte: numericValues[0].toString(),
                        lte: numericValues[0].toString()
                    }
                };
            } else {
                const min = Math.min(...numericValues);
                const max = Math.max(...numericValues);
                newComponent = {
                    operand: BlueOrangeSearchQueryOperand.AND,
                    components: [
                        {
                            numericCondition: {
                                field: field.apiName,
                                gte: min.toString()
                            }
                        },
                        {
                            numericCondition: {
                                field: field.apiName,
                                lte: max.toString()
                            }
                        }
                    ]
                };
            }
        } else if (fieldType === TableFieldType.DATE) {
            const dateValues = values.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
            if (dateValues.length === 0) return;

            if (dateValues.length === 1) {
                newComponent = {
                    dateCondition: {
                        field: field.apiName,
                        gte: dateValues[0].toISOString(),
                        lte: dateValues[0].toISOString()
                    }
                };
            } else {
                const minDate = new Date(Math.min(...dateValues.map(d => d.getTime())));
                const maxDate = new Date(Math.max(...dateValues.map(d => d.getTime())));
                newComponent = {
                    operand: BlueOrangeSearchQueryOperand.AND,
                    components: [
                        {
                            dateCondition: {
                                field: field.apiName,
                                gte: minDate.toISOString()
                            }
                        },
                        {
                            dateCondition: {
                                field: field.apiName,
                                lte: maxDate.toISOString()
                            }
                        }
                    ]
                };
            }
        } else {
            if (values.length === 1) {
                newComponent = {
                    termCondition: {
                        field: field.apiName,
                        query: values[0],
                        type: BlueOrangeSearchQueryTermType.PHRASE
                    }
                };
            } else {
                newComponent = {
                    operand: BlueOrangeSearchQueryOperand.OR,
                    components: values.map(value => ({
                        termCondition: {
                            field: field.apiName,
                            query: value,
                            type: BlueOrangeSearchQueryTermType.PHRASE
                        }
                    }))
                };
            }
        }

        const updatedQuery = {
            ...query,
            rootCondition: {
                ...query.rootCondition,
                components: [...query.rootCondition.components, newComponent]
            }
        };

        console.log('New filter component:', JSON.stringify(newComponent, null, 2));
        console.log('Updated query:', JSON.stringify(updatedQuery, null, 2));

        setQuery(updatedQuery);
        setCurrentPage(1);
        executeSearch(updatedQuery, 1, false);
    };

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
                    onChange={handleQueryChange}
                    reportChangesOnSaveOnly={true}></SearchQueryEditor>
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
                    onHeaderDropdownSelected={handleHeaderDropdownSelected}
                    onAddAsFilter={handleAddAsFilter}
                    ></DataTable>
            </div>
        </div>
    )

};