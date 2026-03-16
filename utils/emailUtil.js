const nodemailer = require("nodemailer");
const templateService = require("../services/templateService");
const emailConfigService = require("../services/emailConfigService");

exports.sendEmail = async (to, subject, template, values) => {

  // get credentials from DB
  const creds = await emailConfigService.getEmailCredentials();

  const transporter = nodemailer.createTransport({
    service: creds.service,
    secure: true,
    auth: {
      user: creds.mail_user,
      pass: creds.mail_pass
    }
  });

  // parse template
  const parsedTemplate = templateService.prepareTemplate(template, values);

  const mailOptions = {
    from: creds.mail_user,
    to: to,
    subject: subject,
    text: parsedTemplate
  };

  return transporter.sendMail(mailOptions);

};