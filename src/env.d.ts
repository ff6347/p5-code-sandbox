/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/info" />
interface ImportMetaEnv {
	readonly PUBLIC_BASE_URL: string;

	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
