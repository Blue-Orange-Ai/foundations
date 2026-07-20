import React, {useEffect, useRef, useState} from "react";
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import '../fetch/TagInputCallback.css';
import {HelpIcon} from "../../help/HelpIcon";
import {RequiredIcon} from "../../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../../validation/InputValidation";
import {InputValidationMessage} from "../../validation/InputValidationMessage";
import passport from "../../../config/BlueOrangePassportConfig";
import {PublicUser, User, UserSearchPublicResult} from "@blue-orange-ai/foundations-clients";

interface UserTag {
    value: string;
    userId: string;
}

const getDisplayName = (user: User | PublicUser) => {
    if (user.name == undefined || user.name == "") {
        return user.username;
    } else {
        return user.name;
    }
}

const fetchUsers = async (query: string): Promise<UserTag[]> => {
    try {
        var searchResult: UserSearchPublicResult = await passport.searchPublicUsers(
            {
                query: query,
                page: 0,
                size: 10
            });
        var users = searchResult.result;

        return users.map(user => ({
            value: getDisplayName(user),
            userId: user.id as string
        }));
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
};

interface Props {
    initialUserIds?: string[];
    maxTags?: number;
    placeholder?: string;
    onChange?: (userIds: string[]) => void;
    label?: string;
    /** Registers the input with a surrounding FormGroup under this key. */
    name?: string;
    /** Overrides the message shown when a required field is left empty. */
    requiredMessage?: string;
    required?: boolean;
    help?: string;
    style?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    validate?: InputValidateCallback<string[]>;
    validateOnChange?: boolean;
}

export const TagInputUsers: React.FC<Props> = ({
    initialUserIds = [],
    maxTags = 100000,
    placeholder = "Search users...",
    onChange,
    label,
    name,
    requiredMessage,
    required = false,
    help,
    style = {},
    labelStyle = {},
    validate,
    validateOnChange = false
}) => {
    const currentUserIdsRef = useRef<string[]>(initialUserIds);

    const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
        useInputValidation<string[]>(validate, validateOnChange, {
            name: name,
            label: label,
            required: required,
            requiredMessage: requiredMessage,
            getValue: () => currentUserIdsRef.current ?? []
        });

    const tagifyRef = useRef<HTMLInputElement>(null);
    const tagifyInstanceRef = useRef<Tagify | null>(null);
    const onChangeRef = useRef(onChange);
    const handleChangeValidationRef = useRef(handleChangeValidation);
    const handleBlurValidationRef = useRef(handleBlurValidation);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        handleChangeValidationRef.current = handleChangeValidation;
    }, [handleChangeValidation]);

    useEffect(() => {
        handleBlurValidationRef.current = handleBlurValidation;
    }, [handleBlurValidation]);

    useEffect(() => {
        if (!tagifyRef.current) return;

        const settings: any = {
            whitelist: [],
            maxTags,
            enforceWhitelist: true,
            placeholder,
            tagTextProp: 'value',
            dropdown: {
                enabled: 0,
                mapValueTo: 'value',
                searchKeys: ['value']
            }
        };

        const tagify = new Tagify(tagifyRef.current, settings) as any;
        tagifyInstanceRef.current = tagify;

        let abortController: AbortController | null = null;

        // @ts-ignore
        tagify.on("input", async (e: any) => {
            const value = e.detail.value;

            // @ts-ignore
            tagify.whitelist = null;

            if (abortController) {
                abortController.abort();
            }
            abortController = new AbortController();

            tagify.loading(true);

            try {
                const newWhitelist = await fetchUsers(value);
                if (!abortController.signal.aborted) {
                    // @ts-ignore
                    tagify.whitelist = newWhitelist;
                    tagify.loading(false).dropdown.show(value);
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    tagify.loading(false);
                }
            }
        });

        // @ts-ignore
        tagify.on("add remove", (e) => {
            const updatedUserIds = (tagify.value || []).map((t: any) => t?.userId || '');
            currentUserIdsRef.current = updatedUserIds;
            if (onChangeRef.current) {
                onChangeRef.current(updatedUserIds);
            }
            handleChangeValidationRef.current(updatedUserIds);
        });

        // @ts-ignore
        tagify.on("blur", () => {
            handleBlurValidationRef.current(currentUserIdsRef.current);
        });

        setInitialized(true);

        return () => {
            tagify.destroy();
            tagifyInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const loadInitialUsers = async () => {
            if (!initialized || !tagifyInstanceRef.current || initialUserIds.length === 0) return;

            try {
                const userTags: UserTag[] = [];
                for (const userId of initialUserIds) {
                    const searchResult = await passport.searchPublicUsers({
                        query: userId,
                        page: 0,
                        size: 1
                    });
                    if (searchResult.result.length > 0) {
                        const user = searchResult.result[0];
                        userTags.push({
                            value: getDisplayName(user),
                            userId: user.id as string
                        });
                    }
                }
                if (userTags.length > 0) {
                    tagifyInstanceRef.current.addTags(userTags);
                }
            } catch (error) {
                console.error('Failed to load initial users:', error);
            }
        };

        loadInitialUsers();
    }, [initialized, initialUserIds]);

    return (
        <div className={"blue-orange-input-tags-cont" + (isError ? " blue-orange-input-tags-cont-error" : "")} style={style}>
            {label &&
                <div className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")} style={labelStyle}>
                    {label}
                    {help && <HelpIcon label={help}></HelpIcon>}
                    {required && <RequiredIcon></RequiredIcon>}
                </div>
            }
            <input ref={tagifyRef} className={"blue-orange-tags"}/>
            <InputValidationMessage result={validationResult}></InputValidationMessage>
        </div>
    );
};
