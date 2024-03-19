import Cookies from "js-cookie";

export type AddRemoveUserToGroupRequest = {
    userId: number;
    groupName: string;
};

export type Address = {
    id?: number;
    country: string;
    city: string;
    state: string
    postcode: string;
    address: string;
};

export type PassportAvatar = {
    id?: number;
    uri: string;
    mediaId: number;
    enabled: boolean;
}

export type Group = {
    id?: number;
    name: string;
    serviceAccount: boolean;
    service: string;
    description: string;
    excludedUsers: Array<number>;
}

export type GroupDeleteRequest = {
    groupName: string
}

export type PublicUser = {
    name: string;
    username: string;
    color: string;
    avatar: PassportAvatar;
}

export type ServiceAccount = {
    id?: number;
    name: string;
    description: string;
    token: string;
    created: Date;
    lastUsed: Date;
}

export type SimpleTokenRequest = {
    token: string
}

export type SimpleTokenRequestWithGroups = {
    token: string;
    groups: Array<string>
}

export type Telephone = {
    id?: number;
    country: string;
    extension: string;
    format: string;
    code: string;
    number: string;
}

export type User = {
    id?: number;
    name: string;
    username: string;
    email: string;
    color: string;
    avatar: PassportAvatar | undefined;
    telephone: Telephone | undefined;
    address: Address | undefined;
    lastActive: Date;
    created: Date;
    locked: boolean;
    disabled: boolean;
    forcePasswordReset: boolean;
    domain: string;
    notes: string;
    serviceUser: boolean;
    defaultUser: boolean;
}

export type UserCreateRequest = {
    name?: string;
    username: string;
    email?: string;
    password: string;
    color?: string;
    avatar?: PassportAvatar;
    telephone?: Telephone;
    address?: Address;
    forcePasswordReset?: boolean;
    domain?: string;
    serviceUser?: boolean;
}

export type UserCreateWithGroupsRequest = {
    user: UserCreateRequest;
    groups: Array<string>
}

export type UserGroupValidationRequest = {
    userId: number;
    groups: Array<string>;
}

export type UserLoginRequest = {
    username: string;
    password: string;
}

export type UserLoginResponse = {
    token: string;
    forcePasswordReset: boolean;
}

export type UserTokenValidationRequest = {
    jwt: string;
    passwordReset: boolean;
    groups: Array<string>;
}

export enum SearchDirection {
    ASC,
    DESC
}

export enum UserSearchField {
    NAME,
    DOMAIN,
    CREATED,
    LAST_ACTIVE
}

export type UserSearchFilter = {
    direction: SearchDirection;
    field: UserSearchField;
}

export type UserSearchQuery = {
    query: string;
    page: number;
    size: number;
    filter?: UserSearchFilter;
}

export type UserSearchResult = {
    result: Array<User>;
    query: UserSearchQuery;
    count: number;
}

export enum GroupSearchField {
    NAME_DESCRIPTION,
    SERVICE
}

export type GroupSearchFilter = {
    direction: SearchDirection;
    field: GroupSearchField;
}

export type GroupSearchQuery = {
    query: string;
    page: number;
    size: number;
    filter?: GroupSearchFilter;
}

export type GroupSearchResult = {
    result: Array<Group>;
    query: GroupSearchResult;
    count: number;
}

export type AdminUpdatePasswordRequest = {
    password: string;
}

export type UserUpdatePassword = {
    oldPassword: string;
    newPassword: string;
}

export type UserGroup = {
    id: number;
    userId: number;
    groupId: number;
    groupName: string;
    inherited: boolean;
}

export type UserGroupSearchQuery = {
    query: string;
    page: number;
    size: number;
}

export type UserGroupSearchResult = {
    result: Array<UserGroup>;
    query: UserGroupSearchQuery;
    count: number;
}

export type AddRemoveGroupsToUserRequest = {
    groups: Array<number>;
    userId: number;
}

export class Passport {

    private baseUrl: string;
    private authCookie: string;
    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    login(loginRequest: UserLoginRequest): Promise<UserLoginResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.baseUrl + "/api/auth/login");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const userLoginResponse: UserLoginResponse = JSON.parse(xhr.responseText);
                    resolve(userLoginResponse);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(loginRequest));
        });
    }

    save(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('PUT', this.baseUrl + "/api/users/update");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const returnedUser: User = JSON.parse(xhr.responseText);
                    resolve(returnedUser);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(user));
        });
    }

    get(userId: number): Promise<User> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('GET', this.baseUrl + "/api/users/get/" + userId);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const user: User = JSON.parse(xhr.responseText);
                    resolve(user);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send();
        });
    }

    adminUpdatePassword(userId: number, password: AdminUpdatePasswordRequest): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/users/update/password/" + userId);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(true);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(password));
        });
    }

    updatePassword(passwordRequest: UserUpdatePassword): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/users/me/update/password");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(true);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(passwordRequest));
        });
    }

    adminDeleteUser(userId: number): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('DELETE', this.baseUrl + "/api/users/delete/" + userId);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(true);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send();
        });
    }

    adminGetUserGroups(userId: number, query: UserGroupSearchQuery): Promise<UserGroupSearchResult> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/users/get/groups/" + userId);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const ugsr: UserGroupSearchResult = JSON.parse(xhr.responseText);
                    resolve(ugsr);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(query));
        });
    }

    adminAddGroupsToUser(groupsToAdd: AddRemoveGroupsToUserRequest): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/groups/add/groups/user");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(true);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(groupsToAdd));
        });
    }

    adminRemoveGroupsFromUser(groupsToAdd: AddRemoveGroupsToUserRequest): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/groups/remove/groups/user");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(true);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(groupsToAdd));
        });
    }

    searchGroups(query: GroupSearchQuery): Promise<GroupSearchResult> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/groups/search/groups");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const groupSearchResult: GroupSearchResult = JSON.parse(xhr.responseText);
                    resolve(groupSearchResult);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(query));
        });
    }

    searchUsers(userSearchQuery: UserSearchQuery): Promise<UserSearchResult> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/users/search");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const userSearchResult: UserSearchResult = JSON.parse(xhr.responseText);
                    resolve(userSearchResult);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(userSearchQuery));
        });
    }

}


