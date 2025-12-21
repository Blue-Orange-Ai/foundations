import React, {createContext, ReactNode, useEffect, useRef, useState} from 'react';
import {Toaster, ToasterType} from "../toaster/Toaster";

import './ToastContext.css'

export interface ToastContextType {
    addToast: (toast: Toast) => void;
    updateToast: (id: string, updates: ToastUpdate) => void;
    removeToast: (id: string) => void;
    addPromiseToast: (options: PromiseToastOptions) => PromiseToastHandle;
}

const defaultContextValue: ToastContextType = {
    addToast: (toast: Toast) => {
        console.log("ADD toast default")
    },
    updateToast: (id: string, updates: ToastUpdate) => {},
    removeToast: (id: string) => {},
    addPromiseToast: (options: PromiseToastOptions) => {
        return {
            id: "",
            update: (updates: ToastUpdate) => {},
            close: () => {}
        }
    }
};

const ToastContext = createContext<ToastContextType>(defaultContextValue);

export enum ToastLocation {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    CENTRE_TOP,
    CENTRE_BOTTOM
}

export interface Toast {
    id: string,
    location: ToastLocation,
    ttl?: number,
    heading?: string,
    toastType: ToasterType,
    icon?: ReactNode,
    description?: string,
    action?: ReactNode,
    closeOnClick?: boolean,
    showCloseButton?: boolean
}

export type ToastUpdate = Partial<Omit<Toast, 'id' | 'location'>>;

export interface PromiseToastOptions {
    location: ToastLocation,
    heading?: string,
    toastType?: ToasterType,
    icon?: ReactNode,
    description?: string,
    action?: ReactNode
}

export interface PromiseToastHandle {
    id: string,
    update: (updates: ToastUpdate) => void,
    close: () => void
}

interface Props {
    children: ReactNode,
}

