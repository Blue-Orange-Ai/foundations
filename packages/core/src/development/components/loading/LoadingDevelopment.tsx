import React, {useState} from "react";

import './LoadingDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../components/text-decorations/paragraph/Paragraph";
import {Loading} from "../../../components/loading/loading/Loading";
import {Skeleton} from "../../../components/loading/skeleton/Skeleton";
import {Button, ButtonType} from "../../../components/buttons/button/Button";
import {CodeBlock} from "../../../components/text-decorations/code-block/CodeBlock";

interface Props {
}

const USAGE = `// A spinner, sized and coloured by its props
<Loading fontSize="1.5rem" color="dodgerblue"></Loading>

// A placeholder block while content loads
<Skeleton style={{height: "16px", width: "220px"}}></Skeleton>

// Buttons carry their own spinner
<Button text="Save" buttonType={ButtonType.PRIMARY} isLoading={true}></Button>`;

export const LoadingDevelopment: React.FC<Props> = ({}) => {

	const [loaded, setLoaded] = useState(false);

	return (
		<PaddedPage>
			<PageHeading>Loading</PageHeading>
			<Paragraph>
				Loading is a spinner sized and coloured through its props. Skeleton is a shimmering placeholder that
				fills whatever box you give it — size it with style, and use as many as the real content will occupy.
			</Paragraph>

			<div className="loading-dev-section">
				<FormHeading label="Spinner sizes"></FormHeading>
				<div className="loading-dev-row">
					<Loading fontSize="1rem" color="inherit"></Loading>
					<Loading fontSize="1.5rem" color="inherit"></Loading>
					<Loading fontSize="2.5rem" color="inherit"></Loading>
					<Loading fontSize="2.5rem" color="dodgerblue"></Loading>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Inside a button"></FormHeading>
				<div className="loading-dev-row">
					<Button text="Saving" buttonType={ButtonType.PRIMARY} isLoading={true}></Button>
					<Button text="Saving" buttonType={ButtonType.SECONDARY} isLoading={true}></Button>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Skeleton shapes"></FormHeading>
				<div className="loading-dev-skeletons">
					<Skeleton style={{height: "40px", width: "40px", borderRadius: "50%"}}></Skeleton>
					<div className="loading-dev-skeleton-lines">
						<Skeleton style={{height: "12px", width: "220px"}}></Skeleton>
						<Skeleton style={{height: "12px", width: "160px"}}></Skeleton>
						<Skeleton style={{height: "12px", width: "260px"}}></Skeleton>
					</div>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Standing in for real content"></FormHeading>
				<div className="loading-dev-card">
					{!loaded &&
						<>
							<Skeleton style={{height: "18px", width: "180px", marginBottom: "10px"}}></Skeleton>
							<Skeleton style={{height: "12px", width: "100%", marginBottom: "6px"}}></Skeleton>
							<Skeleton style={{height: "12px", width: "80%"}}></Skeleton>
						</>
					}
					{loaded &&
						<>
							<div className="loading-dev-card-title">Quarterly revenue</div>
							<Paragraph>
								Loaded content replaces the placeholders without the card changing size.
							</Paragraph>
						</>
					}
				</div>
				<div className="loading-dev-row">
					<Button
						text={loaded ? "Show placeholders" : "Show content"}
						buttonType={ButtonType.SECONDARY}
						onClick={() => setLoaded(!loaded)}></Button>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</PaddedPage>
	)
}
