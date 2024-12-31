import React, { useEffect, useState } from "react";
import moment from "moment";

interface Props {
    targetDate: string | Date;
}

export const RelativeTime: React.FC<Props> = ({ targetDate }) => {
    const [relativeTime, setRelativeTime] = useState("");

    const calculateRelativeTime = () => {
        const now = moment();
        const target = moment(targetDate);
        const diffInMinutes = target.diff(now, "minutes");

        if (Math.abs(diffInMinutes) <= 30) {
            return `${Math.abs(diffInMinutes)} minute${
                Math.abs(diffInMinutes) !== 1 ? "s" : ""
            }`;
        } else if (Math.abs(diffInMinutes) <= 60) {
            const roundedMinutes = Math.round(diffInMinutes / 10) * 10;
            return `${Math.abs(roundedMinutes)} minute${
                Math.abs(roundedMinutes) !== 1 ? "s" : ""
            }`;
        }

        const diffInHours = target.diff(now, "hours");
        if (Math.abs(diffInHours) < 24) {
            return `${Math.abs(diffInHours)} hour${
                Math.abs(diffInHours) !== 1 ? "s" : ""
            }`;
        }

        const diffInDays = target.diff(now, "days");
        if (Math.abs(diffInDays) < 7) {
            return `${Math.abs(diffInDays)} day${
                Math.abs(diffInDays) !== 1 ? "s" : ""
            }`;
        }

        const diffInWeeks = target.diff(now, "weeks");
        if (Math.abs(diffInWeeks) < 4) {
            return `${Math.abs(diffInWeeks)} week${
                Math.abs(diffInWeeks) !== 1 ? "s" : ""
            }`;
        }

        const diffInMonths = target.diff(now, "months");
        if (Math.abs(diffInMonths) < 12) {
            return `${Math.abs(diffInMonths)} month${
                Math.abs(diffInMonths) !== 1 ? "s" : ""
            }`;
        }

        const diffInYears = target.diff(now, "years");
        return `${Math.abs(diffInYears)} year${
            Math.abs(diffInYears) !== 1 ? "s" : ""
        }`;
    };

    useEffect(() => {
        const updateRelativeTime = () => {
            setRelativeTime(calculateRelativeTime());
        };

        // Initial calculation
        updateRelativeTime();

        // Update every minute
        const intervalId = setInterval(updateRelativeTime, 60000);

        return () => clearInterval(intervalId);
    }, [targetDate]);

    return <>{relativeTime}</>;
};