const puppeteer = require("puppeteer");

async function runScraper() {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();

    await page.goto(
      "https://www.sweclockers.com/forum/trad/999559-dagens-fynd-bara-tips-ingen-diskussion-las-forsta-inlagget-forst"
    );

    // Go to the latest dealzz
    await page.evaluate(() => {
      document.querySelector(".pages a:last-child").click();
    });

    console.log(await page.url());

    // Make sure new url is loaded
    await page.waitForSelector(".pages a:last-child", {
      visible: true,
    });

    // Get the date of the latest dealzz
    const scrapedData = await page.evaluate(() => {
      const dealzz = Array.from(document.querySelectorAll(".forum-post")).map(
        (deal) => ({
          date: deal.querySelector("time").getAttribute("datetime"),
          body: deal.querySelector(".bbParagraph").textContent,
        })
      );

      return dealzz;
    });

    // console.log("scrapedData: ", scrapedData);
    return scrapedData;
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

module.exports.runScraper = runScraper;
