import React, { createContext, useContext, useMemo, useEffect, useRef, ReactNode } from 'react';
import { Passport } from '@blue-orange-ai/foundations-clients';

const PASSPORT_CONFIG_URI_KEY = 'passport-config-uri';

interface PassportContextValue {
    passport: Passport;
    uri: string;
}

const PassportContext = createContext<PassportContextValue | null>(null);

// Module-level interception setup - runs immediately when module loads
let authFailureCallback: (() => void) | null = null;
let pendingAuthCheck = false;
const xhrUrlMap = new WeakMap<XMLHttpRequest, string>();
const originalXhrOpen = XMLHttpRequest.prototype.open;
const originalXhrSend = XMLHttpRequest.prototype.send;

const triggerAuthCheck = () => {
    if (authFailureCallback) {
        authFailureCallback();
    } else {
        pendingAuthCheck = true;
    }
};

const setAuthCallback = (callback: (() => void) | null) => {
    authFailureCallback = callback;
    if (callback && pendingAuthCheck) {
        pendingAuthCheck = false;
        callback();
    }
};

XMLHttpRequest.prototype.open = function(
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null
) {
    xhrUrlMap.set(this, url.toString());
    return originalXhrOpen.call(this, method, url, async, username, password);
};

XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
    const xhr = this;
    const requestUrl = xhrUrlMap.get(xhr) || '';
    
    const isCurrentUserRequest = requestUrl.includes('/api/users/me');
    const isLoginRequest = requestUrl.includes('/api/auth/login') || 
                           requestUrl.includes('/api/auth/register');

    if (!isCurrentUserRequest && !isLoginRequest) {
        xhr.addEventListener('loadend', function() {
            if (xhr.status === 401 || xhr.status === 403 || xhr.status === 0) {
                triggerAuthCheck();
            }
        });
    }

    return originalXhrSend.call(this, body);
};

interface PassportProviderProps {
    uri: string;
    authCookie?: string;
    children: ReactNode;
    loginPage?: string;
    retryDelay?: number;
    maxAttempts?: number;
}

export const PassportProvider: React.FC<PassportProviderProps> = ({ 
    uri, 
    authCookie = 'authorization',
    children,
    loginPage = '/login',
    retryDelay = 10,
    maxAttempts = 5
}) => {
    const isCheckingAuthRef = useRef(false);

    const passport = useMemo(() => {
        return new Passport(uri, authCookie);
    }, [uri, authCookie]);

    useEffect(() => {
        localStorage.setItem(PASSPORT_CONFIG_URI_KEY, uri);
    }, [uri]);

    useEffect(() => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const navigateToLogin = () => {
            if (window.location.pathname !== loginPage) {
                window.location.href = loginPage;
            }
        };

        const checkAuthWithRetry = async (): Promise<boolean> => {
            if (isCheckingAuthRef.current) {
                return true;
            }

            isCheckingAuthRef.current = true;

            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    await passport.currentUser();
                    isCheckingAuthRef.current = false;
                    return true;
                } catch (error: any) {
                    if (attempt < maxAttempts) {
                        await delay(retryDelay);
                    }
                }
            }

            isCheckingAuthRef.current = false;
            navigateToLogin();
            return false;
        };

        setAuthCallback(checkAuthWithRetry);

        return () => {
            setAuthCallback(null);
        };
    }, [passport, loginPage, maxAttempts, retryDelay]);

    const contextValue = useMemo(() => ({
        passport,
        uri
    }), [passport, uri]);

    return (
        <PassportContext.Provider value={contextValue}>
            {children}
        </PassportContext.Provider>
    );
};

export const usePassport = (): Passport => {
    const context = useContext(PassportContext);
    if (!context) {
        throw new Error('usePassport must be used within a PassportProvider');
    }
    return context.passport;
};

export const usePassportUri = (): string => {
    const context = useContext(PassportContext);
    if (!context) {
        throw new Error('usePassportUri must be used within a PassportProvider');
    }
    return context.uri;
};

export const getStoredPassportUri = (): string | null => {
    return localStorage.getItem(PASSPORT_CONFIG_URI_KEY);
};
