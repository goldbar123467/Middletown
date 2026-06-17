import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const baselinePath = resolve(__dirname, "visualBaselines.json");
const baselines = JSON.parse(await readFile(baselinePath, "utf8"));

function pngDimensions(buffer) {
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error("Screenshot is not a PNG.");
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export async function captureVisual(page, { name, path, fullPage = true }) {
  const baseline = baselines[name];
  if (!baseline) {
    throw new Error(`Missing visual baseline for ${name}.`);
  }

  const buffer = await page.screenshot({ path, fullPage });
  const dimensions = pngDimensions(buffer);
  const failures = [];

  if (dimensions.width !== baseline.width) {
    failures.push(`width ${dimensions.width} != ${baseline.width}`);
  }
  if (dimensions.height < baseline.minHeight || dimensions.height > baseline.maxHeight) {
    failures.push(`height ${dimensions.height} outside ${baseline.minHeight}-${baseline.maxHeight}`);
  }
  if (buffer.length < baseline.minBytes || buffer.length > baseline.maxBytes) {
    failures.push(`bytes ${buffer.length} outside ${baseline.minBytes}-${baseline.maxBytes}`);
  }

  if (failures.length) {
    throw new Error(`Visual baseline failed for ${name}: ${failures.join(", ")}`);
  }

  return {
    bytes: buffer.length,
    width: dimensions.width,
    height: dimensions.height,
  };
}
