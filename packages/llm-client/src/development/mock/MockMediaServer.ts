// ---------------------------------------------------------------------------
// MockMediaServer — a fake BlueOrangeMedia storage service.
//
// Attachments in the composer go through the real `BlueOrangeMedia` client,
// which presigns over `fetch` and then uploads over `XMLHttpRequest`. This mock
// answers both halves for its own base URL only (anything else passes straight
// through), so files can be attached, watched uploading, previewed in the
// transcript and re-rendered after a reload — with no storage service running.
// ---------------------------------------------------------------------------

import { Media } from '@blue-orange-ai/foundations-clients';

import { getMockSettings, LATENCY_PROFILE } from './MockSettings';

const byId = new Map<number, Media>();
const byUuid = new Map<string, Media>();
const pendingUploads = new Map<string, { folder: string; mediaPublic: boolean }>();

let nextId = 5000;
let nextToken = 1;

const mediaTypeFor = (contentType: string): string => {
    if (contentType.startsWith('image/')) return 'IMAGE';
    if (contentType === 'application/pdf') return 'PDF';
    if (contentType.startsWith('video/')) return 'VIDEO';
    if (contentType.startsWith('audio/')) return 'AUDIO';
    return 'FILE';
};

const uuid = (): string =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const random = (Math.random() * 16) | 0;
        const value = char === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });

/**
 * Small files become data URLs so a persisted session still renders its
 * attachments after a page reload; anything larger falls back to an object URL
 * (fine for the lifetime of the tab).
 */
const toDisplayUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
        if (file.size > 4 * 1024 * 1024) {
            resolve(URL.createObjectURL(file));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => resolve(URL.createObjectURL(file));
        reader.readAsDataURL(file);
    });

const registerMedia = (file: File, url: string, folder: string, mediaPublic: boolean): Media => {
    const id = nextId++;
    const media: Media = {
        id,
        uuid: uuid(),
        location: `mock/${folder}/${file.name}`,
        filename: file.name,
        folder,
        bucketname: 'mock-bucket',
        mediaType: mediaTypeFor(file.type || ''),
        dateCreated: new Date(),
        url,
        mediaPublic,
        fragments: [],
    };
    byId.set(id, media);
    byUuid.set(media.uuid, media);
    return media;
};

// -- fetch half: presign + delete ------------------------------------------

const text = (body: string, status = 200): Response =>
    new Response(body, { status, headers: { 'Content-Type': 'text/plain' } });

