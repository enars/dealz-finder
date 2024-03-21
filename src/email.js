const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { convertToHtml } = require("./utils");

dotenv.config();

function send(data) {
  const html = convertToHtml(data);
  const date = new Date();
  transporter.sendMail(
    {
      from: process.env.LOGINUSER,
      to: process.env.SENDTO,
      subject: `${date.getHours()}:${
        date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
      } ${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()} - Scraper has run found dealz!"`,
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

module.exports.send = send;
