import {kindColourStyle} from "./MapMarkerUtils";

describe("kindColourStyle", () => {

	it("keeps plain colours", () => {
		expect(kindColourStyle("#ff0000", "rgb(1, 2, 3)")).toEqual({
			"--foundations-map-marker-foreground": "#ff0000",
			"--foundations-map-marker-background": "rgb(1, 2, 3)",
		});
		expect(kindColourStyle("var(--brand)")).toEqual({"--foundations-map-marker-foreground": "var(--brand)"});
	});

	it("drops a value that would add declarations of its own", () => {
		expect(kindColourStyle("red;background-image:url(https://attacker.example/x.png);position:fixed;inset:0")).toEqual({});
		expect(kindColourStyle(undefined, "url(https://attacker.example/x.png)")).toEqual({});
	});
});
