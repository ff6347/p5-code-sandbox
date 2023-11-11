import debounce from "lodash.debounce";
import React from "react";
import "./sandox.css";

import Editor from "@monaco-editor/react";
//@ts-ignore
import globals from "@types/p5/global.d.ts?raw";
//@ts-ignore
import constants from "@types/p5/constants.d.ts?raw";
//@ts-ignore
import index from "@types/p5/index.d.ts?raw";
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
		console.log("code changed");
		if (iframeRef.current) {
			const iframe = iframeRef.current;

			const source = /* html */ `
			<!DOCTYPE html>
				<html>
					<head>
						<link rel="stylesheet" href="/iframe.css">
						<script src="${import.meta.env.PUBLIC_BASE_URL}/lib/p5.js"></script>

						<style>
				body {
					font-family: "Inter", sans-serif;
					overflow: hidden;
				}
				body {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100vh;
					/* remove default padding */
					padding: 0;
					/* remove default margins */
					margin: 0 auto;
				}</style>
						</head>
						<body>
								<div id="sketch"></div>
								<script defer>${code}</script>
						</body>
						</html>
				`;
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
	const handleEditorChange = (value, event) => {
		debouncedSetCode(value);
		// here is the current value
		// debounce(() => setCode((prev) => value));
	};

	const handleEditorDidMount = (editor, monaco) => {
		// console.log("onMount: the editor instance:", editor);
		// console.log("onMount: the monaco instance:", monaco);
	};

	const handleEditorWillMount = (monaco) => {
		monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
			...monaco.languages.typescript.javascriptDefaults.getDiagnosticsOptions(),
			noSemanticValidation: true,
			noSuggestionDiagnostics: false,
			noSyntaxValidation: false,
		});

		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monaco.languages.typescript.ScriptTarget.ES2016,
			allowNonTsExtensions: true,
			moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
		});

		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			globals,
			"@types/p5/global.d.ts",
		);

		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			constants,
			"@types/p5/constants.d.ts",
		);

		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			index,
			"@types/p5/index.d.ts",
		);
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
			checkJs: true, // need this
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

						wordWrap: "wordWrapColumn",
						wordWrapColumn: 80,
						roundedSelection: false,
						scrollBeyondLastLine: false,
						automaticLayout: true,
						cursorStyle: "block",
						cursorBlinking: "blink",
						minimap: {
							enabled: true,
						},
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: 18,
						tabSize: 2,
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
