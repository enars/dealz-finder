import express, { Router } from "express";

const dotenv = require("dotenv");
const cron = require("node-cron");
const serverless = require("serverless-http");

dotenv.config();

const api = express();
const router = Router();

const dealsFinder = require("./dealsFinder");
const { readFromJson, convertToHtml } = require("./utils");

router.get("/", async (_req, res) => {
  try {
    const results = await readFromJson("already_seen_dealz.json");
    res.send(convertToHtml(results));
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while getting the latest" });
  }
});

api.listen(process.env.PORT, async function onListen() {
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
api.use("/.netlify/functions/api", router);

cron.schedule("0 0/20 7-22 * * *", () => {
  console.log("running every 20 mins between 7am and 10pm");
  dealsFinder.find();
});

module.exports.handler = serverless(api);
