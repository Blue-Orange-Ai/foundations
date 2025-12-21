import React, {createContext, ReactNode, useEffect, useRef, useState} from 'react';
import {Toaster, ToasterType} from "../toaster/Toaster";

import './ToastContext.css'

export interface ToastContextType {
    addToast: (toast: Toast) => void;
    removeToast: (id: string) => void;
}

const defaultContextValue: ToastContextType = {
    addToast: (toast: Toast) => {
        console.log("ADD toast default")
    },
    removeToast: (id: string) => {}
};

const ToastContext = createContext<ToastContextType>(defaultContextValue);

export enum ToastLocation {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

export interface Toast {
    id: string,
    location: ToastLocation,
    ttl?: number,
    heading?: string,
    toastType: ToasterType,
    icon?: ReactNode,
    description?: string,
    action?: ReactNode
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
        } else {
            setBottomRightToasts((prevToasts) => [...prevToasts, toast])
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
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
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
                        onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export { ToastProvider, ToastContext };