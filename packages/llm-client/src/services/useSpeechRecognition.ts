// ---------------------------------------------------------------------------
// useSpeechRecognition — dictation for the composer.
//
// Uses the browser's own Web Speech API (`SpeechRecognition`, prefixed
// `webkitSpeechRecognition` in Chrome/Safari) so voice capture needs no extra
// dependency. The API is not in TypeScript's DOM lib, so the small slice we use
// is typed locally rather than pulling in a types package.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SpeechAlternative {
    transcript: string;
}

interface SpeechResult {
    isFinal: boolean;
    length: number;
    [index: number]: SpeechAlternative;
}

interface SpeechResultList {
    length: number;
    [index: number]: SpeechResult;
}

interface SpeechResultEvent {
    resultIndex: number;
    results: SpeechResultList;
}

interface SpeechErrorEvent {
    error: string;
    message?: string;
}

interface SpeechRecognitionInstance {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechResultEvent) => void) | null;
    onerror: ((event: SpeechErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const getConstructor = (): SpeechRecognitionConstructor | undefined => {
    if (typeof window === 'undefined') return undefined;
    const scope = window as unknown as Record<string, any>;
    return scope.SpeechRecognition || scope.webkitSpeechRecognition;
};

export interface UseSpeechRecognitionArgs {
    language?: string;
    continuous?: boolean;
    interimResults?: boolean;
    /**
     * Called with everything heard since `start()`. `isFinal` is true once the
     * engine commits the phrase — interim text is provisional and may change.
     */
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
}

export interface UseSpeechRecognitionResult {
    /** False when the browser has no speech recognition (Firefox, most of the time). */
    supported: boolean;
    listening: boolean;
    error: string | null;
    start: () => void;
    stop: () => void;
    toggle: () => void;
}

export const useSpeechRecognition = ({
    language,
    continuous = true,
    interimResults = true,
    onResult,
    onError,
}: UseSpeechRecognitionArgs = {}): UseSpeechRecognitionResult => {
    const supported = useMemo(() => Boolean(getConstructor()), []);
    const [listening, setListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    // Keep the callbacks in refs so restarting is not needed when they change.
    const onResultRef = useRef(onResult);
    onResultRef.current = onResult;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    /** Text committed by the engine so far in this session. */
    const finalRef = useRef('');

    const stop = useCallback(() => {
        const recognition = recognitionRef.current;
        recognitionRef.current = null;
        setListening(false);
        if (!recognition) return;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        try {
            recognition.stop();
        } catch {
            /* already stopped */
        }
    }, []);

    const start = useCallback(() => {
        const Constructor = getConstructor();
        if (!Constructor || recognitionRef.current) return;

        const recognition = new Constructor();
        recognition.lang = language || document.documentElement.lang || 'en-US';
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;
        finalRef.current = '';
        setError(null);

        recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
                const result = event.results[i];
                const text = result[0]?.transcript || '';
                if (result.isFinal) {
                    finalRef.current = `${finalRef.current}${text}`;
                } else {
                    interim += text;
                }
            }
            const combined = `${finalRef.current}${interim}`.trim();
            // A committed phrase with nothing provisional after it is final.
            onResultRef.current?.(combined, interim.length === 0);
        };

        recognition.onerror = (event) => {
            // 'aborted' is what a normal stop() looks like — not worth surfacing.
            if (event.error && event.error !== 'aborted') {
                setError(event.error);
                onErrorRef.current?.(event.error);
            }
            stop();
        };

        recognition.onend = () => {
            // Fires when the engine gives up (silence, or non-continuous mode).
            if (recognitionRef.current === recognition) stop();
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
            setListening(true);
        } catch (err) {
            recognitionRef.current = null;
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
            onErrorRef.current?.(message);
        }
    }, [continuous, interimResults, language, stop]);

    const toggle = useCallback(() => {
        if (recognitionRef.current) {
            stop();
        } else {
            start();
        }
    }, [start, stop]);

    // Never leave the microphone open behind an unmounted composer.
    useEffect(() => stop, [stop]);

    return { supported, listening, error, start, stop, toggle };
};
