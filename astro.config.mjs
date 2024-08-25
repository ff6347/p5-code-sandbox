import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";
import react from "@astrojs/react";
// https://astro.build/config
//

const pwa = AstroPWA({
	mode: "development",
	base: "/",
	scope: "/",
	includeAssets: [
		"favicon.svg",
		"p5-sandbox-icon-192x192.png",
		"p5-sandbox-icon-512x512.png",
		"lib/p5.js",
		"lib/p5.min.js",
		"lib/addons/p5.sound.js",
		"lib/addons/p5.sound.min.js",
	],
	registerType: "autoUpdate",
	manifest: {
		name: "P5 Code Sandbox",
		short_name: "P5Sandbox",
		description:
			"A code sandbox powered by Monaco editor for testing p5.js code",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "p5-sandbox-icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "p5-sandbox-icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		categories: ["development", "education", "productivity"],
		// related_applications: [],
		// prefer_related_applications: false,
	},
	workbox: {
		navigateFallback: "/",
		globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
	},
	devOptions: {
		enabled: true,
		navigateFallbackAllowlist: [/^\//],
	},
	experimental: {
		directoryAndTrailingSlashHandler: true,
	},
});
export default defineConfig({
	// test if we are in a test env
	// currently it seems that in the vite pwa integration
	// the plugins for the section astro:config:done are not
	// updated well.
	// see https://github.com/vite-pwa/astro/blob/d6960671ace5669ea0b760593ef70b34b4d11232/src/index.ts#L72
	// need to create a real test for this
	integrations: [pwa, react()],
});
