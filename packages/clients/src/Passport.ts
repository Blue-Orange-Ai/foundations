import Cookies from "js-cookie";

export type AddGroup = {
    id?: string;
    name?: string;
    permission: GroupPermission
}

export type AddRemoveGroupsToMemberRequest = {
    groups: Array<AddGroup>;
    memberId: string;
}

export type AddRemoveMembersToGroupRequest = {
    members: Array<SimpleGroupMember>;
    name?: string;
    id?: string;
}

export type AddRemoveMemberToGroupRequest = {
    member: SimpleGroupMember;
    groupName: string;
}

export type Address = {
    id?: string;
    country: string | undefined | null;
    city: string | undefined | null;
    state: string | undefined | null;
    postcode: string | undefined | null;
    address: string | undefined | null;
};

export type Avatar = {
    id?: string;
    uri: string | undefined | null;
    mediaId: number | undefined | null;
    enabled: boolean | undefined | null;
}

export type ExcludeUserRequest = {
    userId: string
}

export type Group = {
    id?: string;
    name: string;
    serviceAccount: boolean;
    service: string;
    description: string;
    externallyManaged: boolean;
    excludedUsers: Array<number>;
}

export type GroupDeleteRequest = {
    groupName: string
}

export enum GroupPermission {
    OWNER="OWNER",
    EDITOR="EDITOR",
    READ="READ"
}

export enum GroupSearchField {
    NAME_DESCRIPTION="NAME_DESCRIPTION",
    SERVICE="SERVICE"
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
    query: GroupSearchQuery;
    count: number;
}

export type PublicUser = {
    name: string;
    username: string;
    color: string;
    avatar: Avatar;
}

export enum SearchDirection {
    ASC="ASC",
    DESC="DESC"
}

export type ServiceAccount = {
    id?: string;
    name: string;
    description: string;
    token: string;
    created: Date;
    lastUsed: Date;
}

export type SimpleGroupMember = {
    memberId: string
}

export type SimpleTokenRequest = {
    token: string,
    groups?: Array<string>,
    permission?: Array<GroupPermission>
}

export type Telephone = {
    id?: string;
    country: string | undefined | null;
    extension: string | undefined | null;
    format: string | undefined | null;
    code: string | undefined | null;
    number: string | undefined | null;
}

export type User = {
    id?: string;
    name: string;
    username: string;
    email: string;
    color: string;
    avatar: Avatar | undefined;
    telephone: Telephone | undefined;
    address: Address | undefined;
    lastActive: Date;
    created: Date;
    state: UserState;
    forcePasswordReset: boolean;
    domain: string;
    notes: string;
    serviceUser: boolean;
    defaultUser: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    addressVerified: boolean;
}

export type UserCreateRequest = {
    name?: string;
    username: string;
    email?: string;
    password: string;
    color?: string;
    avatar?: Avatar;
    telephone?: Telephone;
    address?: Address;
    forcePasswordReset?: boolean;
    domain?: string;
    serviceUser?: boolean;
}

export type UserCreateWithGroupsRequest = {
    user: UserCreateRequest;
    groups: Array<AddGroup>
}

export type UserGroupValidationRequest = {
    userId: string;
    groups: Array<string>;
    permission: GroupPermission;
}

export type UserLoginRequest = {
    username: string;
    password: string;
    domain: string;
}

export type UserLoginResponse = {
    token: string;
    forcePasswordReset: boolean;
    expiry: Date
}

export enum UserState {
    ACTIVE="ACTIVE",
    LOCKED="LOCKED",
    DISABLED="DISABLED",
    DELETED="DELETED"
}

export type UserTokenValidationRequest = {
    jwt: string;
    passwordReset: boolean;
    groups: Array<string>;
    permission: GroupPermission;
}

export enum UserSearchField {
    NAME="NAME",
    DOMAIN="DOMAIN",
    CREATED="CREATED",
    LAST_ACTIVE="LAST_ACTIVE"
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

export type AdminUpdatePasswordRequest = {
    password: string;
}

export type UserUpdatePassword = {
    oldPassword: string;
    newPassword: string;
}

export type UserGroup = {
    id: string;
    userId: string;
    groupId: string;
    groupName: string;
    inherited: boolean;
    inheritedGroup: string;
    externallyManaged: boolean;
    permission: GroupPermission;
    inheritance: Array<string>;
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

export class Passport {

    private baseUrl: string;
    private authCookie: string;
    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    register(userCreateRequest: UserCreateRequest): Promise<User> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.baseUrl + "/api/users/create/public");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const userResponse: User = JSON.parse(xhr.responseText);
                    resolve(userResponse);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(userCreateRequest));
        });
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
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(loginRequest));
        });
    }

    create(userCreateRequest: UserCreateRequest): Promise<User> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/users/create");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const userResponse: User = JSON.parse(xhr.responseText);
                    resolve(userResponse);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(userCreateRequest));
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

    saveCurrentUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('PUT', this.baseUrl + "/api/users/me/update");
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

    currentUser(): Promise<User> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('GET', this.baseUrl + "/api/users/me");
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

    get(userId: string): Promise<User> {
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

    adminUpdatePassword(userId: string, password: AdminUpdatePasswordRequest): Promise<Boolean> {
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

    updateCurrentUserPassword(passwordRequest: UserUpdatePassword): Promise<Boolean> {
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

    deleteCurrentAccount(): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('DELETE', this.baseUrl + "/api/users/me/delete");
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

    adminDeleteUser(userId: string): Promise<Boolean> {
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

    currentUserGetUserGroups(query: UserGroupSearchQuery): Promise<UserGroupSearchResult> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/users/me/groups");
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

    adminGetUserGroups(userId: string, query: UserGroupSearchQuery): Promise<UserGroupSearchResult> {
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

    adminAddGroupsToUser(groupsToAdd: AddRemoveGroupsToMemberRequest): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/groups/add/groups/member");
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

    adminRemoveGroupsFromUser(groupsToAdd: AddRemoveGroupsToMemberRequest): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/groups/remove/groups/member");
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

    verifyCurrentUserGroupMembership(userGroupValidationRequest: UserGroupValidationRequest): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/users/me/verify/group/membership");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const membership: Boolean = xhr.responseText.toLowerCase() == "true";
                    resolve(membership);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.details);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(userGroupValidationRequest));
        });
    }

}


