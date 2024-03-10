const scraper = require("./scraper");
const { readFromJson, writeToJson, randomDelay } = require("./utils");
const email = require("./email");

const FIVE_HOURS = 24 * 60;

async function find() {
  let lastCheckedTime = await readFromJson("last_checked_datetime.json");
  let alreadySeenDealz = await readFromJson("already_seen_dealz.json");

  if (lastCheckedTime) {
    lastCheckedTime = new Date(lastCheckedTime.lastCheckedTime);
  } else {
    console.log("No lastCheckedTime, setting it to now");
    lastCheckedTime = new Date();
  }

  lastCheckedTime.setMinutes(lastCheckedTime.getMinutes() - FIVE_HOURS);

  await randomDelay();

  await scraper
    .runScraper()
    .then((data) => {
      // Filter new dealz
      const filteredDealz = data.filter(
        (deal) => deal.date > lastCheckedTime.toISOString()
      );

      // Filter seen dealz
      const newDealz = filteredDealz.filter((deal) => {
        return (
          deal &&
          !alreadySeenDealz.alreadySeenDealz.some(
            (seenDeal) => seenDeal.body === deal.body
          )
        );
      });

      writeToJson("already_seen_dealz.json", {
        alreadySeenDealz: data,
      });
      // Log & Send new dealz
      if (newDealz.length > 0) {
        email.send(newDealz);
        console.log("newDealz", newDealz);
      } else {
        console.log("No new dealz");
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    })
    .finally(() => {
      // Update files
      lastCheckedTime = new Date();
      writeToJson("last_checked_datetime.json", { lastCheckedTime });
    });
}

module.exports.find = find;
