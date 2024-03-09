const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

function send(data) {
  const html = convertToHtml(data);
  transporter.sendMail(
    {
      from: process.env.LOGINUSER,
      to: process.env.SENDTO,
      subject: "Scraper has run found dealz!",
      html: html,
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.LOGINUSER,
    pass: process.env.LOGINPASS,
  },
});
// user: process.env.LOGINUSER,
// pass: process.env.LOGINPASS,

function convertToHtml(data) {
  let html = "<ul>";
  data.alreadySeenDealz.forEach((item) => {
    html += `<li>
      <h2>${item.date}</h2>
      <p>${item.body.replace(/\n/g, "<br>")}</p>
    </li>`;
  });
  html += "</ul>";
  return html;
}

module.exports.send = send;
