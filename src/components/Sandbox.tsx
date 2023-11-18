import debounce from "lodash.debounce";
import React from "react";
import "./sandox.css";

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

	const [code, setCode] = useLocalStorage(
		"p5.inpayjamas.dev",
		initialCode,
		disableStorage,
	);

	const debouncedSetCode = debounce((value) => setCode(value), 500);

	React.useEffect(() => {
		if (iframeRef.current) {
			const iframe = iframeRef.current;

			const source = iframeSource(code);
			const iframeParent = iframe.parentElement;

			if (iframeParent) {
				iframeParent.removeChild(iframe);
				const blob = new Blob([source], { type: "text/html" });
				const blobUrl = URL.createObjectURL(blob);
				iframe.src = blobUrl;
				iframeParent.appendChild(iframe);
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
					height="100vh"
					defaultLanguage="javascript"
					theme="vs"
					options={{
						lineNumbers: "on",
						formatOnPaste: true,
						wordWrap: "wordWrapColumn",
						wordWrapColumn: 50,
						roundedSelection: false,
						scrollBeyondLastLine: false,
						automaticLayout: true,
						cursorStyle: "line",
						fontLigatures: true,
						cursorBlinking: "blink",
						minimap: {
							enabled: true,
						},
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: 18,
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
