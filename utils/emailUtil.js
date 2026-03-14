const nodemailer = require("nodemailer");
const mailConfig = require("../Config/mailConfig");
const templateService = require("../services/templateService");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: mailConfig.mailUser,
    pass: mailConfig.mailPass
  }
});

exports.sendEmail = async (to, subject, template, values) => {

  const parsedTemplate = templateService.prepareTemplate(template, values);

  const mailOptions = {
    from: mailConfig.mailUser,
    to: to,
    subject: subject,
    text: parsedTemplate
  };

  return transporter.sendMail(mailOptions);

};