import esbuild from "esbuild";
import { performance } from "node:perf_hooks";

const start = performance.now();

await esbuild.build({
  entryPoints: ["./src/cli.ts"],
  platform: "node",
  minify: true,
  outfile: "dist/cli.js",
});

const end = performance.now();

console.log(`Build time: ${((end - start) / 1000).toFixed(2)}s`);
