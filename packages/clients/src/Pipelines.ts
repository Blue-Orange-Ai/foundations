import Cookies from "js-cookie";
import {
    AddRemoveGroupsToMemberRequest, AddRemoveMembersToGroupRequest,
    AddRemoveMemberToGroupRequest,
    AdminUpdatePasswordRequest,
    ExcludeUserRequest,
    GetGroupRequest,
    Group, GroupDeleteRequest, GroupMemberSearchQuery, GroupMemberSearchResult,
    GroupSearchQuery,
    GroupSearchResult, SimpleGroupMember, UpdateMemberGroupPermission,
    UpdateUserGroupPermission,
    User,
    UserCreateRequest,
    UserGroupSearchQuery,
    UserGroupSearchResult,
    UserGroupValidationRequest,
    UserLoginRequest,
    UserLoginResponse,
    UserSearchQuery,
    UserSearchResult,
    UserUpdatePassword
} from "./Passport";

export type PipelineStageStaticData = {
    id: number,
    key: string,
    value: string
}

export type PipelineStageReMappings = {
    id: number,
    key: string,
    value: string
}

export type PipelineStage = {
    id: number,
    name: string,
    description: string,
    icon: string,
    deleted: boolean,
    deleteDate: Date,
    pipelineUuid: string,
    previousQueue: string,
    queue: string,
    defaultTarget: string,
    targets: string[],
    staticData: PipelineStageStaticData[],
    reMappings: PipelineStageReMappings[]
}

export type Pipeline = {
    uuid: string,
    name: string,
    stages: PipelineStage[]
}

export type CreatePipelineRequest = {
    pipeline: Pipeline,
    members: SimpleGroupMember[]
}

export class Pipelines {

    private baseUrl: string;
    private authCookie: string;
    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    create(createPipelineRequest: CreatePipelineRequest): Promise<Pipeline> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/pipelines/create");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const pipeline: Pipeline = JSON.parse(xhr.responseText);
                    resolve(pipeline);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(createPipelineRequest));
        });
    }

    update(pipeline: Pipeline): Promise<Pipeline> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/pipelines/update");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const update: Pipeline = JSON.parse(xhr.responseText);
                    resolve(update);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(pipeline));
        });
    }

    delete(pipeline: Pipeline): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('DELETE', this.baseUrl + "/api/v1/pipelines/delete/" + pipeline.uuid);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve();
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send();
        });
    }

    createStage(pipelineStage: PipelineStage): Promise<Pipeline> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/create/pipeline/stage");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const pipelineStageCreated: Pipeline = JSON.parse(xhr.responseText);
                    resolve(pipelineStageCreated);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(pipelineStage));
        });
    }

    updateStage(pipelineStage: PipelineStage): Promise<Pipeline> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/update/pipeline/stage");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const pipelineStageCreated: Pipeline = JSON.parse(xhr.responseText);
                    resolve(pipelineStageCreated);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response.message);
                }
            };
            xhr.onerror = function() {
                reject('Network error during upload');
            };
            xhr.send(JSON.stringify(pipelineStage));
        });
    }

}