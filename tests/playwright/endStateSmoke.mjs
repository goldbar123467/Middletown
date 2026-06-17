import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { captureVisual } from "./visualAssertions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../..");
const outputDir = resolve(rootDir, "playwright-results");
const defaultUrl = process.env.MIDDLETOWN_URL ?? "http://127.0.0.1:5175/";

async function importPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    throw new Error(`Playwright is not available. ${error.message}`);
  }
}

async function assertServerAvailable(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    throw new Error(`Middletown is not reachable at ${url}. Start it with: npm run dev -- --host 127.0.0.1 --port 5175\n${error.message}`);
  }
}

async function launchBrowser(chromium) {
  const attempts = [
    { label: "bundled Chromium", options: { headless: true } },
    { label: "Microsoft Edge", options: { headless: true, channel: "msedge" } },
    { label: "Google Chrome", options: { headless: true, channel: "chrome" } },
  ];
  for (const attempt of attempts) {
    try {
      return { browser: await chromium.launch(attempt.options), label: attempt.label };
    } catch {
      // Try the next locally installed browser.
    }
  }
  throw new Error("Could not launch a Playwright browser.");
}

function scenarioUrl(scenario) {
  const url = new URL(defaultUrl);
  url.searchParams.set("scenario", scenario);
  return url.toString();
}

async function main() {
  await assertServerAvailable(defaultUrl);
  await mkdir(outputDir, { recursive: true });
  const { chromium } = await importPlaywright();
  const { browser, label } = await launchBrowser(chromium);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  try {
    await page.goto(scenarioUrl("victory"), { waitUntil: "networkidle" });
    await page.getByText(/25-Year Record/i).waitFor({ state: "visible", timeout: 5000 });
    await page.getByText(/Middletown finishes 100 quarters/i).waitFor({ state: "visible", timeout: 5000 });
    await page.getByText(/Century Mayor/i).waitFor({ state: "visible", timeout: 5000 });
    await page.getByText(/The Anti-Pot Mayor/i).waitFor({ state: "visible", timeout: 5000 });
    await page.getByText(/The People's Mayor/i).waitFor({ state: "visible", timeout: 5000 });
    await captureVisual(page, { name: "victory", path: resolve(outputDir, "ui-smoke-victory.png") });

    await page.goto(scenarioUrl("gameover"), { waitUntil: "networkidle" });
    await page.getByText(/Term Ends Early/i).waitFor({ state: "visible", timeout: 5000 });
    await page.getByText(/Middletown Breaks Faith/i).waitFor({ state: "visible", timeout: 5000 });
    await captureVisual(page, { name: "gameover", path: resolve(outputDir, "ui-smoke-gameover.png") });
    await page.getByRole("button", { name: /Try Another Term/i }).click();
    await page.getByText(/Mayor's Desk/i).first().waitFor({ state: "visible", timeout: 5000 });

    console.log(`browser end-state smoke passed with ${label}`);
  } finally {
    await browser.close();
  }
}

await main();
