import React, {useCallback, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {
	Badge,
	Button,
	ButtonType,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	EmojiWrapper
} from "@blue-orange-ai/foundations-core";

import './Workspace.css'
import {Appearance} from "../../components/appearance/appearance/Appearance";
import {SYSTEM_THEME_COOKIE_NAME, THEME_COOKIE_NAME, watchSystemTheme} from "../../utils/appearance/ThemePreference";
import {SKIN_TONE_COOKIE_NAME} from "../../utils/appearance/EmojiSkinTone";

interface Props {
}

/**
 * Development harness for the blocks package. Renders the Appearance block over
 * a live read-out of the cookies it writes, plus a real emoji picker so the skin
 * tone can be seen taking effect outside the block that set it.
 */
export const Workspace: React.FC<Props> = ({}) => {

	const [cookies, setCookies] = useState<Array<[string, string]>>([]);

	const [pickedEmoji, setPickedEmoji] = useState<string>("");

	const readCookies = useCallback(() => {
		setCookies([
			[THEME_COOKIE_NAME, Cookies.get(THEME_COOKIE_NAME) || "—"],
			[SYSTEM_THEME_COOKIE_NAME, Cookies.get(SYSTEM_THEME_COOKIE_NAME) || "— (not set)"],
			[SKIN_TONE_COOKIE_NAME, Cookies.get(SKIN_TONE_COOKIE_NAME) || "—"]
		]);
	}, []);

	// The block writes its cookies in a mount effect, so the first read has to
	// come after it. The OS watcher covers the system option changing underneath us.
	useEffect(() => {
		readCookies();
		return watchSystemTheme(readCookies);
	}, [readCookies]);

	const clearCookies = () => {
		Cookies.remove(THEME_COOKIE_NAME, {path: "/"});
		Cookies.remove(SYSTEM_THEME_COOKIE_NAME, {path: "/"});
		Cookies.remove(SKIN_TONE_COOKIE_NAME, {path: "/"});
		window.location.reload();
	};

	return (
		<div className="blue-orange-blocks-workspace">
			<div className="blue-orange-blocks-workspace-bar">
				<div className="blue-orange-blocks-workspace-bar-title">Foundations — blocks</div>
				<Badge>appearance</Badge>
			</div>
			<div className="blue-orange-blocks-workspace-content">
				<Appearance
					padded={false}
					onThemePreferenceChange={readCookies}
					onSkinToneChange={readCookies}></Appearance>
				<Card>
					<CardHeader>
						<CardTitle>Cookies</CardTitle>
						<CardDescription>
							What the block has written to the browser. Reload the page — the selection survives.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<table className="blue-orange-blocks-workspace-cookies">
							<tbody>
							{cookies.map(([name, value]) => (
								<tr key={name}>
									<td className="blue-orange-blocks-workspace-cookie-name">{name}</td>
									<td className="blue-orange-blocks-workspace-cookie-value">{value}</td>
								</tr>
							))}
							</tbody>
						</table>
						<div className="blue-orange-blocks-workspace-actions">
							<Button
								text="Clear cookies and reload"
								buttonType={ButtonType.SECONDARY}
								icon="ri-delete-bin-line"
								onClick={clearCookies}></Button>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Emoji picker</CardTitle>
						<CardDescription>
							Core's own picker. It reads the same cookie, so a tone chosen above shows up here.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="blue-orange-blocks-workspace-emoji">
							<EmojiWrapper onSelection={setPickedEmoji}>
								<Button
									text="Open picker"
									buttonType={ButtonType.SECONDARY}
									icon="ri-emotion-line"></Button>
							</EmojiWrapper>
							{pickedEmoji && (
								<div
									className="blue-orange-blocks-workspace-emoji-result"
									dangerouslySetInnerHTML={{__html: pickedEmoji}}></div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
