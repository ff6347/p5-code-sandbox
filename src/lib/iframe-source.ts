export function iframeSource(code: string, baseUrl: string) {
	return /* html */ `
	<!DOCTYPE html>
		<html>
			<head>
				<link rel="stylesheet" href="/iframe.css">
				<script src="${baseUrl}/lib/p5.js"></script>

				<style>
		body {
			font-family: system-ui, sans-serif;
			overflow: hidden;
		}
		pre, code {
			font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
			font-weight: normal;
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
}
