import React from "react";

import './ServiceHome.css'
import {Button, ButtonIcon, PageHeading, Tab, Tabs} from "@blue-orange-ai/foundations-core";


interface Props {
}

export const ServiceHome: React.FC<Props> = ({}) => {

	return (
		<div className="blue-orange-deployment-service-home">
			<div className="blue-orange-deployment-service-home-header">
				<div className="blue-orange-deployment-service-home-top-banner">
					<div className="blue-orange-deployment-service-left-cont">
						<PageHeading>Hello world</PageHeading>
					</div>
					<div className="blue-orange-deployment-service-right-cont">
						<ButtonIcon icon={"ri-pencil-fill"} label={"Edit"}></ButtonIcon>
					</div>
				</div>
				<div className="blue-orange-deployment-service-home-tabs">
					<div className="blue-orange-deployment-service-home-tabs-cont">
						<Tabs>
							<Tab uuid={"12123123123123"} name={"Option 1"}></Tab>
							<Tab uuid={"12123123123124"} name={"Option 2"}></Tab>
						</Tabs>
					</div>

				</div>

			</div>
		</div>
	)
}