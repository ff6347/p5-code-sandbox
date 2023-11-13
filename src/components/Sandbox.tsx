import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import React from "react";
import "./sandox.css";
import "./cmdk-raycast.css";
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
import { RaycastCMDK } from "./CmdK";
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
	const [paletteIsOpen, setPaletteIsOpen] = React.useState(true);

	const debouncedSetCode = debounce((value) => setCode(value), 500);
	// Toggle the menu when ⌘K is pressed
	// React.useEffect(() => {
	// 	const down = (e) => {
	// 		console.log("down", e, e.key, e.metaKey, e.ctrlKey);
	// 		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
	// 			e.preventDefault();
	// 			console.log("down cmd k", e, e.key, e.metaKey, e.ctrlKey);

	// 			setPaletteIsOpen((open) => !open);
	// 		}
	// 	};

	// 	document.addEventListener("keydown", down);
	// 	return () => document.removeEventListener("keydown", down);
	// }, []);
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

	return (
		<>
			<RaycastCMDK
				paletteIsOpen={paletteIsOpen}
				setPaletteIsOpen={setPaletteIsOpen}
			/>
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
						onChange={(value, event) => {
							debouncedSetCode(value);
							// here is the current value
							// debounce(() => setCode((prev) => value));
						}}
						onMount={(editor, monaco) => {
							// console.log("onMount: the editor instance:", editor);
							// console.log("onMount: the monaco instance:", monaco);
							editor.addCommand(
								monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
								function () {
									console.log("comand/ctrl+k pressed");
									setPaletteIsOpen((open) => !open);
								},
							);
						}}
						beforeMount={(monaco) => {
							monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
								{
									...monaco.languages.typescript.javascriptDefaults.getDiagnosticsOptions(),
									noSemanticValidation: true,
									noSuggestionDiagnostics: false,
									noSyntaxValidation: false,
								},
							);

							monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
								{
									target: monaco.languages.typescript.ScriptTarget.ES2016,
									allowNonTsExtensions: true,
									moduleResolution:
										monaco.languages.typescript.ModuleResolutionKind.NodeJs,
								},
							);

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
							monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
								{
									...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
									checkJs: true, // need this
								},
							);

							// console.log("beforeMount: the monaco instance:", monaco);
						}}
						onValidate={(markers) => {
							// model markers
							// markers.forEach(marker => console.log('onValidate:', marker.message));
						}}
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
		</>
	);
}
