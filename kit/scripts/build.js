import util from "node:util";
import child_process from "node:child_process";
const exec = util.promisify(child_process.exec);
import fs from "node:fs/promises";

async function main() {
  try {
    await exec("pnpm run --filter='*kit' bundle");
    console.log("Build process completed successfully.");
    const filepath = "./dist/cli.js";
    // Read the cli file
    const data = await fs.readFile(filepath, "utf8");
    // Replace the assert with the with keyword
    const modifiedData = data.replace("assert", "with");
    // Write the modified content back
    await fs.writeFile(filepath, modifiedData, "utf8");
    console.log("CLI file modified successfully.");
  } catch (error) {
    console.error("Error during build process:", error);
  }
}

main();
