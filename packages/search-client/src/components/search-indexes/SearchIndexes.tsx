import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import './SearchIndexes.css';
import {
    ButtonIcon, CellAlignment,
    DateDataCell,
    Description,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerPosition,
    HeaderCell,
    PaddedPage,
    PageHeading,
    PrimaryCell,
    Row,
    SearchInput,
    Table,
    TableTheme,
    TBody, TextDataCell,
    THead
} from "@blue-orange-ai/foundations-core";
import {Index, Page} from "@blue-orange-ai/foundations-clients";
import {useSearch, useSpecificIndexPath} from "../providers/SearchProvider";
import {SearchIndexEditor} from "../search-index-editor/SearchIndexEditor";

interface NewSearchIndex {
    name: string;
    displayName: string;
    description: string;
}

interface Props {
}
export const SearchIndexes: React.FC<Props> = () => {
    const searchClient = useSearch();
    const navigate = useNavigate();
    const specificIndexPath = useSpecificIndexPath();

    const [createIndexModal, setCreateIndexModal] = useState(false);

    const [loadingNewIndex, setLoadingNewIndex] = useState<boolean>(false);
    const [indexes, setIndexes] = useState<Index[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [editableIndex, setEditableIndex] = useState<NewSearchIndex>({
        name: "",
        displayName: "",
        description: ""
    });

    const openCreateIndexModal = () => {
        setEditableIndex({
            name: "",
            displayName: "",
            description: ""
        })
        setCreateIndexModal(true);
    };

    const fetchIndexes = async (query: string = "", pageNum: number = 0) => {
        setLoading(true);
        try {
            const response: Page<Index> = await searchClient.searchAllIndexes(query, pageNum, 20);
            setIndexes(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setPage(response.number);
        } catch (error) {
            console.error("Failed to fetch indexes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIndexes(searchQuery, page);
    }, [searchQuery]);

    const handleSearch = (searchText: string) => {
        setSearchQuery(searchText);
        setPage(0);
    };

    const handleIndexCreated = (index: Index) => {
        navigate(`${specificIndexPath}/${index.name}`);
    }

    return (
        <>
            {createIndexModal &&
                <Drawer position={DrawerPosition.RIGHT} width={"60vw"} onClose={() => setCreateIndexModal(false)}>
                    <DrawerHeader label="Create New Index" onClose={() => setCreateIndexModal(false)}></DrawerHeader>
                    <DrawerBody>
                        <SearchIndexEditor
                            searchClient={searchClient}
                            onIndexCreated={handleIndexCreated}
                        ></SearchIndexEditor>
                    </DrawerBody>
                </Drawer>
            }

            <PaddedPage>
                <div className="blue-orange-search-index-header">
                    <PageHeading>Search Indexes</PageHeading>
                    <ButtonIcon icon="ri-add-line" label="Create new index" onClick={openCreateIndexModal}></ButtonIcon>
                </div>
                <Description>Manage your search indexes here.</Description>
                <div className="blue-orange-search-indexes-list">
                    <div className="blue-orange-search-indexes-list-search-bar">
                        <SearchInput
                            value={searchQuery}
                            icon="ri-search-line"
                            label="Search..."
                            deletable={true}
                            onSearchEvent={handleSearch}
                        />
                    </div>
                    <Table theme={TableTheme.OBJECT_LIST}>
                        <THead>
                            <tr>
                                <HeaderCell>
                                    <div className="blue-orange-object-table-development-header">Table</div>
                                </HeaderCell>
                                <HeaderCell>
                                    <div className="blue-orange-object-table-development-header">Version</div>
                                </HeaderCell>
                            </tr>
                        </THead>
                        <TBody>
                            {loading ? (
                                <Row>
                                    <PrimaryCell
                                        text="Loading..."
                                        secondaryText=""
                                    ></PrimaryCell>
                                    <TextDataCell text={""}></TextDataCell>
                                </Row>
                            ) : indexes.length === 0 ? (
                                <Row>
                                    <PrimaryCell
                                        text="No indexes found"
                                        secondaryText="Try adjusting your search query"
                                    ></PrimaryCell>
                                    <TextDataCell text={""}></TextDataCell>
                                </Row>
                            ) : (
                                indexes.map((index: Index) => (
                                    <Row key={index.id || index.name} onClick={() => navigate(`${specificIndexPath}/${index.name}`)}>
                                        <PrimaryCell
                                            text={index.displayName || index.name}
                                            secondaryText={index.description}
                                        ></PrimaryCell>
                                        <TextDataCell text={index.version} alignment={CellAlignment.CENTER}></TextDataCell>
                                    </Row>
                                ))
                            )}
                        </TBody>
                    </Table>
                </div>
            </PaddedPage>
        </>

    );
};
