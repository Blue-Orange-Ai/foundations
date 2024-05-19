import React, {createContext, ReactNode, useContext, useState} from 'react';
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
    heading: string,
    toastType: ToasterType,
    icon?: ReactNode,
    description?: string,
    action?: ReactNode
}

interface Props {
    children: ReactNode,
}

const ToastProvider: React.FC<Props> = ({ children }) => {

    const [toasts, setToasts] = useState<Toast[]>([]);

    const [topLeftToasts, setTopLeftToasts] = useState<Toast[]>([]);

    const [topRightToasts, setTopRightToasts] = useState<Toast[]>([]);

    const [bottomLeftToasts, setBottomLeftToasts] = useState<Toast[]>([]);

    const [bottomRightToasts, setBottomRightToasts] = useState<Toast[]>([]);

    const addToast = (toast: Toast) => {
        setToasts([...toasts, toast]);
        if (toast.location == ToastLocation.TOP_LEFT) {
            setTopLeftToasts([...topLeftToasts, toast])
        } else if (toast.location == ToastLocation.TOP_RIGHT) {
            setTopRightToasts([...topRightToasts, toast])
        } else if (toast.location == ToastLocation.BOTTOM_LEFT) {
            setBottomLeftToasts([...bottomLeftToasts, toast])
        } else {
            setBottomRightToasts([...bottomRightToasts, toast])
        }
        if (toast.ttl) {
            var timeOut = setTimeout(() => {
                removeToast(toast.id);
                clearTimeout(timeOut);
            }, toast.ttl);
        }
    };

    const removeToast = (id: string) => {
        setToasts(toasts.filter(toast => toast.id !== id));
        setTopLeftToasts(topLeftToasts.filter(toast => toast.id !== id));
        setTopRightToasts(topRightToasts.filter(toast => toast.id !== id));
        setBottomLeftToasts(bottomLeftToasts.filter(toast => toast.id !== id));
        setBottomRightToasts(bottomRightToasts.filter(toast => toast.id !== id));
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
                        toastType={toast.toastType} onClose={() => removeToast(toast.id)} />
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
                        toastType={toast.toastType} onClose={() => removeToast(toast.id)} />
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
                        toastType={toast.toastType} onClose={() => removeToast(toast.id)} />
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
                        toastType={toast.toastType} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export { ToastProvider, ToastContext };