const express = require("express");
const dotenv = require("dotenv");
// const cron = require("node-cron");

dotenv.config();

const app = express();
app.use(express.json());

const dealsFinder = require("./dealsFinder");
const { readFromJson } = require("./utils");

// --- Rate limiting state for POST /run ---
const MIN_RUN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let lastRunTime = 0;

// POST /run - trigger the scraper and return new deals
app.post("/run", async (_req, res) => {
  try {
    const now = Date.now();
    if (now - lastRunTime < MIN_RUN_INTERVAL_MS) {
      return res.json({ deals: [], rateLimited: true });
    }

    const newDealz = await dealsFinder.find();
    lastRunTime = Date.now();
    res.json({ deals: newDealz });
  } catch (error) {
    console.error("Error in /run:", error);
    res
      .status(500)
      .json({ error: "An error occurred while running the scraper" });
  }
});

// GET /get - retrieve stored deals by time window
app.get("/get", async (req, res) => {
  try {
    const hours = parseFloat(req.query.hours) || 1;
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const data = await readFromJson("already_seen_dealz.json");
    const deals = (data && data.alreadySeenDealz) || [];
    const filtered = deals.filter((deal) => deal.date >= cutoff);

    res.json({ deals: filtered });
  } catch (error) {
    console.error("Error in /get:", error);
    res.status(500).json({ error: "An error occurred while getting deals" });
  }
});

app.listen(process.env.PORT, function onListen() {
  console.log(`Server running on port ${process.env.PORT}`);
});

// --- Cron scheduling (commented out - now triggered via POST /run) ---
// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
//   dealsFinder.find();
// });

// cron.schedule("* * * * 15", () => {
//   console.log("running a task every 15 minutes");
//   dealsFinder.find();
// });

// cron.schedule("*/10 5-23 * * *", () => {
//   console.log("running every 10 mins between 5am and 11pm");
//   dealsFinder.find();
// });

// module.exports.handler = serverless(app);
