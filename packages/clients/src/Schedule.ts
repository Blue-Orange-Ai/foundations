import Cookies from "js-cookie";

export enum RequestVerb {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export enum JobState {
    CREATING = "CREATING",
    RUNNING = "RUNNING",
    PAUSED = "PAUSED",
    DELETED = "DELETED"
}

export enum DeploymentType {
    MASTER = "MASTER",
    MASTER_SLAVE = "MASTER_SLAVE",
    SLAVE = "SLAVE"
}

export type ScheduleRequest = {
    name: string;
    group: string;
    webhook: string;
    verb: RequestVerb;
    fireOnce: boolean;
    limitFires: boolean;
    numFires: number;
    orgCode: string;
    scheduledTime: boolean;
    fireTime: string | null;
    cron: string | null;
    timeZone: string;
    payload: object;
}

export type ScheduleJob = {
    id: number;
    slave: string | null;
    slaveId: string | null;
    displayName: string;
    name: string;
    groupId: string;
    verb: RequestVerb;
    fireOnce: boolean;
    limitFires: boolean;
    numFires: number;
    totalFires: number;
    orgCode: string;
    jobType: string;
    uniqueKey: string;
    webhook: string;
    scheduledTime: boolean;
    fireTime: string | null;
    cron: string | null;
    timeZone: string;
    state: JobState;
    created: string;
    payload: object;
}

export type ScheduleJobUpdateRequest = {
    uniqueKey: string;
    name: string;
}

export type ScheduleResponseLog = {
    id: number;
    uniqueKey: string;
    created: string;
    success: boolean;
    request: object;
}

export type SchedulerResponse = {
    result: any;
    resultCode: string;
}

export type TriggerDetailsRequest = {
    name: string | null;
    group: string;
    fireTime: string | null;
    cron: string | null;
    timezone: string | null;
}

export type JobDetailRequest = {
    name: string;
    group: string;
    fireOnce: boolean;
    triggers: Array<TriggerDetailsRequest>;
    orgCode: string;
    jobType: string;
    uniqueKey: string;
    webhook: string;
    master: string;
    verb: RequestVerb;
    data: object;
}

export type SlaveRegisterRequest = {
    uri: string;
    uuid: string;
}

export type SlaveHeartbeatRequest = {
    uri: string;
    uuid: string;
}

export type SlaveDeactivateRequest = {
    uuid: string;
}

export type WebhookCallbackRequest = {
    uniqueKey: string;
    result: boolean;
    data: object;
}

export type ScheduleSlave = {
    id: number;
    uri: string;
    uuid: string;
    activeJobs: number;
    active: boolean;
    lastHeard: string;
}

export class Schedule {

