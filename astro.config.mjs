import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions";
import react from "@astrojs/react";
const isOnNetlifyCI = process.env.NETLIFY === "true";
// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	output: isOnNetlifyCI ? "server" : undefined,
	adapter: isOnNetlifyCI ? netlify() : undefined,
});
