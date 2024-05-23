import Cookies from "js-cookie";
import {GroupPermission, UserSearchResult} from "./Passport";

export type Media = {
    id?: number;
    uuid: string;
    location: string;
    filename: string;
    folder: string;
    bucketname: string;
    mediaType: string;
    dateCreated: Date;
    url: string;
    mediaPublic: boolean;
    fragments: Array<MediaFragment>;
};

export type MediaFragment = {
    id?: number;
    height: number;
    width: number;
    referenceId: number;
    referenceUuid: string;
    referenceUrl: string;
}

export type MediaPermission = {
    memberId?: string;
    groupName?: string;
    permission: GroupPermission;
}


export class BlueOrangeMedia {
    private baseUrl: string;
    private authCookie: string;

    constructor(baseUrl: string, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
    }

    private getCookie(name: string): string | null {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return value;
            }
        }
        return null;
    }

    public async getUrl(media: Media, durationInMinutes?: number, height?: number): Promise<string> {
        var fragment = this.findBestFragment(media, height);
        if (media.mediaPublic) {
            return fragment.referenceUrl;
        }
        return this.getPresigned(media, durationInMinutes);
    }

    public async getUrlFromMediaId(mediaId: number, durationInMinutes?: number, height?: number): Promise<string> {
        var media = await this.getMediaObj(mediaId);
        var fragment = this.findBestFragment(media, height);
        if (media.mediaPublic) {
            return fragment.referenceUrl;
        }
        return this.getPresigned(media, durationInMinutes);
    }

    public findBestFragment(media: Media, height?: number): MediaFragment {
        var chosenFragment: MediaFragment = {
            height: 0,
            referenceId: media.id ?? -1,
            referenceUrl: media.url,
            referenceUuid: media.uuid,
            width: 0
        }
        if (!height || media.mediaType.toLowerCase() != "image") {
            return chosenFragment;
        }
        media.fragments.forEach(fragment => {
            if (fragment.height > height && (fragment.height < chosenFragment.height || chosenFragment.height == 0)) {
                chosenFragment = fragment;
            }
        })
        return chosenFragment;
    }

    async getMediaObj(mediaId: number): Promise<Media> {
        return this.getMediaObjWithToken(this.getCookie(this.authCookie), mediaId);
    }

    async getMediaObjWithToken(authToken: string | null, mediaId: number): Promise<Media> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            var authToken = Cookies.get(this.authCookie)
            xhr.open('GET', this.baseUrl + '/api/v1/storage/get/' + mediaId);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', authToken == undefined ? "" : authToken);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const media: Media = JSON.parse(xhr.responseText);
                    resolve(media);
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

    async getPresigned(media: Media, durationMinutes?: number): Promise<string> {
        return this.getPresignedWithToken(this.getCookie(this.authCookie), media.uuid, durationMinutes);
    }

    async getPresignedWithToken(authToken: string | null, uuid: string, durationMinutes?: number): Promise<string> {
        const payload = {
            uuid: uuid,
            durationMinutes: durationMinutes
        };
        const response = await fetch(this.baseUrl + '/api/v1/presign/get/download', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken || ''
            }
        });

        if (!response.ok) {
            throw new Error('Failed to obtain pre-signed URL');
        }
        return response.text();
    }

    uploadFile(file: File, mediaPublic: boolean, folder: string, permissions: MediaPermission[], onProgress: (percentComplete: number) => void): Promise<Media> {
        return this.uploadFileWithToken(this.getCookie(this.authCookie), file, mediaPublic, folder, permissions, onProgress);
    }

    deleteWithToken(authToken: string | null, media: Media): Promise<Response> {
        return fetch(this.baseUrl + '/api/v1/storage/delete/' + media.uuid, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken || ''
            }
        });
    }

    deleteByIdWithToken(authToken: string | null, id: number): Promise<Response> {
        return fetch(this.baseUrl + '/api/v1/storage/delete/id/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken || ''
            }
        });
    }

    async delete(media: Media): Promise<Response> {
        return this.deleteWithToken(this.getCookie(this.authCookie), media);
    }

    async deleteById(id: number): Promise<Response> {
        return this.deleteByIdWithToken(this.getCookie(this.authCookie), id);
    }

    uploadFileWithToken(authToken: string | null, file: File, mediaPublic: boolean, folder: string, permissions: MediaPermission[], onProgress: (percentComplete: number) => void): Promise<Media> {
        return new Promise(async (resolve, reject) => {
            try {
                const payload = {
                    mediaPublic: mediaPublic,
                    folder: folder,
                    permissions: permissions
                };
                const response = await fetch(this.baseUrl + '/api/v1/presign/get/upload', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken || ''
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to obtain pre-signed URL');
                }
                const presignedUrl = await response.text();

                const xhr = new XMLHttpRequest();
                xhr.open('PUT', presignedUrl);
                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        onProgress(percentComplete);
                    }
                };
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const mediaObject: Media = JSON.parse(xhr.responseText);
                        resolve(mediaObject);
                    } else {
                        reject(new Error('Upload failed: ' + xhr.statusText));
                    }
                };
                xhr.onerror = function() {
                    reject(new Error('Network error during upload'));
                };
                var formData = new FormData();
                formData.append("file", file);
                xhr.send(formData);
            } catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
}