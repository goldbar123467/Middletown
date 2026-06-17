import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const include = new Set([".js", ".jsx", ".mjs", ".md", ".css", ".html", ".json"]);
const skip = new Set(["node_modules", "dist"]);

function files(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...files(full));
    else if (include.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

let total = 0;
for (const file of files(root)) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).length;
  total += lines;
}
console.log(total);
