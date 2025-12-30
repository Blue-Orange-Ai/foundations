import React, {useEffect, useRef, useState} from "react";

import './SearchUsage.css';
import {MetricCard} from "../../metrics/metric-card/MetricCard";
import {ComboChart} from "../../charts/combo/ComboChart";
import {InputForm} from "../../inputs/form/InputForm";
import {CopyInput} from "../../inputs/copy-input/CopyInput";

interface Props {
}

export const SearchUsage: React.FC<Props> = ({}) => {

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
                    text={"Hello world"}
                    style={firstMetricStyle}>
                </MetricCard>
                <MetricCard
                    label="Total Searches"
                    text={"10000000"}
                    style={middleMetricStyle}>

                </MetricCard>
                <MetricCard
                    label="Searches Last 5 Minutes"
                    text={"10"}
                    style={lastMetricStyle}>
                </MetricCard>
            </div>
            <ComboChart
                height={"50vh"}
                width={"100%"}
                dataset={[
                    { type: 'line', label: 'CPU %', parsing: false, data: [
                            {x: 1719705600000, y: 12}, {x: 1719709200000, y: 18}
                        ], borderColor: '#2d88ff' },
                    { type: 'scatter', label: 'Events', parsing: false, data: [
                            {x: 1719707000000, y: 20}, {x: 1719708200000, y: 35}
                        ], borderColor: '#ff7a00', backgroundColor: '#ff7a00' },
                ]}
                xScale="time"
                xScaleTimeUnit="minute"
                yScale="linear"
                showXValueInTooltip={true}
                legend
                rangeSelect
            />
            <InputForm paddingTop={40}>
                <CopyInput label="Id"></CopyInput>
                <CopyInput label="Version"></CopyInput>
            </InputForm>
        </div>
    )

};