import Cookies from "js-cookie";

export enum RuleGroupType {
    DEFAULT = "DEFAULT",
    IF_THEN_ELSE = "IF_THEN_ELSE",
    SCORED = "SCORED"
}

export enum RuleGroupFireType {
    LIVE = "LIVE",
    TEST = "TEST"
}

export enum RuleType {
    IF = "IF",
    ELSE_IF = "ELSE_IF",
    ELSE = "ELSE",
    CONDITION = "CONDITION",
    WEIGHTED = "WEIGHTED"
}

export enum RuleState {
    ACTIVE = "ACTIVE",
    TESTING = "TESTING",
    INACTIVE = "INACTIVE"
}

export enum RuleOutputStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    SCHEMA_VALIDATION_ERROR = "SCHEMA_VALIDATION_ERROR"
}

export enum ConditionType {
    LEAF = "LEAF",
    GROUP = "GROUP"
}

export enum LogicalOperand {
    AND = "AND",
    OR = "OR",
    EMPTY = "EMPTY"
}

export enum Operand {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    CONTAINS = "CONTAINS",
    ENDS_WITH = "ENDS_WITH",
    STARTS_WITH = "STARTS_WITH",
    REGEX = "REGEX",
    GREATER_THAN = "GREATER_THAN",
    GREATER_THAN_OR_EQUAL_TO = "GREATER_THAN_OR_EQUAL_TO",
    LESS_THAN = "LESS_THAN",
    LESS_THAN_OR_EQUAL_TO = "LESS_THAN_OR_EQUAL_TO",
    TRUE = "TRUE",
    FALSE = "FALSE",
    DATE_BEFORE_SPECIFIC = "DATE_BEFORE_SPECIFIC",
    DATE_BEFORE_RELATIVE = "DATE_BEFORE_RELATIVE",
    DATE_AFTER_SPECIFIC = "DATE_AFTER_SPECIFIC",
    DATE_AFTER_RELATIVE = "DATE_AFTER_RELATIVE",
    ARRAY_LENGTH_EQUAL = "ARRAY_LENGTH_EQUAL",
    ARRAY_LENGTH_GREATER_THAN = "ARRAY_LENGTH_GREATER_THAN",
    ARRAY_LENGTH_GREATER_THAN_OR_EQUAL = "ARRAY_LENGTH_GREATER_THAN_OR_EQUAL",
    ARRAY_LENGTH_LESS_THAN = "ARRAY_LENGTH_LESS_THAN",
    ARRAY_LENGTH_LESS_THAN_OR_EQUAL = "ARRAY_LENGTH_LESS_THAN_OR_EQUAL",
    ARRAY_CONTAINS = "ARRAY_CONTAINS",
    ARRAY_SUM_EQUAL = "ARRAY_SUM_EQUAL",
    ARRAY_SUM_GREATER_THAN = "ARRAY_SUM_GREATER_THAN",
    ARRAY_SUM_GREATER_THAN_OR_EQUAL = "ARRAY_SUM_GREATER_THAN_OR_EQUAL",
    ARRAY_SUM_LESS_THAN = "ARRAY_SUM_LESS_THAN",
    ARRAY_SUM_LESS_THAN_OR_EQUAL = "ARRAY_SUM_LESS_THAN_OR_EQUAL",
    ARRAY_MEDIAN_EQUAL = "ARRAY_MEDIAN_EQUAL",
    ARRAY_MEDIAN_GREATER_THAN = "ARRAY_MEDIAN_GREATER_THAN",
    ARRAY_MEDIAN_GREATER_THAN_OR_EQUAL = "ARRAY_MEDIAN_GREATER_THAN_OR_EQUAL",
    ARRAY_MEDIAN_LESS_THAN = "ARRAY_MEDIAN_LESS_THAN",
    ARRAY_MEDIAN_LESS_THAN_OR_EQUAL = "ARRAY_MEDIAN_LESS_THAN_OR_EQUAL",
    ARRAY_MEAN_EQUAL = "ARRAY_MEAN_EQUAL",
    ARRAY_MEAN_GREATER_THAN = "ARRAY_MEAN_GREATER_THAN",
    ARRAY_MEAN_GREATER_THAN_OR_EQUAL = "ARRAY_MEAN_GREATER_THAN_OR_EQUAL",
    ARRAY_MEAN_LESS_THAN = "ARRAY_MEAN_LESS_THAN",
    ARRAY_MEAN_LESS_THAN_OR_EQUAL = "ARRAY_MEAN_LESS_THAN_OR_EQUAL",
    ARRAY_CONTAINS_DATE_EQUAL = "ARRAY_CONTAINS_DATE_EQUAL",
    ARRAY_CONTAINS_SPECIFIC_DATE_BEFORE = "ARRAY_CONTAINS_SPECIFIC_DATE_BEFORE",
    ARRAY_CONTAINS_SPECIFIC_DATE_AFTER = "ARRAY_CONTAINS_SPECIFIC_DATE_AFTER",
    ARRAY_CONTAINS_RELATIVE_DATE_BEFORE = "ARRAY_CONTAINS_RELATIVE_DATE_BEFORE",
    ARRAY_CONTAINS_RELATIVE_DATE_AFTER = "ARRAY_CONTAINS_RELATIVE_DATE_AFTER",
    ARRAY_CONTAINS_STRING_STARTS_WITH = "ARRAY_CONTAINS_STRING_STARTS_WITH",
    ARRAY_CONTAINS_STRING_ENDS_WITH = "ARRAY_CONTAINS_STRING_ENDS_WITH",
    ARRAY_CONTAINS_STRING_CONTAINING = "ARRAY_CONTAINS_STRING_CONTAINING",
    ARRAY_CONTAINS_STRING_REGEX = "ARRAY_CONTAINS_STRING_REGEX",
    ARRAY_CONTAINS_OBJECT_PROPERTY = "ARRAY_CONTAINS_OBJECT_PROPERTY"
}