/** Handle a `fetch` aimed at the mock media service; `null` when unrecognised. */
export const handleMediaRequest = (baseUrl: string, path: string, init?: RequestInit): Response | null => {
    const method = (init?.method || 'GET').toUpperCase();

    if (method === 'POST' && path === '/api/v1/presign/get/upload') {
        let folder = 'mock';
        let mediaPublic = false;
        try {
            const body = JSON.parse(typeof init?.body === 'string' ? init.body : '{}');
            folder = body.folder || folder;
            mediaPublic = Boolean(body.mediaPublic);
        } catch {
            /* defaults are fine */
        }
        const token = `upload-${nextToken++}`;
        pendingUploads.set(token, { folder, mediaPublic });
        return text(`${baseUrl}/api/v1/mock/upload/${token}`);
    }

    if (method === 'POST' && path === '/api/v1/presign/get/download') {
        try {
            const body = JSON.parse(typeof init?.body === 'string' ? init.body : '{}');
            const media = byUuid.get(body.uuid);
            if (media) return text(media.url);
        } catch {
            /* fall through to 404 */
        }
        return text('not found', 404);
    }

    if (method === 'DELETE' && path.startsWith('/api/v1/storage/delete/')) {
        const key = path.replace('/api/v1/storage/delete/', '').replace('id/', '');
        const media = byUuid.get(key) || byId.get(Number(key));
        if (media) {
            byUuid.delete(media.uuid);
            if (media.id != null) byId.delete(media.id);
        }
        return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return null;
};

// -- XMLHttpRequest half: the upload PUT and the media GET -----------------

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Replace `XMLHttpRequest` with a subclass that fakes the two calls
 * `BlueOrangeMedia` makes over XHR — the multipart upload PUT and the
 * `/storage/get/{id}` lookup — for the mock base URL, and delegates everything
 * else to the real implementation.
 *
 * `BlueOrangeMedia` drives XHR through the `onload` / `onerror` /
 * `upload.onprogress` handler properties, so the mock calls those directly
 * rather than dispatching synthetic events.
 */
export const installMediaXhr = (
    baseUrl: string,
    scope: Record<string, any> = window as unknown as Record<string, any>,
): (() => void) => {
    const Original: typeof XMLHttpRequest = scope.XMLHttpRequest;

    class MockXhr extends Original {
        private mockUrl: string | null = null;
        private mockMethod = 'GET';

        open(
            method: string,
            url: string | URL,
            async?: boolean,
            username?: string | null,
            password?: string | null,
        ): void {
            const asString = typeof url === 'string' ? url : url.toString();
            if (asString.startsWith(baseUrl)) {
                this.mockMethod = method.toUpperCase();
                this.mockUrl = asString;
                return;
            }
            this.mockUrl = null;
            super.open(method, asString, async !== false, username, password);
        }

        setRequestHeader(name: string, value: string): void {
            // The real request was never opened for mocked URLs, so setting a
            // header would throw InvalidStateError.
            if (this.mockUrl) return;
            super.setRequestHeader(name, value);
        }

        send(body?: Document | XMLHttpRequestBodyInit | null): void {
            if (!this.mockUrl) {
                super.send(body);
                return;
            }
            void this.respond(body);
        }

        private settle(status: number, responseText: string): void {
            const define = (key: string, value: unknown) =>
                Object.defineProperty(this, key, { value, configurable: true, writable: true });
            define('status', status);
            define('statusText', status === 200 ? 'OK' : 'Error');
            define('responseText', responseText);
            define('response', responseText);
            define('readyState', 4);
            this.onload?.call(this as unknown as XMLHttpRequest, new ProgressEvent('load'));
        }

        private fail(message: string): void {
            const define = (key: string, value: unknown) =>
                Object.defineProperty(this, key, { value, configurable: true, writable: true });
            define('status', 500);
            define('statusText', message);
            define('responseText', JSON.stringify({ details: message }));
            define('response', JSON.stringify({ details: message }));
            define('readyState', 4);
            this.onerror?.call(this as unknown as XMLHttpRequest, new ProgressEvent('error'));
        }

        private async respond(body?: Document | XMLHttpRequestBodyInit | null): Promise<void> {
            const url = this.mockUrl as string;
            const path = url.slice(baseUrl.length);
            const pacing = LATENCY_PROFILE[getMockSettings().latency];

            // The upload itself: report progress, then return the stored Media.
            const upload = path.match(/^\/api\/v1\/mock\/upload\/(.+)$/);
            if (this.mockMethod === 'PUT' && upload) {
                const params = pendingUploads.get(upload[1]) || { folder: 'mock', mediaPublic: false };
                pendingUploads.delete(upload[1]);
                const file = body instanceof FormData ? (body.get('file') as File | null) : null;
                if (!file) {
                    this.fail('No file in the upload body');
                    return;
                }

                const total = Math.max(file.size, 1);
                const steps = 8;
                const stepDelay = Math.max(20, Math.round((pacing.action * 1.2) / steps));
                for (let step = 1; step <= steps; step += 1) {
                    await wait(stepDelay);
                    this.upload?.onprogress?.call(
                        this as unknown as XMLHttpRequest,
                        new ProgressEvent('progress', {
                            lengthComputable: true,
                            loaded: Math.round((total * step) / steps),
                            total,
                        }),
                    );
                }

                const displayUrl = await toDisplayUrl(file);
                const media = registerMedia(file, displayUrl, params.folder, params.mediaPublic);
                // eslint-disable-next-line no-console
                console.debug('[mock-media] uploaded', { filename: media.filename, uuid: media.uuid, id: media.id });
                this.settle(200, JSON.stringify(media));
                return;
            }

            const get = path.match(/^\/api\/v1\/storage\/get\/(\d+)$/);
            if (this.mockMethod === 'GET' && get) {
                await wait(Math.max(20, Math.round(pacing.firstByte / 3)));
                const media = byId.get(Number(get[1]));
                if (!media) {
                    this.fail('Media not found');
                    return;
                }
                this.settle(200, JSON.stringify(media));
                return;
            }

            this.fail(`Unhandled mock media request: ${this.mockMethod} ${path}`);
        }
    }

    scope.XMLHttpRequest = MockXhr as unknown as typeof XMLHttpRequest;
    if (typeof window !== 'undefined' && (window as unknown as Record<string, any>) !== scope) {
        (window as unknown as Record<string, any>).XMLHttpRequest = MockXhr;
    }
    return () => {
        scope.XMLHttpRequest = Original;
        if (typeof window !== 'undefined' && (window as unknown as Record<string, any>) !== scope) {
            (window as unknown as Record<string, any>).XMLHttpRequest = Original;
        }
    };
};
