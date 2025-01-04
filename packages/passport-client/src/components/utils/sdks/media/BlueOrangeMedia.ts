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
    groups: Array<string>;
};


class BlueOrangeMedia {
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

    async getPresigned(media: Media): Promise<string> {
        return this.getPresignedWithToken(this.getCookie(this.authCookie), media);
    }

    async getPresignedWithToken(authToken: string | null, media: Media, durationMinutes?: number): Promise<string> {
        const payload = {
            uuid: media.uuid,
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

    uploadFile(file: File, mediaPublic: boolean, folder: string, groups: string[], onProgress: (percentComplete: number) => void): Promise<Media> {
        return this.uploadFileWithToken(this.getCookie(this.authCookie), file, mediaPublic, folder, groups, onProgress);
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

    uploadFileWithToken(authToken: string | null, file: File, mediaPublic: boolean, folder: string, groups: string[], onProgress: (percentComplete: number) => void): Promise<Media> {
        return new Promise(async (resolve, reject) => {
            try {
                const payload = {
                    mediaPublic: mediaPublic,
                    folder: folder,
                    groups: groups
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

export default BlueOrangeMedia;