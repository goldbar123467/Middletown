import { readdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));

async function collectTestFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTestFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".test.mjs")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

const testFiles = await collectTestFiles(testsDir);

for (const file of testFiles) {
  console.log(`\n> ${relative(process.cwd(), file)}`);
  await import(pathToFileURL(file).href);
}

console.log(`\n${testFiles.length} test files passed`);
