import React, {ReactNode, useCallback, useEffect, useRef, useState} from "react";

import './CodeBlock.css'
import {RenderHtml} from "../render-html/RenderHtml";
import {codeToHtml } from 'shiki';
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {isDarkMode, observeDarkMode} from "../../utils/DarkMode";

export interface CodeRender {
	code: string,
	lang: string,
	/** Leave it out to follow the light/dark theme the rest of the page is using. */
	theme?: "github-light" | "github-dark"
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

	// Shiki bakes the colours into the markup it generates, so the block has to be
	// highlighted again whenever the page switches between light and dark.
	const [darkMode, setDarkMode] = useState<boolean>(isDarkMode);

	useEffect(() => {
		return observeDarkMode(() => setDarkMode(isDarkMode()));
	}, []);

	// Highlighting is asynchronous, so a block that is unmounted while shiki is
	// still working must not try to render the result when it arrives.
	const mounted = useRef<boolean>(true);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	const formatCode = useCallback(async (input: CodeRender, dark: boolean): Promise<void> => {
		const formatedCode = await codeToHtml(input.code, {
			lang: input.lang,
			theme: input.theme ?? (dark ? "github-dark" : "github-light")
		});
		if (mounted.current) {
			setHtml(formatedCode)
		}
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
		formatCode(value, darkMode)
	}, [value, darkMode]);

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