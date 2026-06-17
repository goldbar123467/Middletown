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

async function startNormalGame(page) {
  await page.goto(defaultUrl, { waitUntil: "networkidle" });
  await captureVisual(page, { name: "title", path: resolve(outputDir, "ui-smoke-title.png") });
  await page.getByRole("button", { name: /Mayor's Desk/i }).click();
  await page.waitForLoadState("networkidle");
  if (await page.getByLabel("Skip orientation").isVisible().catch(() => false)) {
    await page.getByLabel("Skip orientation").click();
  }
}

async function main() {
  await assertServerAvailable(defaultUrl);
  await mkdir(outputDir, { recursive: true });
  const { chromium } = await importPlaywright();
  const { browser, label } = await launchBrowser(chromium);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  try {
    await startNormalGame(page);
    await captureVisual(page, { name: "town", path: resolve(outputDir, "ui-smoke-town.png") });

    for (const labelText of ["Town", "Choices", "Money", "Map", "People", "Log"]) {
      if (!(await page.getByRole("button", { name: new RegExp(`^${labelText}$`, "i") }).isVisible())) {
        throw new Error(`Missing tab: ${labelText}`);
      }
    }

    await page.getByRole("button", { name: /^Choices$/i }).click();
    await page.locator(".action-card").first().waitFor({ state: "visible", timeout: 5000 });
    await page.locator("text=Small Wins").waitFor({ state: "visible", timeout: 5000 });
    await page.getByRole("heading", { name: /No New Money, Real Tradeoffs/i }).waitFor({ state: "visible", timeout: 5000 });
    await page.locator(".action-card").filter({ hasText: /Put on Agenda/i }).first().getByRole("button", { name: /Put on Agenda/i }).click();
    await page.locator("text=Resident reaction").waitFor({ state: "visible", timeout: 5000 });
    await page.locator(".action-card").filter({ hasText: /Start Project/i }).first().getByRole("button", { name: /Start Project/i }).click();
    await page.locator(".action-card").filter({ hasText: /Adopt Policy/i }).first().getByRole("button", { name: /Adopt Policy/i }).click();
    await page.getByRole("button", { name: /Run Audit/i }).click();
    await page.getByText(/audit costs staff time/i).waitFor({ state: "visible", timeout: 5000 });
    await page.getByRole("button", { name: /Declare Emergency/i }).click();
    await page.getByText(/emergency declaration unlocks capacity/i).waitFor({ state: "visible", timeout: 5000 });
    await captureVisual(page, { name: "choices", path: resolve(outputDir, "ui-smoke-choices.png") });

    await page.getByRole("button", { name: /^Money$/i }).click();
    const mayorBudget = page.getByLabel("Mayor's Office budget");
    await mayorBudget.fill("7");
    await page.locator("text=budget points").waitFor({ state: "visible", timeout: 5000 });

    await page.getByRole("button", { name: /^Map$/i }).click();
    await page.locator("text=open pothole calls").first().waitFor({ state: "visible", timeout: 5000 });
    await captureVisual(page, { name: "map", path: resolve(outputDir, "ui-smoke-map.png") });

    await page.getByRole("button", { name: /^People$/i }).click();
    await page.locator("text=Resident Problems").waitFor({ state: "visible", timeout: 5000 });
    await page.locator("text=Oldest Unresolved").waitFor({ state: "visible", timeout: 5000 });
    await page.locator("text=Most Urgent").waitFor({ state: "visible", timeout: 5000 });
    await page.locator("text=qtrs left").first().waitFor({ state: "visible", timeout: 5000 });

    console.log(`browser ui smoke passed with ${label}`);
  } finally {
    await browser.close();
  }
}

await main();