const ToastProvider: React.FC<Props> = ({ children }) => {

    const [, setToasts] = useState<Toast[]>([]);

    const [topLeftToasts, setTopLeftToasts] = useState<Toast[]>([]);

    const [topRightToasts, setTopRightToasts] = useState<Toast[]>([]);

    const [bottomLeftToasts, setBottomLeftToasts] = useState<Toast[]>([]);

    const [bottomRightToasts, setBottomRightToasts] = useState<Toast[]>([]);

    const [centreTopToasts, setCentreTopToasts] = useState<Toast[]>([]);

    const [centreBottomToasts, setCentreBottomToasts] = useState<Toast[]>([]);

    const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        return () => {
            Object.values(timeoutsRef.current).forEach((timeoutId) => clearTimeout(timeoutId));
            timeoutsRef.current = {};
        };
    }, []);

    const addToast = (toast: Toast) => {
        setToasts((prevToasts) => [...prevToasts, toast]);
        if (toast.location == ToastLocation.TOP_LEFT) {
            setTopLeftToasts((prevToasts) => [...prevToasts, toast])
        } else if (toast.location == ToastLocation.TOP_RIGHT) {
            setTopRightToasts((prevToasts) => [...prevToasts, toast])
        } else if (toast.location == ToastLocation.BOTTOM_LEFT) {
            setBottomLeftToasts((prevToasts) => [...prevToasts, toast])
        } else if (toast.location == ToastLocation.BOTTOM_RIGHT) {
            setBottomRightToasts((prevToasts) => [...prevToasts, toast])
        } else if (toast.location == ToastLocation.CENTRE_TOP) {
            setCentreTopToasts((prevToasts) => [...prevToasts, toast])
        } else if (toast.location == ToastLocation.CENTRE_BOTTOM) {
            setCentreBottomToasts((prevToasts) => [...prevToasts, toast])
        }
        if (toast.ttl) {
            const existingTimeout = timeoutsRef.current[toast.id];
            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }
            timeoutsRef.current[toast.id] = setTimeout(() => {
                removeToast(toast.id);
            }, toast.ttl);
        }
    };

    const updateToast = (id: string, updates: ToastUpdate) => {
        const hasTtlUpdate = Object.prototype.hasOwnProperty.call(updates, 'ttl');
        if (hasTtlUpdate) {
            const existingTimeout = timeoutsRef.current[id];
            if (existingTimeout) {
                clearTimeout(existingTimeout);
                delete timeoutsRef.current[id];
            }
            if (typeof updates.ttl === 'number') {
                timeoutsRef.current[id] = setTimeout(() => {
                    removeToast(id);
                }, updates.ttl);
            }
        }

        const applyUpdates = (toast: Toast) => {
            if (toast.id !== id) {
                return toast;
            }
            return {
                ...toast,
                ...updates
            };
        };

        setToasts((prevToasts) => prevToasts.map(applyUpdates));
        setTopLeftToasts((prevToasts) => prevToasts.map(applyUpdates));
        setTopRightToasts((prevToasts) => prevToasts.map(applyUpdates));
        setBottomLeftToasts((prevToasts) => prevToasts.map(applyUpdates));
        setBottomRightToasts((prevToasts) => prevToasts.map(applyUpdates));
        setCentreTopToasts((prevToasts) => prevToasts.map(applyUpdates));
        setCentreBottomToasts((prevToasts) => prevToasts.map(applyUpdates));
    }

    const removeToast = (id: string) => {
        const existingTimeout = timeoutsRef.current[id];
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            delete timeoutsRef.current[id];
        }
        setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
        setTopLeftToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
        setTopRightToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
        setBottomLeftToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
        setBottomRightToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
        setCentreTopToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
        setCentreBottomToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    };

    const generateToastId = () => {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return (crypto as any).randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    const addPromiseToast = (options: PromiseToastOptions): PromiseToastHandle => {
        const id = generateToastId();
        const toast: Toast = {
            id,
            location: options.location,
            toastType: options.toastType ?? ToasterType.DEFAULT,
            heading: options.heading,
            icon: options.icon,
            description: options.description,
            action: options.action,
            showCloseButton: false,
            closeOnClick: false
        }
        addToast(toast);

        return {
            id,
            update: (updates: ToastUpdate) => updateToast(id, updates),
            close: () => removeToast(id)
        }
    }

    return (
        <ToastContext.Provider value={{ addToast, updateToast, removeToast, addPromiseToast }}>
            {children}
            <div className="blue-orange-toast-container blue-orange-toast-container-top-left">
                {topLeftToasts.map(toast => (
                    <Toaster
                        key={toast.id}
                        location={toast.location}
                        icon={toast.icon}
                        heading={toast.heading}
                        description={toast.description}
                        action={toast.action}
                        toastType={toast.toastType}
                        ttl={toast.ttl}
                        closeOnClick={toast.closeOnClick}
                        showCloseButton={toast.showCloseButton}
                        onClose={() => removeToast(toast.id)} />
                ))}
            </div>
            <div className="blue-orange-toast-container blue-orange-toast-container-top-right">
                {topRightToasts.map(toast => (
                    <Toaster
                        key={toast.id}
                        location={toast.location}
                        icon={toast.icon}
                        heading={toast.heading}
                        description={toast.description}
                        action={toast.action}
                        toastType={toast.toastType}
                        ttl={toast.ttl}
                        closeOnClick={toast.closeOnClick}
                        showCloseButton={toast.showCloseButton}
                        onClose={() => removeToast(toast.id)} />
                ))}
            </div>
            <div className="blue-orange-toast-container blue-orange-toast-container-centre-top">
                {centreTopToasts.map(toast => (
                    <Toaster
                        key={toast.id}
                        location={toast.location}
                        icon={toast.icon}
                        heading={toast.heading}
                        description={toast.description}
                        action={toast.action}
                        toastType={toast.toastType}
                        ttl={toast.ttl}
                        closeOnClick={toast.closeOnClick}
                        showCloseButton={toast.showCloseButton}
                        onClose={() => removeToast(toast.id)} />
                ))}
            </div>
            <div className="blue-orange-toast-container blue-orange-toast-container-bottom-left">
                {bottomLeftToasts.map(toast => (
                    <Toaster
                        key={toast.id}
                        location={toast.location}
                        icon={toast.icon}
                        heading={toast.heading}
                        description={toast.description}
                        action={toast.action}
                        toastType={toast.toastType}
                        ttl={toast.ttl}
                        closeOnClick={toast.closeOnClick}
                        showCloseButton={toast.showCloseButton}
                        onClose={() => removeToast(toast.id)} />
                ))}
            </div>
            <div className="blue-orange-toast-container blue-orange-toast-container-bottom-right">
                {bottomRightToasts.map(toast => (
                    <Toaster
                        key={toast.id}
                        location={toast.location}
                        icon={toast.icon}
                        heading={toast.heading}
                        description={toast.description}
                        action={toast.action}
                        toastType={toast.toastType}
                        ttl={toast.ttl}
                        closeOnClick={toast.closeOnClick}
                        showCloseButton={toast.showCloseButton}
                        onClose={() => removeToast(toast.id)} />
                ))}
            </div>
            <div className="blue-orange-toast-container blue-orange-toast-container-centre-bottom">
                {centreBottomToasts.map(toast => (
                    <Toaster
                        key={toast.id}
                        location={toast.location}
                        icon={toast.icon}
                        heading={toast.heading}
                        description={toast.description}
                        action={toast.action}
                        toastType={toast.toastType}
                        ttl={toast.ttl}
                        closeOnClick={toast.closeOnClick}
                        showCloseButton={toast.showCloseButton}
                        onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export { ToastProvider, ToastContext };