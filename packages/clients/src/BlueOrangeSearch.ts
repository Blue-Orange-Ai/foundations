import Cookies from "js-cookie";

export type Query = {
    index: string;
    filter?: boolean;
    page: number;
    size: number;
    minimumShouldMatch?: number;
    analyzer?: string;
    rootCondition: QueryCompositeCondition;
    sortConditions?: SortCondition[];
    aggregations?: Aggregation;
}

export type QueryComponent = QueryCondition | QueryCompositeCondition;

export type QueryCompositeCondition = {
    operand: QueryOperand;
    components: QueryComponent[];
}

export enum QueryOperand {
    AND = "AND",
    OR = "OR",
    NOT = "NOT"
}

export type QueryCondition =
    | { fullTextCondition: QueryFullTextCondition }
    | { dateCondition: QueryDateCondition }
    | { geoBoundingBoxCondition: QueryGeoBoundingBoxCondition }
    | { geoDistanceCondition: QueryGeoDistanceCondition }
    | { geoPolygonCondition: QueryGeoPolygonCondition }
    | { knnCondition: QueryKnnCondition }
    | { numericCondition: QueryNumericCondition }
    | { termCondition: QueryTermCondition };

export type QueryFullTextCondition = {
    query: string;
    fields: string[];
    fuzziness?: string;
    analyzer?: string;
}

export type QueryTermCondition = {
    field: string;
    query: string;
    type: QueryTermType;
    caseInsensitive?: boolean;
    fuzziness?: string;
    boost?: number;
    rewrite?: string;
    analyzer?: string;
}

export enum QueryTermType {
    PHRASE = "PHRASE",
    PHRASE_PREFIX = "PHRASE_PREFIX",
    FUZZY = "FUZZY",
    REGEX = "REGEX",
    WILDCARD = "WILDCARD"
}

export type QueryNumericCondition = {
    field: string;
    gte?: string;
    gt?: string;
    lte?: string;
    lt?: string;
}

export type QueryDateCondition = {
    field: string;
    gte?: string;
    gt?: string;
    lte?: string;
    lt?: string;
}

export type GeoPoint = {
    lat: number;
    lon: number;
}

export type QueryGeoBoundingBoxCondition = {
    field: string;
    topLeft: GeoPoint;
    bottomRight: GeoPoint;
}

export type QueryGeoDistanceCondition = {
    field: string;
    distance: string;
    location: GeoPoint;
}

export type QueryGeoPolygonCondition = {
    field: string;
    locations: GeoPoint[];
}

export type QueryKnnCondition = {
    field: string;
    vector: number[];
    k?: number;
    similarity?: number;
    numCandidates?: number;
}

export type SortCondition = {
    field: string;
    direction: SortDirection;
}

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export type Aggregation = {
    field: string;
    name: string;
    type: AggregationType;

    interval?: number;
    size?: number;
    script?: string;

    dateBucket?: AggregationDateBucket;
    dateQuantity?: number;

    numericRanges?: AggregationNumericRange[];
    filter?: Record<string, any>;

    dateFrom?: string;
    dateTo?: string;

    subAggregations?: Aggregation[];
}

export enum AggregationType {
    HISTOGRAM = "HISTOGRAM",
    TERM = "TERM",
    DATE_HISTOGRAM = "DATE_HISTOGRAM",
    NUMERIC_AVERAGE = "NUMERIC_AVERAGE",
    NUMERIC_SUM = "NUMERIC_SUM",
    NUMERIC_MAX = "NUMERIC_MAX",
    NUMERIC_MIN = "NUMERIC_MIN",
    COUNT = "COUNT",
    NUMERIC_STATS = "NUMERIC_STATS",
    NUMERIC_EXTENDED_STATS = "NUMERIC_EXTENDED_STATS",
    DATE_RANGE = "DATE_RANGE"
}

export enum AggregationDateBucket {
    MILLISECOND = "MILLISECOND",
    SECOND = "SECOND",
    MINUTE = "MINUTE",
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    QUARTER = "QUARTER",
    YEAR = "YEAR"
}

export type AggregationNumericRange = {
    name: string;
    lowInt?: number;
    lowFloat?: number;
    lowDouble?: number;
    lowLong?: number;
    highInt?: number;
    highFloat?: number;
    highDouble?: number;
    highLong?: number;
}

export type Index = {
    id?: string;
    name: string;
    displayName: string;
    description: string;
    version?: number;
    schema: Schema;
    analyzers?: Analyzer[];
}

export type Schema = {
    id?: string;
    properties: SchemaProperty[];
}

export type SchemaProperty = {
    id?: string;
    type: SchemaPropertyType;
    apiName: string;

    key?: string;
    displayName?: string;
    allowMultiple?: boolean;
    primaryKey?: boolean;
    title?: boolean;

    analyzer?: string;

    dims?: number;
    similarity?: string;
}

export enum SchemaPropertyType {
    INTEGER = "INTEGER",
    LONG = "LONG",
    TEXT = "TEXT",
    FLOAT = "FLOAT",
    DOUBLE = "DOUBLE",
    GEO_POINT = "GEO_POINT",
    DATE = "DATE",
    KEYWORDS = "KEYWORDS",
    OBJECT = "OBJECT",
    VECTOR = "VECTOR",
    BOOLEAN = "BOOLEAN",
    SEARCH_AS_YOU_TYPE = "SEARCH_AS_YOU_TYPE"
}

export type Analyzer = {
    id?: string;
    name: string;
    type?: string;
    tokenizer: string;
    filter?: string[];
}

export type SearchDocument = Record<string, unknown>;

