const fs = require("fs"); // Add this line

async function randomDelay() {
  let randomWait = Math.random() * 30000;
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

function convertToHtml(data) {
  let html = "<ul>";
  data.forEach((item) => {
    html += `<li><h2>${item.date}</h2><p>${item.body.replace(
      /\n/g,
      "<br>"
    )}</p></li>`;
  });
  html += "</ul>";
  return html;
}

module.exports.convertToHtml = convertToHtml;
module.exports.randomDelay = randomDelay;
module.exports.writeToJson = writeToJson;
module.exports.readFromJson = readFromJson;
