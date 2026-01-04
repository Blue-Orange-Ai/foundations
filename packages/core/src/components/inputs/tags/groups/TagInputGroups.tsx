import React, {useEffect, useRef, useState} from "react";
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import '../fetch/TagInputCallback.css';
import {HelpIcon} from "../../help/HelpIcon";
import {RequiredIcon} from "../../required-icon/RequiredIcon";
import passport from "../../../config/BlueOrangePassportConfig";
import {Group, GroupSearchResult} from "@blue-orange-ai/foundations-clients";

interface GroupTag {
    value: string;
    groupId: string;
}

const fetchGroups = async (query: string): Promise<GroupTag[]> => {
    try {
        var searchResult: GroupSearchResult = await passport.searchGroups({
            query: query,
            page: 0,
            size: 10
        });
        var groups = searchResult.result;

        return groups.map(group => ({
            value: group.name,
            groupId: group.id as string
        }));
    } catch (error) {
        console.error('Failed to fetch groups:', error);
        return [];
    }
};

interface Props {
    initialGroupIds?: string[];
    maxTags?: number;
    placeholder?: string;
    onChange?: (groupIds: string[]) => void;
    label?: string;
    required?: boolean;
    help?: string;
    style?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
}

export const TagInputGroups: React.FC<Props> = ({
    initialGroupIds = [],
    maxTags = 100000,
    placeholder = "Search groups...",
    onChange,
    label,
    required = false,
    help,
    style = {},
    labelStyle = {}
}) => {
    const tagifyRef = useRef<HTMLInputElement>(null);
    const tagifyInstanceRef = useRef<Tagify | null>(null);
    const onChangeRef = useRef(onChange);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

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

        tagify.on("input", async (e: any) => {
            const value = e.detail.value;

            tagify.whitelist = null;

            if (abortController) {
                abortController.abort();
            }
            abortController = new AbortController();

            tagify.loading(true);

            try {
                const newWhitelist = await fetchGroups(value);
                if (!abortController.signal.aborted) {
                    tagify.whitelist = newWhitelist;
                    tagify.loading(false).dropdown.show(value);
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    tagify.loading(false);
                }
            }
        });

        tagify.on("add remove", (e: any) => {
            const updatedGroupIds = (tagify.value || []).map((t: any) => t?.groupId || '');
            if (onChangeRef.current) {
                onChangeRef.current(updatedGroupIds);
            }
        });

        setInitialized(true);

        return () => {
            tagify.destroy();
            tagifyInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const loadInitialGroups = async () => {
            if (!initialized || !tagifyInstanceRef.current || initialGroupIds.length === 0) return;

            try {
                const groupTags: GroupTag[] = [];
                for (const groupId of initialGroupIds) {
                    const searchResult = await passport.searchGroups({
                        query: groupId,
                        page: 0,
                        size: 1
                    });
                    if (searchResult.result.length > 0) {
                        const group = searchResult.result[0];
                        groupTags.push({
                            value: group.name,
                            groupId: group.id as string
                        });
                    }
                }
                if (groupTags.length > 0) {
                    tagifyInstanceRef.current.addTags(groupTags);
                }
            } catch (error) {
                console.error('Failed to load initial groups:', error);
            }
        };

        loadInitialGroups();
    }, [initialized, initialGroupIds]);

    return (
        <div className="blue-orange-input-tags-cont" style={style}>
            {label &&
                <div className={"blue-orange-default-input-label-cont"} style={labelStyle}>
                    {label}
                    {help && <HelpIcon label={help}></HelpIcon>}
                    {required && <RequiredIcon></RequiredIcon>}
                </div>
            }
            <input ref={tagifyRef} className={"blue-orange-tags"}/>
        </div>
    );
};
