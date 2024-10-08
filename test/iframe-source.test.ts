import { expect, test } from "vitest";
import { iframeSource } from "../src/lib/iframe-source";

test("iframeSource returns a string", () => {
	const result = iframeSource(
		'console.log("Hello, World!");',
		"http://localhost:4321",
	);
	expect(typeof result).toBe("string");
});

test("iframeSource includes the passed code", () => {
	const code = 'console.log("Hello, World!");';
	const result = iframeSource(code, "http://localhost:4321");
	expect(result).toContain(code);
});

test("iframeSource includes necessary HTML tags", () => {
	const url = "http://localhost:4321";
	const result = iframeSource('console.log("Hello, World!");', url);
	expect(result).toContain("<!DOCTYPE html>");
	expect(result).toContain("<html>");
	expect(result).toContain("</html>");
	expect(result).toContain("<head>");
	expect(result).toContain("</head>");
	expect(result).toContain("<body>");
	expect(result).toContain("</body>");
	expect(result).toContain('<div id="sketch">');
	expect(result).toContain("</div>");
	expect(result).toContain(`<script src="${url}/lib/p5.min.js">`);
	expect(result).toContain("</script>");
	expect(result).toContain("<script defer>");
	expect(result).toContain("</script>");
	expect(result).toContain("<style>");
	expect(result).toContain("</style>");
});
