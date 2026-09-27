import React, {useCallback, useEffect, useState} from "react";

import passport from "@blue-orange-ai/foundations-core/src/components/config/BlueOrangePassportConfig";

interface Props {
    userId?: string
}

export const UserIdToName: React.FC<Props> = ({
                                                    userId
                                                }) => {

    const [name, setName] = useState("");

    const getUserName = useCallback(async (id: string | undefined) => {
        if (!id) {
            return "User Id is undefined"
        }
        try {
            const user = await passport.get(id);
            var n = user.username;
            if (user.name && user.name != "") {
                n += " - " + user.name;
            }
            n += " - " + user.domain;
            setName(n);
        } catch (e) {
            setName(id)
        }

    }, [])

    useEffect(() => {
        getUserName(userId);
    }, [userId]);

    return (
        <>{name}</>
    )
}