    private baseUrl: string;
    private authCookie: string;

    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    createJob(scheduleRequest: ScheduleRequest): Promise<ScheduleJob> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/v1/job/create");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 201) {
                    const job: ScheduleJob = JSON.parse(xhr.responseText);
                    resolve(job);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to create job');
            };
            xhr.send(JSON.stringify(scheduleRequest));
        });
    }

    updateJob(updateRequest: ScheduleJobUpdateRequest): Promise<ScheduleJob> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/v1/job/update");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const job: ScheduleJob = JSON.parse(xhr.responseText);
                    resolve(job);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to update job');
            };
            xhr.send(JSON.stringify(updateRequest));
        });
    }

    deleteJob(uniqueKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('DELETE', this.baseUrl + "/api/v1/job/delete/" + uniqueKey);
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
                reject('Network error while attempting to delete job');
            };
            xhr.send();
        });
    }

    listJobs(group: string, page: number, size: number): Promise<Array<ScheduleJob>> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('GET', this.baseUrl + "/api/v1/job/get/" + group + "/" + page + "/" + size);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const jobs: Array<ScheduleJob> = JSON.parse(xhr.responseText);
                    resolve(jobs);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to list jobs');
            };
            xhr.send();
        });
    }

    getRequestAttempts(uniqueKey: string, page: number, size: number): Promise<Array<ScheduleResponseLog>> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('GET', this.baseUrl + "/api/v1/job/get/attampts/" + uniqueKey + "/" + page + "/" + size);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const logs: Array<ScheduleResponseLog> = JSON.parse(xhr.responseText);
                    resolve(logs);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to get request attempts');
            };
            xhr.send();
        });
    }

    countRequestAttempts(uniqueKey: string, page: number, size: number): Promise<number> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('GET', this.baseUrl + "/api/v1/job/count/attempts/" + uniqueKey + "/" + page + "/" + size);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const count: number = JSON.parse(xhr.responseText);
                    resolve(count);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to count request attempts');
            };
            xhr.send();
        });
    }

    createQuartzJob(jobGroup: string, jobDetail: JobDetailRequest): Promise<SchedulerResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/v1/scheduler/job-group/" + jobGroup + "/jobs");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 201) {
                    const response: SchedulerResponse = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to create Quartz job');
            };
            xhr.send(JSON.stringify(jobDetail));
        });
    }

    findQuartzJob(jobGroup: string, jobName: string): Promise<SchedulerResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('GET', this.baseUrl + "/api/v1/scheduler/job-group/" + jobGroup + "/jobs/" + jobName);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response: SchedulerResponse = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to find Quartz job');
            };
            xhr.send();
        });
    }

    updateQuartzJob(jobGroup: string, jobName: string, jobDetail: JobDetailRequest): Promise<SchedulerResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('PUT', this.baseUrl + "/api/v1/scheduler/job-group/" + jobGroup + "/jobs/" + jobName);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response: SchedulerResponse = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to update Quartz job');
            };
            xhr.send(JSON.stringify(jobDetail));
        });
    }

    deleteQuartzJob(jobGroup: string, jobName: string): Promise<SchedulerResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('DELETE', this.baseUrl + "/api/v1/scheduler/job-group/" + jobGroup + "/jobs/" + jobName);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response: SchedulerResponse = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to delete Quartz job');
            };
            xhr.send();
        });
    }

    pauseQuartzJob(jobGroup: string, jobName: string): Promise<SchedulerResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('PATCH', this.baseUrl + "/api/v1/scheduler/job-group/" + jobGroup + "/jobs/" + jobName + "/pause");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response: SchedulerResponse = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to pause Quartz job');
            };
            xhr.send();
        });
    }

    resumeQuartzJob(jobGroup: string, jobName: string): Promise<SchedulerResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('PATCH', this.baseUrl + "/api/v1/scheduler/job-group/" + jobGroup + "/jobs/" + jobName + "/resume");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response: SchedulerResponse = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to resume Quartz job');
            };
            xhr.send();
        });
    }

    registerSlave(request: SlaveRegisterRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/v1/slave/register");
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
                reject('Network error while attempting to register slave');
            };
            xhr.send(JSON.stringify(request));
        });
    }

    heartbeat(request: SlaveHeartbeatRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/v1/slave/heartbeat");
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
                reject('Network error while attempting to send heartbeat');
            };
            xhr.send(JSON.stringify(request));
        });
    }

    deactivateSlave(request: SlaveDeactivateRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/v1/slave/deactivate");
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
                reject('Network error while attempting to deactivate slave');
            };
            xhr.send(JSON.stringify(request));
        });
    }

    listSlaves(page: number, size: number): Promise<Array<ScheduleSlave>> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('GET', this.baseUrl + "/api/v1/slave/get/" + page + "/" + size);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const slaves: Array<ScheduleSlave> = JSON.parse(xhr.responseText);
                    resolve(slaves);
                } else {
                    var response = JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to list slaves');
            };
            xhr.send();
        });
    }

    webhookCallback(request: WebhookCallbackRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie);
            xhr.open('POST', this.baseUrl + "/api/v1/slave/webhook");
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
                reject('Network error while attempting to send webhook callback');
            };
            xhr.send(JSON.stringify(request));
        });
    }
}

export default Schedule;
