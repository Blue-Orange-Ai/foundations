import React, {ReactNode, useMemo, useState} from "react";

import './DocsTheme.css'
import './ComponentApi.css'
import {GeneralHeading} from "../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../components/text-decorations/description/Description";
import {CodeBlock} from "../../components/text-decorations/code-block/CodeBlock";
import {ButtonIcon} from "../../components/buttons/button-icon/ButtonIcon";
import {ButtonSize} from "../../components/buttons/button/Button";
import {DemoStage, DemoWidth} from "./DemoStage";
import {PropControls} from "./PropControls";
import {PropsTable} from "./PropsTable";
import {InterfaceDoc, PropSpec, generateSnippet, initialValues} from "./PropSpec";

export interface ComponentApiProps {
	/** The component as it is written in JSX. */
	name: string;
	/** Rendered above the block. Leave it off when the page title already names the component. */
	heading?: string;
	/** A line about this component specifically, for a page that documents more than one. */
	description?: ReactNode;
	/** Everything the interface declares, in the order it declares it. */
	props: Array<PropSpec>;
	/** The live component, built from whatever the controls currently hold. */
	preview: (values: Record<string, any>) => ReactNode;
	/** Written between the tags in the generated snippet. */
	snippetChildren?: (values: Record<string, any>) => string | undefined;
	/** Replaces the generated snippet outright, for a component the controls cannot describe. */
	usage?: (values: Record<string, any>) => string;
	/** Named alongside the component on the import line. */
	imports?: Array<string>;
	/** Defaults to the core package. */
	packageName?: string;
	/** Supporting interfaces — a tab, an item, an option object — documented under the props. */
	interfaces?: Array<InterfaceDoc>;
	/** Where the demo viewport starts. */
	previewWidth?: DemoWidth;
	previewHeight?: number;
	/** Off for anything that should sit at the top left of the viewport rather than in the middle of it. */
	previewCentered?: boolean;
}

/**
 * One component, documented: a demo whose viewport and props can both be driven
 * from the page, the code that reproduces what is on screen, and the interface
 * it all comes from.
 */
export const ComponentApi: React.FC<ComponentApiProps> = ({
															  name,
															  heading,
															  description,
															  props,
															  preview,
															  snippetChildren,
															  usage,
															  imports,
															  packageName,
															  interfaces = [],
															  previewWidth = "full",
															  previewHeight = 220,
															  previewCentered = true}) => {

	const [values, setValues] = useState<Record<string, any>>(() => initialValues(props));

	const updateValue = (propName: string, value: any) => {
		setValues(current => ({...current, [propName]: value}));
	}

	const code = usage
		? usage(values)
		: generateSnippet({
			name: name,
			props: props,
			values: values,
			children: snippetChildren ? snippetChildren(values) : undefined,
			packageName: packageName,
			imports: imports
		});

	// CodeBlock re-highlights whenever the object it is given changes identity, so
	// the render has to be held onto rather than rebuilt on every pass.
	const render = useMemo(() => ({code: code, lang: "tsx"}), [code]);

	return (
		<div className="blue-orange-docs-api">
			{heading ? <GeneralHeading>{heading}</GeneralHeading> : <></>}
			{description ? <Description>{description}</Description> : <></>}

			<div className="blue-orange-docs-playground">
				<div className="blue-orange-docs-playground-stage">
					<DemoStage
						width={previewWidth}
						minHeight={previewHeight}
						centered={previewCentered}>
						{preview(values)}
					</DemoStage>
				</div>
				<aside className="blue-orange-docs-playground-panel">
					<div className="blue-orange-docs-playground-panel-header">
						<span>Props</span>
						<ButtonIcon
							icon="ri-refresh-line"
							label="Reset the props"
							size={ButtonSize.SMALL}
							onClick={() => setValues(initialValues(props))}
						></ButtonIcon>
					</div>
					<div className="blue-orange-docs-playground-panel-body">
						<PropControls props={props} values={values} onChange={updateValue}></PropControls>
					</div>
				</aside>
			</div>

			<h3 className="blue-orange-docs-subheading">Usage</h3>
			<Description>
				What the demo above is currently rendering — change a control and the snippet
				changes with it.
			</Description>
			<CodeBlock value={render}></CodeBlock>

			<h3 className="blue-orange-docs-subheading">{name} props</h3>
			<PropsTable props={props}></PropsTable>
			{interfaces.map(item => (
				<div key={item.name}>
					<h3 className="blue-orange-docs-subheading">{item.name}</h3>
					{item.description ? <Description>{item.description}</Description> : <></>}
					<PropsTable props={item.props}></PropsTable>
				</div>
			))}
		</div>
	)
}
