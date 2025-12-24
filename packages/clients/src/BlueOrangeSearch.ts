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
    lng: number;
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

export class BlueOrangeSearch {

    protected baseUrl: string;
    protected authCookie: string;

    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    search<T = any>(query: Query): Promise<T> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/search");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response: T = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    try {
                        var response = JSON.parse(xhr.response);
                        reject(response.details ?? response.message ?? response);
                    } catch (e) {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to perform search');
            };
            xhr.send(JSON.stringify({ Query: query }));
        });
    }

    createIndex<T = any>(index: Index): Promise<T> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/create/index");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response: T = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    try {
                        var response = JSON.parse(xhr.response);
                        reject(response.details ?? response.message ?? response);
                    } catch (e) {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to create index');
            };
            xhr.send(JSON.stringify({ Index: index }));
        });
    }
}

export class BlueOrangeSearchQuery extends BlueOrangeSearch {
}

export class BlueOrangeIndexSchema extends BlueOrangeSearch {
    create<T = any>(index: Index): Promise<T> {
        return this.createIndex(index);
    }
}
