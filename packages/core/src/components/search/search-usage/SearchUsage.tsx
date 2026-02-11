import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Index, BlueOrangeSearch, SearchStats} from "@blue-orange-ai/foundations-clients";
import {ToastContext, ToastLocation} from "../../alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../alerts/toast/toaster/Toaster";

import './SearchUsage.css';
import {MetricCard} from "../../metrics/metric-card/MetricCard";
import {ComboChart} from "../../charts/combo/ComboChart";
import {InputForm} from "../../inputs/form/InputForm";
import {CopyInput} from "../../inputs/copy-input/CopyInput";

interface Props {
    index?: Index;
    client?: BlueOrangeSearch;
}

export const SearchUsage: React.FC<Props> = ({index, client}) => {

    const { addToast } = useContext(ToastContext);

    const [stats, setStats] = useState<SearchStats | null>(null);
    const [statsLoading, setStatsLoading] = useState<boolean>(false);

    const fetchIndexStats = useCallback(async (indexName: string): Promise<SearchStats | null> => {
        if (!client) {
            addToast({
                id: `stats-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                heading: "Error",
                description: "Client is required to fetch stats",
                showCloseButton: true
            });
            return null;
        }

        setStatsLoading(true);

        try {
            const fetchedStats = await client.getIndexSearchStats(indexName);
            setStats(fetchedStats);
            return fetchedStats;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            addToast({
                id: `stats-error-${Date.now()}`,
                location: ToastLocation.BOTTOM_RIGHT,
                toastType: ToasterType.ERROR,
                heading: "Failed to fetch stats",
                description: errorMessage,
                showCloseButton: true
            });
            return null;
        } finally {
            setStatsLoading(false);
        }
    }, [client, addToast]);

    useEffect(() => {
        if (index?.name) {
            fetchIndexStats(index.name);
        }
    }, [index?.name, fetchIndexStats]);

    const firstMetricStyle: React.CSSProperties = {
        borderBottomRightRadius: "0px",
        borderTopRightRadius: "0px",
        borderRight: "none"
    }

    const middleMetricStyle: React.CSSProperties = {
        borderBottomRightRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        borderTopLeftRadius: "0px",
        borderRight: "none"
    }

    const lastMetricStyle: React.CSSProperties = {
        borderBottomLeftRadius: "0px",
        borderTopLeftRadius: "0px",

    }

    return (
        <div className="blue-orange-search-usage">
            <div className="blue-orange-search-usage-metric-group">
                <MetricCard
                    label="Name"
                    text={index?.name ?? "-"}
                    style={firstMetricStyle} />
                <MetricCard
                    label="Total Documents"
                    text={statsLoading ? "Loading..." : (stats?.total?.docs?.count?.toLocaleString() ?? "-")}
                    style={middleMetricStyle} />
                <MetricCard
                    label="Total Searches"
                    text={statsLoading ? "Loading..." : (stats?.total?.search?.query_total?.toLocaleString() ?? "-")}
                    style={lastMetricStyle} />
            </div>
            {index &&
                <>
                    <InputForm paddingTop={40}>
                        <CopyInput label="Id" value={index.id ?? ""}></CopyInput>
                        <CopyInput label="Version" value={index.version?.toString() ?? ""}></CopyInput>
                    </InputForm>
                </>
            }

        </div>
    )

};