require("esbuild").buildSync({
	entryPoints: [ "src/init.ts" ],
	bundle: true,
	minify: true,
	sourcemap: true,
	format: "iife",
	outfile: "docs/bundle.js",
})
