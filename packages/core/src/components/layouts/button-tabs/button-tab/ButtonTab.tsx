import React from "react";

import './ButtonTab.css'

interface Props {
	uuid: string,
	name: string,
	icon?: string,
	disabled?: boolean,
	children?: React.ReactNode
}

/**
 * Declares a single tab inside a ButtonTabs group. Like Tab it renders nothing
 * itself — ButtonTabs reads its props and children.
 */
export const ButtonTab: React.FC<Props> = ({}) => {

	return (
		<></>
	)
}
