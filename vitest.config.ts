/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
	test: {
		exclude: [
			"**/e2e/**",
			"**/tests-examples/**",
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
		],
		/* for example, use global to avoid globals imports (describe, test, expect): */
		// globals: true,
	},
});
