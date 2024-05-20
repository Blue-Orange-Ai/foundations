import React, {ReactNode, useEffect, useRef, useState} from "react";

import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

// Must be lower than than the tagify.css
import './SimpleTag.css'

interface Props {
	initialTags?: string[];
	whitelist?: string[];
	blacklist?: string[];
	maxTags?: number;
	placeholder?: string;
	onChange: (tags: string[]) => void;
}
export const SimpleTag: React.FC<Props> = ({
											   initialTags = [],
											   whitelist = [],
											   blacklist = [],
											   maxTags = 100000,
											   placeholder = "Type to add tags",
											   onChange
										   }) => {

	const tagifyRef = useRef<HTMLInputElement>(null);
	const [tags, setTags] = useState(initialTags);

	useEffect(() => {
		if (!tagifyRef.current) return;

		const settings = {
			whitelist,
			blacklist,
			maxTags,
			enforceWhitelist: false,
			placeholder,
			dropdown: {
				enabled: 0 // Always show suggestions dropdown on focus
			}
		};

		const tagify = new Tagify(tagifyRef.current, settings);
		// @ts-ignore
		tagify.on("add remove", (e) => {
			const updatedTags = tagify.getTagElms().map(tagEl => tagEl.textContent || '');
			setTags(updatedTags);
			onChange(updatedTags);
		});

		return () => {
			tagify.destroy();
		};
	}, []);

	return (
		<input ref={tagifyRef} className={"blue-orange-tags"} value={tags.join(',')} onChange={() => {}}/>
	);
}