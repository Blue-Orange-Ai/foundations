import React from "react";
import moment from "moment";

interface Props {
    targetDate: string | Date;
    timeFormat: "12hr" | "24hr";
    dateFormat: "dd/mm/yy" | "mm/dd/yy";
}

export const TimeDisplay: React.FC<Props> = ({
                                                 targetDate,
                                                 timeFormat = "12hr",
                                                 dateFormat = "dd/mm/yy",
                                             }) => {
    const formatTime = (date: moment.Moment) => {
        return date.format(timeFormat === "12hr" ? "hh:mm A" : "HH:mm");
    };

    const formatDate = (date: moment.Moment) => {
        return dateFormat === "dd/mm/yy"
            ? date.format("DD/MM/YY")
            : date.format("MM/DD/YY");
    };

    const renderTimeDisplay = () => {
        const now = moment();
        const target = moment(targetDate);

        if (now.isSame(target, "day")) {
            // Within the same day, only show the time
            return formatTime(target);
        } else if (now.diff(target, "days") < 7) {
            // Within the last 7 days, show the 3-letter day code and time
            return `${target.format("ddd")} ${formatTime(target)}`;
        } else {
            // Beyond the last 7 days, show the time and date
            return `${formatTime(target)} ${formatDate(target)}`;
        }
    };

    return <>{renderTimeDisplay()}</>;
};
