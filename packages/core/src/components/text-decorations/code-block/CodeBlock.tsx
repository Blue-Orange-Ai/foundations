import React, {ReactNode, useCallback, useEffect, useState} from "react";

import './CodeBlock.css'
import {RenderHtml} from "../render-html/RenderHtml";
import {codeToHtml } from 'shiki';
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";

export interface CodeRender {
	code: string,
	lang: string,
	theme: "github-light" | "github-dark"
}

interface Props {
	value: CodeRender;
	style?: React.CSSProperties;
}

export const CodeBlock: React.FC<Props> = ({value, style={}}) => {

	const [html, setHtml] = useState<string>('');

	const [showLanguage, setShowLanguage] = useState<boolean>(true);

	const [copied, setCopied] = useState<boolean>(false);

	const [mouseEntered, setMouseEntered] = useState<boolean>(false);

	const formatCode = useCallback(async (input: CodeRender): Promise<void> => {
		const formatedCode = await codeToHtml(input.code, {
			lang: input.lang,
			theme: input.theme
		});
		setHtml(formatedCode)
	}, [])

	const copyCode = useCallback(async (code: string): Promise<void> => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => {
				setCopied(false)
				if (!mouseEntered) {
					setShowLanguage(true)
				}
			}, 2000)
		} catch (err) {
		}
	}, [])

	const handleMouseEntered = () => {
		setMouseEntered(true);
		setShowLanguage(false);
	}

	const handleMouseLeave = () => {
		setMouseEntered(false);
		if (!copied) {
			setShowLanguage(true);
		}

	}

	useEffect(() => {
		formatCode(value)
	}, [value]);

	return (
		<div className="blue-orange-code-block" style={style} onMouseEnter={handleMouseEntered} onMouseLeave={handleMouseLeave}>
			{showLanguage &&
				<div className="blue-orange-code-block-language">{value.lang}</div>
			}
			{!showLanguage &&
				<div className="blue-orange-code-block-copy-btn">
					{copied &&
						<ButtonIcon icon={"ri-check-line"}></ButtonIcon>
					}
					{!copied &&
						<ButtonIcon icon={"ri-clipboard-fill"} onClick={() => copyCode(value.code)}></ButtonIcon>
					}

				</div>
			}
			<RenderHtml html={html}></RenderHtml>
		</div>
	)
}