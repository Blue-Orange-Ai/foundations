import React, {useState} from "react";

import {
	Button,
	ButtonType,
	Modal,
	ModalBody,
	ModalFooter,
	ModalFooterRight,
	ModalHeader,
	Tab,
	Tabs,
} from "@blue-orange-ai/foundations-core";
import {ChartBlockData, chartIsRenderable} from "../ChartBlockTypes";
import {ChartAppearancePanel} from "./ChartAppearancePanel";
import {ChartDataPanel} from "./ChartDataPanel";
import {ChartRenderer} from "./ChartRenderer";
import {ChartSeriesPanel} from "./ChartSeriesPanel";

interface Props {
	open: boolean,
	data: ChartBlockData,
	onApply: (data: ChartBlockData) => void,
	onClose: () => void,
}

/**
 * The block's configuration surface.
 *
 * Edits are made against a draft so a cancelled session leaves the document
 * untouched and an applied one lands as a single undo step; the preview at the
 * top of the modal draws the draft, so the effect of every change is visible
 * before it is committed.
 */
export const ChartConfigModal: React.FC<Props> = ({open, data, onApply, onClose}) => {

	const [draft, setDraft] = useState<ChartBlockData>(data);

	// A fresh session starts from whatever the block currently holds. Keyed on
	// `open` rather than synced in an effect so the first render already shows
	// the right data.
	const [openedWith, setOpenedWith] = useState<ChartBlockData>(data);
	if (open && openedWith !== data) {
		setOpenedWith(data);
		setDraft(data);
	}

	return (
		<Modal open={open} width={760} minHeight={520} onClose={onClose}>
			<ModalHeader label={"Chart settings"} onClose={onClose}></ModalHeader>
			<ModalBody>
				<div className="blue-orange-chart-config-preview" style={{height: Math.min(draft.options.height, 220) + "px"}}>
					{chartIsRenderable(draft)
						? <ChartRenderer data={draft}></ChartRenderer>
						: <div className="blue-orange-chart-config-empty">
							Nothing to preview yet — load some data and pick at least one series.
						</div>
					}
				</div>
				<Tabs>
					<Tab uuid={"data"} name={"Data"} icon={"ri-table-line"}>
						<ChartDataPanel data={draft} onChange={setDraft}></ChartDataPanel>
					</Tab>
					<Tab uuid={"chart"} name={"Chart"} icon={"ri-line-chart-line"}>
						<ChartAppearancePanel data={draft} onChange={setDraft}></ChartAppearancePanel>
					</Tab>
					<Tab uuid={"series"} name={"Series"} icon={"ri-palette-line"}>
						<ChartSeriesPanel data={draft} onChange={setDraft}></ChartSeriesPanel>
					</Tab>
				</Tabs>
			</ModalBody>
			<ModalFooter>
				<ModalFooterRight>
					<Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={onClose}></Button>
					<Button text={"Apply"} buttonType={ButtonType.PRIMARY} onClick={() => onApply(draft)}></Button>
				</ModalFooterRight>
			</ModalFooter>
		</Modal>
	);
};
