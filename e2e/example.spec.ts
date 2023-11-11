import { test, expect } from "@playwright/test";

test("contains function setup/draw", async ({ page }) => {
	await page.goto("/");
	await page.waitForLoadState("networkidle");

	const editorContent = await page.textContent(".code");
	expect(editorContent).toMatch(/function\s+setup/);
	expect(editorContent).toMatch(/function\s+draw/);
});

test("basic screenshot", async ({ page }) => {
	await page.goto("/");
	await page.waitForLoadState("networkidle");

	const viewport = await page.viewportSize();
	await page.screenshot({
		path: "e2e/screenshots/basic-screenshot.png",
		clip: {
			x: 0,
			y: 0,
			width: viewport.width / 2,
			height: viewport.height,
		},
	});
});
