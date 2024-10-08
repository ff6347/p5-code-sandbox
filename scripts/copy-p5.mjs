// @ts-check
import fs from "node:fs";
import path from "node:path";
const filesToCopy = [
	{ src: "./node_modules/p5/lib/p5.min.js", dest: "./public/lib/p5.min.js" },
	{
		src: "./node_modules/p5/lib/addons/p5.sound.min.js",
		dest: "./public/lib/addons/p5.sound.min.js",
	},
];

filesToCopy.forEach((file) => {
	const src = path.resolve(process.cwd(), `${file.src}`);
	const dest = path.resolve(process.cwd(), `${file.dest}`);
	fs.copyFileSync(src, dest);
});
