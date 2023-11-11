import { expect, test } from "vitest";
import { iframeSource } from "../src/lib/iframe-source";

test("iframeSource returns a string", () => {
	const result = iframeSource('console.log("Hello, World!");');
	expect(typeof result).toBe("string");
});

test("iframeSource includes the passed code", () => {
	const code = 'console.log("Hello, World!");';
	const result = iframeSource(code);
	expect(result).toContain(code);
});

test("iframeSource includes necessary HTML tags", () => {
	const result = iframeSource('console.log("Hello, World!");');
	expect(result).toContain("<!DOCTYPE html>");
	expect(result).toContain("<html>");
	expect(result).toContain("</html>");
	expect(result).toContain("<head>");
	expect(result).toContain("</head>");
	expect(result).toContain("<body>");
	expect(result).toContain("</body>");
	expect(result).toContain('<div id="sketch">');
	expect(result).toContain("</div>");
	expect(result).toContain(
		`<script src="${import.meta.env.PUBLIC_BASE_URL}/lib/p5.js">`,
	);
	expect(result).toContain("</script>");
	expect(result).toContain("<script defer>");
	expect(result).toContain("</script>");
	expect(result).toContain("<style>");
	expect(result).toContain("</style>");
});