export type SearchStats = {
    uuid?: string;
    health?: string;
    status?: string;
    primaries?: {
        docs?: {
            count?: number;
            deleted?: number;
        };
        store?: {
            size_in_bytes?: number;
            total_data_set_size_in_bytes?: number;
            reserved_in_bytes?: number;
        };
        indexing?: {
            index_total?: number;
            index_time_in_millis?: number;
            index_current?: number;
            index_failed?: number;
            delete_total?: number;
            delete_time_in_millis?: number;
            delete_current?: number;
        };
        search?: {
            open_contexts?: number;
            query_total?: number;
            query_time_in_millis?: number;
            query_current?: number;
            fetch_total?: number;
            fetch_time_in_millis?: number;
            fetch_current?: number;
        };
    };
    total?: {
        docs?: {
            count?: number;
            deleted?: number;
        };
        store?: {
            size_in_bytes?: number;
            total_data_set_size_in_bytes?: number;
            reserved_in_bytes?: number;
        };
        indexing?: {
            index_total?: number;
            index_time_in_millis?: number;
            index_current?: number;
            index_failed?: number;
            delete_total?: number;
            delete_time_in_millis?: number;
            delete_current?: number;
        };
        search?: {
            open_contexts?: number;
            query_total?: number;
            query_time_in_millis?: number;
            query_current?: number;
            fetch_total?: number;
            fetch_time_in_millis?: number;
            fetch_current?: number;
        };
    };
};

export type HttpStatus =
    | "ACCEPTED"
    | "OK"
    | "CREATED"
    | "NO_CONTENT"
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "INTERNAL_SERVER_ERROR"
    | string;

export type QueryResponse<TDocument = SearchDocument> = {
    result?: TDocument[];
    count?: number;
    query?: Query;
    aggregations?: Record<string, unknown>;
    [key: string]: unknown;
}

export type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export class BlueOrangeSearch {

    protected baseUrl: string;
    protected authCookie: string;

    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    protected request<T>(
        method: "GET" | "POST" | "DELETE",
        path: string,
        body?: unknown
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const authToken = Cookies.get(this.authCookie);

            xhr.open(method, this.baseUrl + path);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);

            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (!xhr.responseText) {
                        resolve(undefined as T);
                        return;
                    }
                    try {
                        const response: T = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        resolve(xhr.responseText as unknown as T);
                    }
                } else {
                    try {
                        const response = JSON.parse(xhr.response);
                        reject(response.details ?? response.message ?? response);
                    } catch (e) {
                        reject(xhr.responseText);
                    }
                }
            };

            xhr.onerror = function() {
                reject(`Network error while attempting to call ${method} ${path}`);
            };

            if (body === undefined) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(body));
            }
        });
    }

    search<TDocument = SearchDocument>(query: Query): Promise<QueryResponse<TDocument>> {
        return this.request<QueryResponse<TDocument>>("POST", "/api/v1/search", query);
    }

    createIndex(index: Index): Promise<Index> {
        return this.request<Index>("POST", "/api/v1/create/index", index);
    }

    createIndexSilent(index: Index): Promise<HttpStatus> {
        return this.request<HttpStatus>("POST", "/api/v1/create/index/silent", index);
    }

    createMigrateIndex(index: Index): Promise<Index> {
        return this.request<Index>("POST", "/api/v1/create/migrate/index", index);
    }

    createMigrateIndexSilent(index: Index): Promise<HttpStatus> {
        return this.request<HttpStatus>("POST", "/api/v1/create/migrate/index/silent", index);
    }

    deleteIndex(name: string): Promise<HttpStatus> {
        return this.request<HttpStatus>(
            "DELETE",
            `/api/v1/delete/index/${encodeURIComponent(name)}`
        );
    }

    getIndex(name: string): Promise<Index> {
        return this.request<Index>(
            "GET",
            `/api/v1/index/get/${encodeURIComponent(name)}`
        );
    }

    indexDocument(name: string, document: SearchDocument): Promise<HttpStatus> {
        return this.request<HttpStatus>(
            "POST",
            `/api/v1/index/${encodeURIComponent(name)}/document`,
            document
        );
    }

    indexDocumentsBulk(name: string, documents: SearchDocument[]): Promise<HttpStatus> {
        return this.request<HttpStatus>(
            "POST",
            `/api/v1/index/${encodeURIComponent(name)}/document/bulk`,
            documents
        );
    }

    deleteDocument(name: string, objId: string): Promise<HttpStatus> {
        return this.request<HttpStatus>(
            "POST",
            `/api/v1/index/delete/${encodeURIComponent(name)}/${encodeURIComponent(objId)}`
        );
    }

    getIndexSearchStats(name: string): Promise<SearchStats> {
        return this.request<SearchStats>(
            "GET",
            `/api/v1/index/${encodeURIComponent(name)}/stats/search`
        );
    }

    getAllIndexSearchStats(): Promise<SearchStats> {
        return this.request<SearchStats>("GET", `/api/v1/index/stats/search`);
    }

    searchAllIndexes(query: string = "", page: number = 0, size: number = 20): Promise<Page<Index>> {
        const params = new URLSearchParams({
            query,
            page: page.toString(),
            size: size.toString()
        });
        return this.request<Page<Index>>("GET", `/api/v1/indexes/search?${params.toString()}`);
    }
}

export class BlueOrangeSearchQuery extends BlueOrangeSearch {
}

export class BlueOrangeIndexSchema extends BlueOrangeSearch {
    create(index: Index): Promise<Index> {
        return this.createIndex(index);
    }
}
