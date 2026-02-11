import React, { createContext, useContext, useMemo, useEffect, ReactNode } from 'react';
import { BlueOrangeSearch } from '@blue-orange-ai/foundations-clients';

const SEARCH_CONFIG_URI_KEY = 'search-config-uri';

interface SearchContextValue {
    searchClient: BlueOrangeSearch;
    uri: string;
    allIndexesPath: string;
    specificIndexPath: string;
}

const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
    uri: string;
    allIndexesPath?: string,
    specificIndexPath?: string,
    authCookie?: string;
    children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ 
    uri, 
    authCookie = 'authorization',
    allIndexesPath = '/',
    specificIndexPath = '/index',
    children
}) => {
    const searchClient = useMemo(() => {
        return new BlueOrangeSearch(uri, authCookie);
    }, [uri, authCookie]);

    useEffect(() => {
        localStorage.setItem(SEARCH_CONFIG_URI_KEY, uri);
    }, [uri]);

    const contextValue = useMemo(() => ({
        searchClient,
        uri,
        allIndexesPath,
        specificIndexPath
    }), [searchClient, uri, allIndexesPath, specificIndexPath]);

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = (): BlueOrangeSearch => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context.searchClient;
};

export const useSearchUri = (): string => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchUri must be used within a SearchProvider');
    }
    return context.uri;
};

export const useAllIndexesPath = (): string => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useAllIndexesPath must be used within a SearchProvider');
    }
    return context.allIndexesPath;
};

export const useSpecificIndexPath = (): string => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSpecificIndexPath must be used within a SearchProvider');
    }
    return context.specificIndexPath;
};

export const getStoredSearchUri = (): string | null => {
    return localStorage.getItem(SEARCH_CONFIG_URI_KEY);
};
