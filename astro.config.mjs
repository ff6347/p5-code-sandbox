import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	// output: "server",
	// adapter: netlify(),
});
