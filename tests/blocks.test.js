import {describe, it, expect} from "vitest";
import {parse} from "node-html-parser";
import {renderBlock} from "./helpers/render-block.js";

// ---------------------------------------------------------------------------
// sCatalog block
// ---------------------------------------------------------------------------
describe("sCatalog block", () => {
	it("renders without throwing", () => {
		expect(() => renderBlock("sCatalog")).not.toThrow();
	});

	it("contains .product-item elements", () => {
		const html = renderBlock("sCatalog");
		const root = parse(html);
		const items = root.querySelectorAll(".product-item");
		expect(items.length).toBeGreaterThanOrEqual(1);
	});

	it("each product-item has a caption element", () => {
		const html = renderBlock("sCatalog");
		const root = parse(html);
		const captions = root.querySelectorAll(".product-item__caption");
		expect(captions.length).toBeGreaterThanOrEqual(1);
	});

	it("each product-item has a title", () => {
		const html = renderBlock("sCatalog");
		const root = parse(html);
		const titles = root.querySelectorAll(".product-item__title");
		expect(titles.length).toBeGreaterThanOrEqual(1);
	});

	it("matches HTML snapshot", () => {
		const html = renderBlock("sCatalog");
		expect(html).toMatchSnapshot();
	});
});

// ---------------------------------------------------------------------------
// product-item mixin (called standalone via sCatalog block file)
// ---------------------------------------------------------------------------
describe("product-item mixin", () => {
	it("renders title from arguments", () => {
		const html = renderBlock("sCatalog", {
			call: "+product-item('1', 'My Title', 'Asko CC4527S', '4.8')",
		});
		const root = parse(html);
		// product-item__title contains an anchor child
		expect(root.querySelector(".product-item__title")?.text.trim()).toContain(
			"Asko CC4527S"
		);
	});

	it("renders text from arguments", () => {
		const html = renderBlock("sCatalog", {
			call: "+product-item('1', 'My text', 'Asko CC4527S', '4.8')",
		});
		const root = parse(html);
		expect(root.querySelector(".product-item__text")?.text.trim()).toBe(
			"My text"
		);
	});

	it("renders price element", () => {
		const html = renderBlock("sCatalog", {
			call: "+product-item('1', 'Title', 'Model', '4.8')",
		});
		const root = parse(html);
		// product-item__price is the final price in the footer
		expect(root.querySelector(".product-item__price")).toBeTruthy();
	});
});

// ---------------------------------------------------------------------------
// form-wrap / input mixin
// ---------------------------------------------------------------------------
describe("form-wrap input mixin", () => {
	it("renders without throwing", () => {
		expect(() =>
			renderBlock("form-wrap", {
				call: "+input('Your name', 'text', 'Name label')",
			})
		).not.toThrow();
	});

	it("renders an input with the given placeholder", () => {
		const html = renderBlock("form-wrap", {
			call: "+input('Your name', 'text', 'Name label')",
		});
		const root = parse(html);
		const input = root.querySelector("input.form-control");
		expect(input?.getAttribute("placeholder")).toBe("Your name");
	});

	it("renders a label when label arg is provided", () => {
		const html = renderBlock("form-wrap", {
			call: "+input('Placeholder', 'text', 'Label text')",
		});
		const root = parse(html);
		expect(root.querySelector("label")).toBeTruthy();
		expect(root.querySelector(".input-title")?.text.trim()).toBe("Label text");
	});

	it("matches HTML snapshot", () => {
		const html = renderBlock("form-wrap", {
			call: "+input('Snapshot placeholder', 'text', 'Snapshot label')",
		});
		expect(html).toMatchSnapshot();
	});
});
