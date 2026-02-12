import React, {useContext, useEffect, useRef, useState} from "react";
import {
    Analyzer,
    BlueOrangeSearch,
    Index,
    Schema,
    SchemaProperty,
    SchemaPropertyType
} from "@blue-orange-ai/foundations-clients";

import './SearchIndexEditor.css';
import {
    Button,
    ButtonIcon,
    ButtonType,
    Description,
    Input,
    InputForm,
    Modal,
    ModalBody,
    ModalFooter,
    ModalFooterLeft,
    ModalFooterRight,
    ModalHeader,
    PaddedPage,
    PageHeading,
    SchemaEditor,
    Tab,
    Tabs,
    TextArea,
    SearchPlayground,
    SearchUsage,
    ToastContext,
    ToasterType,
    ToastLocation
} from "@blue-orange-ai/foundations-core";

interface Props {
    searchClient?: BlueOrangeSearch;
    index?: Index;
    onIndexCreated?: (index: Index) => void;
    onIndexUpdated?: (index: Index) => void;
    onIndexDeleted?: (name: string) => void;
    onError?: (error: string) => void;
}

export const SearchIndexEditor: React.FC<Props> = ({
    searchClient,
    index,
    onIndexCreated,
    onIndexUpdated,
    onIndexDeleted,
    onError
}) => {

    const processEditableIndex = (i: Index | undefined): Index => {
           if (i) {
               return i;
           }
           return {
               name: "",
               displayName: "",
               description: "",
               schema: {
                   properties: []
               },
           }
    }

    const [basicEditModal, setBasicEditModal] = useState(false);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isIndexing, setIsIndexing] = useState(false);
    const [editableIndex, setEditableIndex] = useState<Index>(processEditableIndex(index));
    const editableIndexRef = useRef<Index>(processEditableIndex(index));
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [savedIndex, setSavedIndex] = useState<Index | undefined>(index);
    const [indexDataJson, setIndexDataJson] = useState<string>('');
    const [jsonValidationErrors, setJsonValidationErrors] = useState<string[]>([]);
    const { addToast } = useContext(ToastContext);

    const validateValueAgainstType = (value: unknown, property: SchemaProperty): string | null => {
        const { apiName, type, allowMultiple } = property;

        if (value === null || value === undefined) {
            return null; // Allow null/undefined values
        }

        const validateSingleValue = (val: unknown): string | null => {
            switch (type) {
                case SchemaPropertyType.INTEGER:
                case SchemaPropertyType.LONG:
                    if (typeof val !== 'number' || !Number.isInteger(val)) {
                        return `Field "${apiName}" expects an integer, got ${typeof val}`;
                    }
                    break;
                case SchemaPropertyType.FLOAT:
                case SchemaPropertyType.DOUBLE:
                    if (typeof val !== 'number') {
                        return `Field "${apiName}" expects a number, got ${typeof val}`;
                    }
                    break;
                case SchemaPropertyType.TEXT:
                case SchemaPropertyType.KEYWORDS:
                case SchemaPropertyType.SEARCH_AS_YOU_TYPE:
                    if (typeof val !== 'string') {
                        return `Field "${apiName}" expects a string, got ${typeof val}`;
                    }
                    break;
                case SchemaPropertyType.BOOLEAN:
                    if (typeof val !== 'boolean') {
                        return `Field "${apiName}" expects a boolean, got ${typeof val}`;
                    }
                    break;
                case SchemaPropertyType.DATE:
                    if (typeof val !== 'string' && typeof val !== 'number') {
                        return `Field "${apiName}" expects a date string or timestamp, got ${typeof val}`;
                    }
                    break;
                case SchemaPropertyType.GEO_POINT:
                    if (typeof val !== 'object' || val === null) {
                        return `Field "${apiName}" expects a geo point object with lat/lon`;
                    }
                    const geoPoint = val as Record<string, unknown>;
                    if (typeof geoPoint.lat !== 'number' || typeof geoPoint.lon !== 'number') {
                        return `Field "${apiName}" expects a geo point object with numeric lat/lon properties`;
                    }
                    break;
                case SchemaPropertyType.VECTOR:
                    if (!Array.isArray(val) || !val.every(v => typeof v === 'number')) {
                        return `Field "${apiName}" expects an array of numbers for vector`;
                    }
                    break;
                case SchemaPropertyType.OBJECT:
                    if (typeof val !== 'object' || val === null || Array.isArray(val)) {
                        return `Field "${apiName}" expects an object`;
                    }
                    break;
            }
            return null;
        };

        if (allowMultiple) {
            if (!Array.isArray(value)) {
                return `Field "${apiName}" expects an array (allowMultiple is true)`;
            }
            for (let i = 0; i < value.length; i++) {
                const error = validateSingleValue(value[i]);
                if (error) {
                    return `${error} at index ${i}`;
                }
            }
        } else {
            return validateSingleValue(value);
        }

        return null;
    };

    const validateJsonAgainstSchema = (jsonStr: string): string[] => {
        const errors: string[] = [];

        if (!jsonStr.trim()) {
            return errors;
        }

        let parsedData: unknown;
        try {
            parsedData = JSON.parse(jsonStr);
        } catch (e) {
            errors.push(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
            return errors;
        }

        if (!savedIndex?.schema?.properties) {
            errors.push('No schema defined for this index');
            return errors;
        }

        const documents = Array.isArray(parsedData) ? parsedData : [parsedData];
        const schemaProperties = savedIndex.schema.properties;
        const schemaFieldNames = new Set(schemaProperties.map(p => p.apiName));

        documents.forEach((doc, docIndex) => {
            if (typeof doc !== 'object' || doc === null) {
                errors.push(`Document ${docIndex + 1}: Expected an object`);
                return;
            }

            const docRecord = doc as Record<string, unknown>;

            // Check for unknown fields
            Object.keys(docRecord).forEach(fieldName => {
                if (!schemaFieldNames.has(fieldName)) {
                    errors.push(`Document ${docIndex + 1}: Unknown field "${fieldName}" not in schema`);
                }
            });

            // Validate each schema property
            schemaProperties.forEach(property => {
                const value = docRecord[property.apiName];
                const error = validateValueAgainstType(value, property);
                if (error) {
                    errors.push(`Document ${docIndex + 1}: ${error}`);
                }
            });
        });

        return errors;
    };

    const handleIndexDataChange = (value: string) => {
        setIndexDataJson(value);
        const errors = validateJsonAgainstSchema(value);
        setJsonValidationErrors(errors);
    };

    const generatePlaceholderFromSchema = (): string => {
        if (!savedIndex?.schema?.properties || savedIndex.schema.properties.length === 0) {
            return '{\n  "field1": "value1",\n  "field2": 123\n}';
        }

        const exampleValues: Record<string, any> = {};
        savedIndex.schema.properties.forEach(property => {
            const { apiName, type, allowMultiple } = property;
            
            let exampleValue: any;
            switch (type) {
                case SchemaPropertyType.INTEGER:
                case SchemaPropertyType.LONG:
                    exampleValue = 123;
                    break;
                case SchemaPropertyType.FLOAT:
                case SchemaPropertyType.DOUBLE:
                    exampleValue = 123.45;
                    break;
                case SchemaPropertyType.TEXT:
                case SchemaPropertyType.KEYWORDS:
                case SchemaPropertyType.SEARCH_AS_YOU_TYPE:
                    exampleValue = "example text";
                    break;
                case SchemaPropertyType.BOOLEAN:
                    exampleValue = true;
                    break;
                case SchemaPropertyType.DATE:
                    exampleValue = "2024-01-01T00:00:00Z";
                    break;
                case SchemaPropertyType.GEO_POINT:
                    exampleValue = { lat: 40.7128, lon: -74.0060 };
                    break;
                case SchemaPropertyType.VECTOR:
                    exampleValue = [0.1, 0.2, 0.3];
                    break;
                case SchemaPropertyType.OBJECT:
                    exampleValue = { key: "value" };
                    break;
                default:
                    exampleValue = "value";
            }

            exampleValues[apiName] = allowMultiple ? [exampleValue] : exampleValue;
        });

        return JSON.stringify(exampleValues, null, 2);
    };

    const handleIndexData = async () => {
        if (!searchClient || !savedIndex?.name) {
            addToast({
                id: `index-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                description: 'Search client or index not configured'
            });
            return;
        }

        const errors = validateJsonAgainstSchema(indexDataJson);
        if (errors.length > 0) {
            addToast({
                id: `validation-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                description: 'Please fix validation errors before indexing'
            });
            return;
        }

        setIsIndexing(true);
        try {
            const parsedData = JSON.parse(indexDataJson);
            const documents = Array.isArray(parsedData) ? parsedData : [parsedData];

            if (documents.length === 1) {
                await searchClient.indexDocument(savedIndex.name, documents[0]);
            } else {
                await searchClient.indexDocumentsBulk(savedIndex.name, documents);
            }

            addToast({
                id: `index-success-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.SUCCESS,
                description: `Successfully indexed ${documents.length} document(s)`,
                ttl: 5000
            });
            setIndexDataJson('');
            setJsonValidationErrors([]);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            addToast({
                id: `index-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                description: errorMsg
            });
        } finally {
            setIsIndexing(false);
        }
    };

    useEffect(() => {
        setEditableIndex(processEditableIndex(index));
        editableIndexRef.current = processEditableIndex(index);
        setSavedIndex(index);
    }, [index]);

    const createSearchIndex = async (index: Index): Promise<Index | undefined> => {
        if (!searchClient) {
            const errorMsg = "Search client is not configured";
            onError?.(errorMsg);
            return undefined;
        }

        setIsCreating(true);
        try {
            const createdIndex = await searchClient.createIndex(index);
            addToast({
                id: `index-created-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.SUCCESS,
                description: `Search index "${createdIndex.name}" created successfully`,
                ttl: 5000
            });
            setSavedIndex(createdIndex);
            setEditableIndex(processEditableIndex(createdIndex));
            editableIndexRef.current = processEditableIndex(createdIndex);
            onIndexCreated?.(createdIndex);
            return createdIndex;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            addToast({
                id: `index-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                description: errorMsg
            });
            onError?.(errorMsg);
            return undefined;
        } finally {
            setIsCreating(false);
        }
    };

    const updateSearchIndex = async (index: Index): Promise<Index | undefined> => {
        if (!searchClient) {
            const errorMsg = "Search client is not configured";
            onError?.(errorMsg);
            return undefined;
        }

        setIsUpdating(true);
        try {
            const updatedIndex = await searchClient.createMigrateIndex(index);
            addToast({
                id: `index-updated-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.SUCCESS,
                description: `Search index "${updatedIndex.name}" updated successfully`,
                ttl: 5000
            });
            setSavedIndex(updatedIndex);
            setEditableIndex(processEditableIndex(updatedIndex));
            editableIndexRef.current = processEditableIndex(updatedIndex);
            onIndexUpdated?.(updatedIndex);
            return updatedIndex;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            addToast({
                id: `index-update-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                description: errorMsg
            });
            onError?.(errorMsg);
            return undefined;
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteSearchIndex = async (name: string): Promise<boolean> => {
        if (!searchClient) {
            const errorMsg = "Search client is not configured";
            onError?.(errorMsg);
            return false;
        }

        setIsDeleting(true);
        try {
            await searchClient.deleteIndex(name);
            addToast({
                id: `index-deleted-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.SUCCESS,
                description: `Search index "${name}" deleted successfully`,
                ttl: 5000
            });
            setSavedIndex(undefined);
            setEditableIndex(processEditableIndex(undefined));
            editableIndexRef.current = processEditableIndex(undefined);
            onIndexDeleted?.(name);
            return true;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            addToast({
                id: `index-delete-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                description: errorMsg
            });
            onError?.(errorMsg);
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveBasicInfo = async () => {
        if (editableIndex) {
            const result = await updateSearchIndex(editableIndex);
            if (result) {
                setBasicEditModal(false);
            }
        }
    };

    const handleCancelBasicInfo = () => {
        if (savedIndex && editableIndex) {
            editableIndexRef.current = {
                ...editableIndex,
                name: savedIndex.name,
                displayName: savedIndex.displayName,
                description: savedIndex.description
            }
            setEditableIndex({
                ...editableIndex,
                name: savedIndex.name,
                displayName: savedIndex.displayName,
                description: savedIndex.description
            });

        }
        setBasicEditModal(false);
    };

    const handleSchemaChange = (schema: Schema) => {
        editableIndexRef.current = {
            ...editableIndex,
            schema: schema
        }
        setEditableIndex(prev => prev ? {...prev, schema} : prev);
        setLastUpdated(new Date());
    };

    const hasUnsavedChanges = (): boolean => {
        if (!editableIndexRef.current && !savedIndex) return false;
        if (!editableIndexRef.current || !savedIndex) return true;
        return JSON.stringify(editableIndexRef.current) !== JSON.stringify(savedIndex);
    };

    const validateIndex = (indexToValidate: Index): string[] => {
        const errors: string[] = [];
        const forbiddenChars = ['<', '"', ' ', '\\', '/', ',', '|', '>', '?', '*'];

        // Validate index name is lowercase
        if (indexToValidate.name !== indexToValidate.name.toLowerCase()) {
            errors.push('Index name must be all lowercase');
        }

        // Validate index name doesn't contain forbidden characters
        const foundForbidden = forbiddenChars.filter(char => indexToValidate.name.includes(char));
        if (foundForbidden.length > 0) {
            errors.push(`Index name cannot contain: ${foundForbidden.map(c => c === ' ' ? 'space' : c).join(', ')}`);
        }

        // Validate schema has properties
        if (!indexToValidate.schema?.properties || indexToValidate.schema.properties.length === 0) {
            errors.push('Schema must have at least one property');
        } else {
            // Validate schema has a primary key
            const hasPrimaryKey = indexToValidate.schema.properties.some(p => p.primaryKey === true);
            if (!hasPrimaryKey) {
                errors.push('Schema must have a primary key property');
            }

            // Validate schema has a title
            const hasTitle = indexToValidate.schema.properties.some(p => p.title === true);
            if (!hasTitle) {
                errors.push('Schema must have a title property');
            }
        }

        return errors;
    };

    const handleSaveIndex = async () => {
        if (editableIndex) {
            const validationErrors = validateIndex(editableIndex);
            if (validationErrors.length > 0) {
                addToast({
                    id: `validation-error-${Date.now()}`,
                    location: ToastLocation.BOTTOM_RIGHT,
                    toastType: ToasterType.ERROR,
                    description: validationErrors.join('\n')
                });
                return;
            }

            if (savedIndex) {
                await updateSearchIndex(editableIndex);
            } else {
                await createSearchIndex(editableIndex);
            }
        }
    };

    const handleDiscardChanges = () => {
        setEditableIndex(processEditableIndex(savedIndex));
        editableIndexRef.current = processEditableIndex(savedIndex);
        setLastUpdated(new Date())
    };

    return (
        <>
            {basicEditModal &&
                <Modal onClose={() => setBasicEditModal(false)}>
                    <ModalHeader label="Edit Basic Index Information" onClose={() => setBasicEditModal(false)}></ModalHeader>
                    <ModalBody>
                        <InputForm>
                            <Input
                                label="Name"
                                value={editableIndex?.name ?? ""}
                                onChange={(value) => setEditableIndex(prev => prev ? {...prev, name: value} : prev)}
                            ></Input>
                            <Input
                                label="Display Name"
                                value={editableIndex?.displayName ?? ""}
                                onChange={(value) => setEditableIndex(prev => prev ? {...prev, displayName: value} : prev)}
                            ></Input>
                            <TextArea
                                label="Description"
                                value={editableIndex?.description ?? ""}
                                onChange={(value) => setEditableIndex(prev => prev ? {...prev, description: value} : prev)}
                            ></TextArea>
                        </InputForm>
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterLeft>
                            <Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={handleCancelBasicInfo}></Button>
                        </ModalFooterLeft>
                        <ModalFooterRight>
                            <Button
                                text={"Save"}
                                buttonType={ButtonType.PRIMARY}
                                isLoading={isUpdating}
                                onClick={handleSaveBasicInfo}
                            ></Button>
                        </ModalFooterRight>
                    </ModalFooter>
                </Modal>
            }
            {deleteConfirmModal &&
                <Modal onClose={() => setDeleteConfirmModal(false)}>
                    <ModalHeader label="Delete Search Index" onClose={() => setDeleteConfirmModal(false)}></ModalHeader>
                    <ModalBody>
                        <Description>
                            Are you sure you want to delete this search index? This action cannot be undone.
                        </Description>
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterLeft>
                            <Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={() => setDeleteConfirmModal(false)}></Button>
                        </ModalFooterLeft>
                        <ModalFooterRight>
                            <Button
                                text={"Delete"}
                                buttonType={ButtonType.DANGER}
                                isLoading={isDeleting}
                                onClick={async () => {
                                    if (savedIndex?.name) {
                                        const success = await deleteSearchIndex(savedIndex.name);
                                        if (success) {
                                            setDeleteConfirmModal(false);
                                        }
                                    }
                                }}
                            ></Button>
                        </ModalFooterRight>
                    </ModalFooter>
                </Modal>
            }
            <div className="blue-orange-search-index-editor">
                <div className="blue-orange-index-editor-header">
                    <div className="blue-orange-index-editor-header-row">
                        <PageHeading>Search Index Editor</PageHeading>
                        <div className="blue-orange-index-editor-header-controls">
                            {hasUnsavedChanges() &&
                                <>
                                    <Button text="Discard" buttonType={ButtonType.SECONDARY} onClick={handleDiscardChanges}></Button>
                                    <Button text="Save" buttonType={ButtonType.PRIMARY} isLoading={isUpdating || isCreating} onClick={handleSaveIndex}></Button>
                                </>
                            }
                            {savedIndex &&
                                <>
                                    <ButtonIcon icon="ri-pencil-line" onClick={() => setBasicEditModal(true)}></ButtonIcon>
                                    <ButtonIcon icon="ri-delete-bin-line" onClick={() => setDeleteConfirmModal(true)}></ButtonIcon>
                                </>
                            }
                        </div>
                    </div>
                    <div className="blue-orange-index-editor-header-row">
                        <Description>This is where the description of the search index will go</Description>
                    </div>

                </div>
                {savedIndex &&
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
                                <SchemaEditor
                                    schema={editableIndex?.schema}
                                    onChange={handleSchemaChange}
                                ></SchemaEditor>
                            </PaddedPage>
                        </Tab>
                        <Tab name="Index Data" uuid="search-index-editor-data-index">
                            <PaddedPage>
                                <InputForm>
                                    <TextArea
                                        label="Index Data (JSON)"
                                        placeholder={generatePlaceholderFromSchema()}
                                        style={{"minHeight": "200px", "fontFamily": "monospace"}}
                                        value={indexDataJson}
                                        onChange={handleIndexDataChange}
                                    ></TextArea>
                                    {jsonValidationErrors.length > 0 && (
                                        <div className="search-index-editor-validation-errors">
                                            {jsonValidationErrors.map((error, idx) => (
                                                <div key={idx} className="search-index-editor-validation-error">
                                                    {error}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </InputForm>
                                <div className="search-index-editor-data-index-btn-group">
                                    <Button
                                        text={"Index"}
                                        buttonType={ButtonType.PRIMARY}
                                        isLoading={isIndexing}
                                        onClick={handleIndexData}
                                        isDisabled={jsonValidationErrors.length > 0 || !indexDataJson.trim()}
                                    ></Button>
                                </div>
                            </PaddedPage>
                        </Tab>
                        <Tab name="Plaground" uuid="search-index-editor-playground">
                            <SearchPlayground 
                                searchClient={searchClient}
                                index={savedIndex}
                            ></SearchPlayground>
                        </Tab>
                    </Tabs>
                }
                {!savedIndex &&
                    <Tabs headerStyle={{paddingLeft: "60px", paddingRight: "60px", width: "calc(100% - 120px"}}>
                        <Tab
                            name="Basic Information"
                            uuid="search-index-editor-home">
                            <PaddedPage>
                                <InputForm>
                                    <Input
                                        label="Name"
                                        value={editableIndex?.name ?? ""}
                                        onChange={(value) => setEditableIndex(prev => prev ? {...prev, name: value} : prev)}
                                    ></Input>
                                    <Input
                                        label="Display Name"
                                        value={editableIndex?.displayName ?? ""}
                                        onChange={(value) => setEditableIndex(prev => prev ? {...prev, displayName: value} : prev)}
                                    ></Input>
                                    <TextArea
                                        label="Description"
                                        value={editableIndex?.description ?? ""}
                                        onChange={(value) => setEditableIndex(prev => prev ? {...prev, description: value} : prev)}
                                    ></TextArea>
                                </InputForm>
                            </PaddedPage>

                        </Tab>
                        <Tab name="Schema" uuid="search-index-editor-schema">
                            <PaddedPage>
                                <SchemaEditor
                                    schema={editableIndex?.schema}
                                    onChange={handleSchemaChange}
                                ></SchemaEditor>
                            </PaddedPage>
                        </Tab>
                    </Tabs>
                }
            </div>
        </>

    )

};