export type Condition = {
    id?: string;
    conditionType: ConditionType;
    logic: LogicalOperand;
    operand: Operand;
    negation: boolean;
    ignoreCase: boolean;
    variable: string;
    comparison: string;
    cast?: string;
    sub?: Condition | null;
    groupConditions: Condition[];
}

export type RuleGroup = {
    id?: string;
    type: RuleGroupType;
    name: string;
    description: string;
    expectedInput: Record<string, any>;
}

export type Rule = {
    id?: string;
    state: RuleState;
    rank: number;
    groupId: string;
    name: string;
    description: string;
    weight: number;
    type: RuleType;
    trueMessage: string;
    falseMessage: string;
    conditions: Condition[];
    lastEditor?: string;
    lastEdit?: string;
    expectedInput: Record<string, any>;
}

export type EvaluationResult = {
    conditionId: string;
    result: boolean;
}

export type RuleOutput = {
    status: RuleOutputStatus;
    fired: boolean;
    message: string;
    rule: Rule;
    results: EvaluationResult[];
}

export type RuleGroupFire = {
    type: RuleGroupFireType;
    group: RuleGroup;
    executionDate: string;
    ruleOutputs: RuleOutput[];
}

export type KeyValue = {
    key: string;
    value: any;
}

export type RuleGroupCreateRequest = {
    name: string;
    type: RuleGroupType;
    expectedInput: Record<string, any>;
}

export type RuleGroupFireRequest = {
    type: RuleGroupFireType;
    data: Record<string, any>;
}

export type RuleGroupSearchQuery = {
    query: string;
    page: number;
    size: number;
}

export type RuleGroupSearchResult = {
    results: RuleGroup[];
    count: number;
    query: RuleGroupSearchQuery;
}

export type RuleCreateRequest = {
    groupId: string;
    name: string;
}

export type RuleFireRequest = {
    ruleId: string;
    data: Record<string, any>;
}

export class Rules {

    private baseUrl: string;
    private authCookie: string;

    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    createRuleGroup(request: RuleGroupCreateRequest): Promise<RuleGroup> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/rules/group/create");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 201) {
                    const ruleGroup: RuleGroup = JSON.parse(xhr.responseText);
                    resolve(ruleGroup);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to create rule group');
            };
            xhr.send(JSON.stringify(request));
        });
    }

    updateRuleGroup(ruleGroup: RuleGroup): Promise<RuleGroup> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('PUT', this.baseUrl + "/api/rules/group/update");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const updatedRuleGroup: RuleGroup = JSON.parse(xhr.responseText);
                    resolve(updatedRuleGroup);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to update rule group');
            };
            xhr.send(JSON.stringify(ruleGroup));
        });
    }

    deleteRuleGroup(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('DELETE', this.baseUrl + "/api/rules/group/delete/" + id);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 202) {
                    resolve();
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to delete rule group');
            };
            xhr.send();
        });
    }

    searchRuleGroups(query: RuleGroupSearchQuery): Promise<RuleGroupSearchResult> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/rules/group/search");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const result: RuleGroupSearchResult = JSON.parse(xhr.responseText);
                    resolve(result);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to search rule groups');
            };
            xhr.send(JSON.stringify(query));
        });
    }

    fireRuleGroup(groupId: string, request: RuleGroupFireRequest): Promise<RuleGroupFire> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/rules/group/fire/" + groupId);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const result: RuleGroupFire = JSON.parse(xhr.responseText);
                    resolve(result);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to fire rule group');
            };
            xhr.send(JSON.stringify(request));
        });
    }

    createRule(request: RuleCreateRequest): Promise<Rule> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/rules/rule/create");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 201) {
                    const rule: Rule = JSON.parse(xhr.responseText);
                    resolve(rule);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to create rule');
            };
            xhr.send(JSON.stringify(request));
        });
    }

    updateRule(rule: Rule): Promise<Rule> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('PUT', this.baseUrl + "/api/rules/rule/update");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const updatedRule: Rule = JSON.parse(xhr.responseText);
                    resolve(updatedRule);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to update rule');
            };
            xhr.send(JSON.stringify(rule));
        });
    }

    deleteRule(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('DELETE', this.baseUrl + "/api/rules/rule/delete/" + id);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve();
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to delete rule');
            };
            xhr.send();
        });
    }

    fireRule(request: RuleFireRequest): Promise<RuleOutput> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/rules/rule/fire");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const result: RuleOutput = JSON.parse(xhr.responseText);
                    resolve(result);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to fire rule');
            };
            xhr.send(JSON.stringify(request));
        });
    }
}

export default Rules;
