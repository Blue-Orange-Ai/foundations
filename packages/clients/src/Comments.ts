import Cookies from "js-cookie";
import {Media} from "./BlueOrangeMedia";

export enum CommentType {
    CREATE="CREATE",
    UPDATE="UPDATE",
    RECALL="RECALL",
    DELETE="DELETE"
}

export type Comment = {
    id?: string;
    topic: string;
    referenceId: string,
    userId: string,
    tags: Array<string>,
    created: Date,
    edited: boolean,
    lastModified: Date,
    text: string,
    files: Array<Media>,
    mentions: Array<String>,
    type: CommentType
}

export class Comments {

    private static instance: Comments;

    private baseUrl: string;
    private authCookie: string;

    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    public static getInstance(baseUrl: string, authCookie: string = "authorization"): Comments {
        if (!Comments.instance) {
            Comments.instance = new Comments(baseUrl, authCookie);
        }
        return Comments.instance;
    }

    get(topic: string): Promise<Comment[]> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('GET', this.baseUrl + "/api/v1/comments/get/" + topic);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const returnedComments: Comment[] = JSON.parse(xhr.responseText);
                    resolve(returnedComments);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to get all comments');
            };
            xhr.send();
        });
    }

    create(comment: Comment): Promise<Comment> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/comments/create");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const returnedComment: Comment = JSON.parse(xhr.responseText);
                    resolve(returnedComment);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to create a comment');
            };
            xhr.send(JSON.stringify(comment));
        });
    }

    update(comment: Comment): Promise<Comment> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('POST', this.baseUrl + "/api/v1/comments/update");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const returnedComment: Comment = JSON.parse(xhr.responseText);
                    resolve(returnedComment);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to update a comment');
            };
            xhr.send(JSON.stringify(comment));
        });
    }

    delete(comment: Comment): Promise<Comment> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('DELETE', this.baseUrl + "/api/v1/comments/delete/" + comment.id);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const returnedComment: Comment = JSON.parse(xhr.responseText);
                    resolve(returnedComment);
                } else {
                    var response =JSON.parse(xhr.response);
                    reject(response);
                }
            };
            xhr.onerror = function() {
                reject('Network error while attempting to delete a comment');
            };
            xhr.send();
        });
    }


}