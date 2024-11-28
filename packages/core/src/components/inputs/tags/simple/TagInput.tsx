import React, {ReactNode, useEffect, useRef, useState} from "react";

import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

// Must be lower than than the tagify.css
import './TagInput.css'
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
	labelStyle?: React.CSSProperties
}
export const TagInput: React.FC<Props> = ({
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
											  labelStyle={}
										   }) => {

	const tagifyRef = useRef<HTMLInputElement>(null);
	const [tags, setTags] = useState(initialTags);

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
		// @ts-ignore
		tagify.on("add remove", (e) => {
			setTimeout(() => {
				// @ts-ignore
				const updatedTags = tagify.getTagElms().map(tagEl => tagEl["__tagifyTagData"]["value"] || '');
				setTags(updatedTags);
				if (onChange) {
					onChange(updatedTags);
				}
			}, 10);
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
			<input ref={tagifyRef} className={"blue-orange-tags"} value={tags.join(',')} onChange={() => {
			}}/>
		</div>

	);
}