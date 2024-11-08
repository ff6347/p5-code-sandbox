import debounce from "lodash.debounce";
import React from "react";
import "./sandox.css";
import * as Babel from "@babel/standalone";
import protect from "@freecodecamp/loop-protect";

const timeout = 100;
Babel.registerPlugin(
	"loopProtect",
	protect(timeout, (line: number) => {
		throw new Error(`Bad infinite loop on line ${line}`);
	}),
);
const transform = (source: string) =>
	Babel.transform(source, {
		plugins: ["loopProtect"],
	}).code;

import * as prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import {
	Editor,
	type BeforeMount,
	type OnChange,
	type OnMount,
} from "@monaco-editor/react";
//@ts-ignore
import globals from "@types/p5/global.d.ts?raw";
//@ts-ignore
import constants from "@types/p5/constants.d.ts?raw";
//@ts-ignore
import index from "@types/p5/index.d.ts?raw";
//@ts-ignore
import literals from "@types/p5/literals.d.ts?raw";
//@ts-ignore
import sound from "@types/p5/lib/addons/p5.sound.d.ts?raw";
import { useLocalStorage } from "../hooks/use-local-storage";
import { iframeSource } from "../lib/iframe-source";

interface SandboxProps {
	title: string;
	description: string;
	initialCode: string;
	disableStorage: boolean;
}

export default function Sandbox({ disableStorage, initialCode }: SandboxProps) {
	const iframeRef = React.useRef(null);
	const [viewportWidth, setViewportWidth] = React.useState(window.innerWidth);
	const [viewportHeight, setViewportHeight] = React.useState(
		window.innerHeight,
	);
	const baseUrl = new URL(window.location.href);

	const [code, setCode] = useLocalStorage(
		"p5.inpayjamas.dev",
		initialCode,
		disableStorage,
	);

	const debouncedSetCode = debounce((value) => setCode(value), 500);
	React.useEffect(() => {
		const handleResize = () => setViewportWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	React.useEffect(() => {
		const handleResize = () => setViewportHeight(window.innerHeight);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	React.useEffect(() => {
		if (iframeRef.current) {
			const iframe = iframeRef.current;

			// do the inifite loop protection

			try {
				const protectedCode = transform(code);
				const source = iframeSource(protectedCode, baseUrl.origin);
				const iframeParent = iframe.parentElement;

				if (iframeParent) {
					iframeParent.removeChild(iframe);
					const blob = new Blob([source], { type: "text/html" });
					const blobUrl = URL.createObjectURL(blob);
					iframe.src = blobUrl;
					iframeParent.appendChild(iframe);
				}
			} catch (e) {
				console.error(e);
			}
		}
	}, [code]);
	const handleEditorChange: OnChange = (value, event) => {
		debouncedSetCode(value);
		// here is the current value
		// debounce(() => setCode((prev) => value));
	};

	const handleEditorDidMount: OnMount = (editor, monaco) => {
		// console.log("onMount: the editor instance:", editor);
		// console.log("onMount: the monaco instance:", monaco);
	};

	const handleEditorWillMount: BeforeMount = (monaco) => {
		monaco.languages.registerDocumentFormattingEditProvider("javascript", {
			provideDocumentFormattingEdits: async (model) => {
				const text = await prettier.format(model.getValue(), {
					parser: "babel",
					printWidth: 50,
					useTabs: true,
					proseWrap: "always",
					semi: true,
					singleQuote: true,
					trailingComma: "es5",
					bracketSpacing: true,
					singleAttributePerLine: true,
					plugins: [parserBabel, prettierPluginEstree],
				});
				return [
					{
						range: model.getFullModelRange(),
						text,
					},
				];
			},
		});

		monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
			...monaco.languages.typescript.javascriptDefaults.getDiagnosticsOptions(),
			noSemanticValidation: true,
			noSuggestionDiagnostics: false,
			noSyntaxValidation: false,
		});

		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			checkJs: true,
			allowJs: true,
			alwaysStrict: true,
			target: monaco.languages.typescript.ScriptTarget.ES2016,
			allowNonTsExtensions: true,
			moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
		});
		const opts =
			monaco.languages.typescript.typescriptDefaults.getCompilerOptions();
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions(opts);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			globals,
			"@types/p5/global.d.ts",
		);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			constants,
			"@types/p5/constants.d.ts",
		);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			literals,
			"@types/p5/literals.d.ts",
		);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			index,
			"@types/p5/index.d.ts",
		);
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			sound,
			"@types/p5/lib/addons/p5.sound.d.ts",
		);
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
		});
		// console.log("beforeMount: the monaco instance:", monaco);
	};

	function handleEditorValidation(markers) {
		// model markers
		// markers.forEach(marker => console.log('onValidate:', marker.message));
	}
	return (
		<div className="sandbox">
			{/* <div className="loading" data-loading>
				<div className="loader"></div>
				<h1>Loading P5.js Sandbox</h1>
			</div> */}
			<section className="code">
				<Editor
					height="100%"
					defaultLanguage="javascript"
					theme="vs"
					options={{
						lineNumbers: "on",
						formatOnPaste: true,
						wordWrap: "wordWrapColumn",
						wordWrapColumn: viewportWidth < 600 ? 35 : 50,
						roundedSelection: false,
						scrollBeyondLastLine: false,
						automaticLayout: true,
						cursorStyle: "line",
						fontLigatures: false,
						cursorBlinking: "blink",
						minimap: {
							enabled: true,
						},
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: viewportWidth < 600 ? 14 : 18,
						tabSize: 2,
						insertSpaces: false,
						rulers: [50],
						accessibilitySupport: "on",
					}}
					defaultValue={code}
					onChange={handleEditorChange}
					onMount={handleEditorDidMount}
					beforeMount={handleEditorWillMount}
					onValidate={handleEditorValidation}
					// @ts-ignore
					client:only
				/>
			</section>

			<section className="result">
				<div className="output">
					<iframe ref={iframeRef} data-iframe></iframe>
				</div>
			</section>
		</div>
	);
}
