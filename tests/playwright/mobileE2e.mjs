import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreOptionText } from "./rlPolicy.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../..");
const outputDir = resolve(rootDir, "playwright-results");
const defaultUrl = process.env.MIDDLETOWN_URL ?? "http://127.0.0.1:5175/";
const mobileContext = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
};

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
  const failures = [];
  for (const attempt of attempts) {
    try {
      return { browser: await chromium.launch(attempt.options), label: attempt.label };
    } catch (error) {
      failures.push(`${attempt.label}: ${error.message.split("\n")[0]}`);
    }
  }
  throw new Error(`Could not launch a Playwright browser.\n${failures.join("\n")}`);
}

function scenarioUrl(scenario) {
  const url = new URL(defaultUrl);
  url.searchParams.set("scenario", scenario);
  return url.toString();
}

async function assertNoHorizontalOverflow(page, label) {
  const result = await page.evaluate(() => {
    const width = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const offenders = Array.from(document.querySelectorAll("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: String(element.className ?? "").slice(0, 80),
          text: String(element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((item) => item.width > 1 && (item.left < -8 || item.right > width + 8))
      .slice(0, 8);

    return { width, scrollWidth, offenders };
  });

  if (result.scrollWidth > result.width + 4) {
    throw new Error(`Mobile horizontal overflow during ${label}: ${JSON.stringify(result)}`);
  }
}

async function screenshot(page, name) {
  await page.screenshot({ path: resolve(outputDir, `${name}.png`), fullPage: true });
}

async function bestVisibleOption(page) {
  const options = await page.locator(".event-option").all();
  if (!options.length) return null;

  let best = { option: options[0], score: Number.NEGATIVE_INFINITY };
  for (const option of options) {
    const text = await option.innerText();
    const score = scoreOptionText(text);
    if (score > best.score) {
      best = { option, score };
    }
  }
  return best.option;
}

async function chooseEventIfPresent(page, label) {
  const option = await bestVisibleOption(page);
  if (!option) return false;
  await assertNoHorizontalOverflow(page, `${label} event`);
  await option.tap();
  await page.waitForTimeout(80);
  return true;
}

async function tapTab(page, label) {
  await page.getByRole("button", { name: new RegExp(`^${label}$`, "i") }).tap();
  await page.waitForTimeout(80);
  await assertNoHorizontalOverflow(page, `${label} tab`);
}

async function assertTouchTargets(page, label) {
  const smallTargets = await page.evaluate(() => Array.from(document.querySelectorAll("button, input, [role='button']"))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        text: String(element.textContent ?? element.getAttribute("aria-label") ?? "").trim().replace(/\s+/g, " ").slice(0, 60),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    })
    .filter((item) => item.width > 0 && item.height > 0 && (item.width < 32 || item.height < 32))
    .slice(0, 8));

  if (smallTargets.length) {
    throw new Error(`Small mobile touch targets during ${label}: ${JSON.stringify(smallTargets)}`);
  }
}

async function startNormalMobileGame(page) {
  await page.goto(defaultUrl, { waitUntil: "networkidle" });
  await page.getByText("Middletown").waitFor({ state: "visible", timeout: 5000 });
  await assertNoHorizontalOverflow(page, "title");
  await assertTouchTargets(page, "title");
  await screenshot(page, "mobile-e2e-title");
  await page.getByRole("button", { name: /Mayor's Desk/i }).tap();
  await page.waitForLoadState("networkidle");
  if (await page.getByLabel("Skip orientation").isVisible().catch(() => false)) {
    await page.getByLabel("Skip orientation").tap();
  }
  await page.getByRole("button", { name: /Run Quarter/i }).waitFor({ state: "visible", timeout: 5000 });
  await assertNoHorizontalOverflow(page, "start management");
}

async function exerciseTabsAndActions(page) {
  for (const label of ["Town", "Choices", "Money", "Map", "People", "Log"]) {
    await tapTab(page, label);
  }

  await tapTab(page, "Choices");
  await page.locator(".action-card").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("text=Small Wins").waitFor({ state: "visible", timeout: 5000 });
  await assertTouchTargets(page, "choices");
  await page.locator(".action-card").filter({ hasText: /Put on Agenda/i }).first().getByRole("button", { name: /Put on Agenda/i }).tap();
  await page.locator("text=Resident reaction").waitFor({ state: "visible", timeout: 5000 });
  await page.locator(".action-card").filter({ hasText: /Start Project/i }).first().getByRole("button", { name: /Start Project/i }).tap();
  await page.locator(".action-card").filter({ hasText: /Adopt Policy/i }).first().getByRole("button", { name: /Adopt Policy/i }).tap();
  await page.getByRole("button", { name: /Run Audit/i }).tap();
  await page.getByText(/audit costs staff time/i).waitFor({ state: "visible", timeout: 5000 });
  await screenshot(page, "mobile-e2e-choices");

  await tapTab(page, "Money");
  await page.getByLabel("Mayor's Office budget").fill("7");
  await page.getByText(/budget points/i).waitFor({ state: "visible", timeout: 5000 });
  await screenshot(page, "mobile-e2e-money");

  await tapTab(page, "Map");
  await page.locator("text=open pothole calls").first().waitFor({ state: "visible", timeout: 5000 });
  await screenshot(page, "mobile-e2e-map");

  await tapTab(page, "People");
  await page.locator("text=Resident Problems").waitFor({ state: "visible", timeout: 5000 });
  await page.locator("text=Oldest Unresolved").waitFor({ state: "visible", timeout: 5000 });
  await page.locator("text=Most Urgent").waitFor({ state: "visible", timeout: 5000 });
  await screenshot(page, "mobile-e2e-people");
}

async function playMobileQuarter(page, turn) {
  if (turn % 2 === 0) {
    await tapTab(page, "Choices");
    const action = page.locator(".action-card").filter({ hasText: /Put on Agenda/i }).first();
    if (await action.isVisible().catch(() => false)) {
      await action.getByRole("button", { name: /Put on Agenda/i }).tap();
      await page.waitForTimeout(60);
    }
  }

  await page.getByRole("button", { name: /Run Quarter/i }).tap();
  await page.waitForTimeout(120);
  await chooseEventIfPresent(page, `Q${turn} council`);

  if (await page.getByRole("button", { name: /Read the Headlines/i }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: /Read the Headlines/i }).tap();
    await page.waitForTimeout(80);
  }
  await chooseEventIfPresent(page, `Q${turn} news`);

  if (await page.getByRole("button", { name: /Advance Quarter/i }).isVisible().catch(() => false)) {
    await page.getByRole("button", { name: /Advance Quarter/i }).tap();
    await page.waitForTimeout(120);
  }

  await page.getByRole("button", { name: /Run Quarter/i }).waitFor({ state: "visible", timeout: 5000 });
  await assertNoHorizontalOverflow(page, `Q${turn} management return`);
}

async function verifyEndStatesMobile(page) {
  await page.goto(scenarioUrl("victory"), { waitUntil: "networkidle" });
  await page.getByText(/25-Year Record/i).waitFor({ state: "visible", timeout: 5000 });
  await page.getByText(/The Anti-Pot Mayor/i).waitFor({ state: "visible", timeout: 5000 });
  await page.getByText(/The People's Mayor/i).waitFor({ state: "visible", timeout: 5000 });
  await assertNoHorizontalOverflow(page, "mobile victory");
  await screenshot(page, "mobile-e2e-victory");

  await page.goto(scenarioUrl("gameover"), { waitUntil: "networkidle" });
  await page.getByText(/Term Ends Early/i).waitFor({ state: "visible", timeout: 5000 });
  await page.getByText(/Middletown Breaks Faith/i).waitFor({ state: "visible", timeout: 5000 });
  await assertNoHorizontalOverflow(page, "mobile game over");
  await screenshot(page, "mobile-e2e-gameover");
}

async function main() {
  await assertServerAvailable(defaultUrl);
  await mkdir(outputDir, { recursive: true });
  const { chromium } = await importPlaywright();
  const { browser, label } = await launchBrowser(chromium);
  const context = await browser.newContext(mobileContext);
  const page = await context.newPage();
  const runtimeErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  try {
    await startNormalMobileGame(page);
    await exerciseTabsAndActions(page);

    for (let turn = 1; turn <= 12; turn += 1) {
      await playMobileQuarter(page, turn);
      if (turn % 4 === 0) {
        await tapTab(page, "People");
        await page.locator("text=Resident Problems").waitFor({ state: "visible", timeout: 5000 });
        await tapTab(page, "Map");
        await page.locator("text=open pothole calls").first().waitFor({ state: "visible", timeout: 5000 });
      }
    }

    await verifyEndStatesMobile(page);

    if (runtimeErrors.length) {
      throw new Error(`Mobile runtime errors:\n${runtimeErrors.join("\n")}`);
    }

    console.log(`mobile e2e passed with ${label}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

await main();
