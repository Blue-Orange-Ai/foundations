import React, {useState} from "react";

import './Workspace.css'
import {Button, ButtonIconPos, ButtonType} from "../../components/button/Button";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {

	const [isLoading, setIsLoading] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState(false);

	const btnClick = () => {
		setError(true);
	}

	const finishSuccess = () => {
		setSuccess(false);
	}

	const finishError = () => {
		setError(false);
	}

	return (
		<div className="workspace-main-window">
			<div className="workspace-display-window">
				<Button text="Hello World"
						buttonType={ButtonType.SECONDARY}
						onClick={btnClick}
						icon="ri-git-merge-line"
						iconPos={ButtonIconPos.RIGHT}
						tooltip={'Hello world I am a tooltip'}
						isLoading={isLoading}
						isSuccess={success}
						onSuccessAnimationComplete={finishSuccess}
						onErrorAnimationComplete={finishError}
						isError={error}
				></Button>
			</div>
		</div>
	)
}