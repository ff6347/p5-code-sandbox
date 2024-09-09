/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/client" />
interface ImportMetaEnv {
	readonly PUBLIC_BASE_URL: string;

	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
