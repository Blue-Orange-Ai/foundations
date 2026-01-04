import React, {ReactNode, useEffect, useRef, useState} from "react";

import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

// Must be lower than than the tagify.css
import './TagInputCallback.css'
import {HelpIcon} from "../../help/HelpIcon";
import {RequiredIcon} from "../../required-icon/RequiredIcon";

interface Props {
	initialTags?: string[];
	whitelist?: string[];
	enforceWhitelist?: boolean;
	blacklist?: string[];
	maxTags?: number;
	placeholder?: string;
	onChange?: (tags: string[]) => void;
	label?:string;
	required?: boolean;
	help?: string;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	fetchWhitelist?: (inputValue: string) => Promise<string[]>;
}
export const TagInputCallback: React.FC<Props> = ({
											   initialTags = [],
											   whitelist = [],
											  enforceWhitelist = false,
											   blacklist = [],
											   maxTags = 100000,
											   placeholder = "Type to add tags",
											   onChange,
											  label,
											  required=false,
											  help,
											  style = {},
											  labelStyle={},
											  fetchWhitelist
										   }) => {

	const tagifyRef = useRef<HTMLInputElement>(null);
	const onChangeRef = useRef(onChange);
	const fetchWhitelistRef = useRef(fetchWhitelist);
	const [, setTags] = useState(initialTags);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		fetchWhitelistRef.current = fetchWhitelist;
	}, [fetchWhitelist]);

	useEffect(() => {
		if (!tagifyRef.current) return;

		const settings = {
			whitelist,
			blacklist,
			maxTags,
			enforceWhitelist: enforceWhitelist,
			placeholder,
			dropdown: {
				enabled: 0 // Always show suggestions dropdown on focus
			}
		};

		const tagify = new Tagify(tagifyRef.current, settings);
		if (initialTags.length > 0) {
			tagify.addTags(initialTags);
		}

		let abortController: AbortController | null = null;

		// @ts-ignore
		tagify.on("input", async (e: any) => {
			const value = e.detail.value;

			if (!fetchWhitelistRef.current) return;

			// @ts-ignore
			tagify.whitelist = null;

			if (abortController) {
				abortController.abort();
			}
			abortController = new AbortController();

			tagify.loading(true);

			try {
				const newWhitelist = await fetchWhitelistRef.current(value);
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
			const updatedTags = (tagify.value || []).map((t: any) => t?.value || '');
			setTags(updatedTags);
			if (onChangeRef.current) {
				onChangeRef.current(updatedTags);
			}
		});

		return () => {
			tagify.destroy();
		};
	}, []);

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
}