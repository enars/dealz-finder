const express = require("express");
const dotenv = require("dotenv");
let cron = require("node-cron");

dotenv.config();

const app = express();
const dealsFinder = require("./dealsFinder");
const { readFromJson } = require("./utils");

app.get("/", async (_req, res) => {
  try {
    const results = await readFromJson("already_seen_dealz.json");
    res.send(results);
  } catch (error) {
    res.status(500).send({ error: "An error occurred while scraping" });
  }
});

app.listen(process.env.PORT, async function onListen() {
  console.log("runs!");
  dealsFinder.find();
});

// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
//   dealsFinder.find();
// });

// cron.schedule("* * * * 15", () => {
//   console.log("running a task every 15 minutes");
//   dealsFinder.find();
// });

cron.schedule("0 0/20 7-22 * * *", () => {
  console.log("running every 20 mins between 7am and 10pm");
  dealsFinder.find();
});
