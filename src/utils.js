const fs = require("fs"); // Add this line

async function randomDelay() {
  let randomWait = Math.random() * 10000;
  console.log("waiting for " + randomWait + "ms");
  return new Promise((resolve) => setTimeout(resolve, randomWait));
}

function writeToJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data));
}

async function readFromJson(file) {
  try {
    const data = await fs.readFileSync(file, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file: ", error);
  }
}

module.exports.randomDelay = randomDelay;
module.exports.writeToJson = writeToJson;
module.exports.readFromJson = readFromJson;
