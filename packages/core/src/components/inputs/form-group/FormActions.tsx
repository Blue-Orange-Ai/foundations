import React from "react";

interface Props {
	children: React.ReactNode;
}

/**
 * Slot marker placing its children in the footer of a {@link FormGroup}.
 *
 * Renders nothing itself — FormGroup pulls the children out and lays them out
 * in the action bar underneath the form body.
 */
export const FormActions: React.FC<Props> = ({children}) => {
	return (<>{children}</>);
};
