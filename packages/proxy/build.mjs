import { performance } from "node:perf_hooks";
import esbuild from "esbuild";

const start = performance.now();

await esbuild.build({
  entryPoints: ["./src/cli.ts"],
  banner: { js: "#!/usr/bin/env node" },
  platform: "node",
  minify: true,
  outfile: "dist/cli.js",
});

const end = performance.now();

console.log(`Build time: ${((end - start) / 1000).toFixed(2)}s`);
