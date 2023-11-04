import "monaco-editor/esm/vs/editor/contrib/links/browser/links";
import "monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/inlineCompletionsController";
import "monaco-editor/esm/vs/platform/accessibility/browser/accessibilityService";
import "monaco-editor/esm/vs/editor/contrib/hover/browser/hover";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import "monaco-editor/esm/vs/editor/editor.all.js";

import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js";
import "monaco-editor/esm/vs/language/json/monaco.contribution";
import "monaco-editor/esm/vs/basic-languages/monaco.contribution";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
//@ts-ignore
import globals from "@types/p5/global.d.ts?raw";
//@ts-ignore
import constants from "@types/p5/constants.d.ts?raw";
//@ts-ignore
import index from "@types/p5/index.d.ts?raw";

import { elements } from "../utils/dom";

const editorCode = /* html */ `
function setup(){
	createCanvas(100, 100);
	background(0);
}
function draw(){

}
`.trim();

const editorOptions = {
	value: editorCode,
	language: "javascript",
	theme: "vs",
	lineNumbers: "on",

	wordWrap: "wordWrapColumn",
	wordWrapColumn: 80,
	roundedSelection: false,
	scrollBeyondLastLine: false,
	automaticLayout: true,
	cursorStyle: "text",
	minimap: {
		enabled: true,
	},
	fontFamily: "IBM Plex Mono, monospace",
	fontSize: 16,
	tabSize: 2,
	accessibilitySupport: "on",
};
// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: true,
	noSyntaxValidation: false,
});

// compiler options
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
//TODO: Add sound add on
const monacoEditor = monaco.editor.create(elements.editor, editorOptions);

export { monacoEditor as default };
