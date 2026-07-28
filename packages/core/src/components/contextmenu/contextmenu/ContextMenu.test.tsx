import React, {useState} from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import {ContextMenu, IContextMenuType} from "./ContextMenu";

const Harness = () => {
	const [count, setCount] = useState(0);
	return (
		<div>
			<button onClick={() => setCount(count + 1)}>rerender</button>
			<ContextMenu rightClick={true} items={[{type: IContextMenuType.CONTENT, label: "Open", value: "OPEN"}]}>
				<div data-testid="child">child {count}</div>
			</ContextMenu>
		</div>
	);
};

describe("ContextMenu", () => {

	it("keeps its children mounted across re-renders", () => {
		render(<Harness/>);

		const child = screen.getByTestId("child");
		fireEvent.click(screen.getByText("rerender"));

		// Recreating the wrapper on every render would replace this node, which
		// loses focus inside the children and stops double clicks registering.
		expect(child.isConnected).toBe(true);
		expect(screen.getByTestId("child")).toBe(child);
		expect(child.textContent).toEqual("child 1");
	});
});
