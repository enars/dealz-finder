const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const FORUM_URL =
  "https://www.sweclockers.com/forum/trad/999559-dagens-fynd-bara-tips-ingen-diskussion-las-forsta-inlagget-forst";

function randomDelay(min, max) {
  return new Promise((resolve) =>
    setTimeout(resolve, min + Math.random() * (max - min)),
  );
}

async function runScraper() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--lang=sv-SE",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setExtraHTTPHeaders({ "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8" });

    await page.goto(FORUM_URL, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector(".forum-post", { timeout: 30000 });

    await randomDelay(1000, 3000);

    // Go to the latest dealzz
    const lastPageLink = await page.evaluate(() => {
      const link = document.querySelector(".pages a:last-child");
      return link ? link.href : null;
    });

    if (lastPageLink) {
      await randomDelay(500, 1500);
      await page.goto(lastPageLink, { waitUntil: "networkidle2", timeout: 60000 });
      await page.waitForSelector(".forum-post", { timeout: 30000 });
    }

    // Get the date of the latest dealzz
    const scrapedData = await page.evaluate(() => {
      const posts = document.querySelectorAll(".forum-post");
      if (!posts || posts.length === 0) return [];

      return Array.from(posts).map((deal) => ({
        date: deal.querySelector("time").getAttribute("datetime"),
        body: deal.querySelector(".bbParagraph").textContent,
      }));
    });

    return scrapedData || [];
  } catch (e) {
    console.error("Scraper failed:", e.message);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports.runScraper = runScraper;
