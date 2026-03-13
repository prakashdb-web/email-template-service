const templateService =
require("../services/templateService");

const transporter =
require("../Config/mailer");

const parseTemplate =
require("../utils/templateParser");

exports.sendEmail = async (req, res, next) => {

 try {

  const { templateName, to, data } = req.body;

  const template =
  await templateService.getTemplate(templateName);

  const subject =
  parseTemplate(template.subject, data);

  const body =
  parseTemplate(template.body, data);

  await transporter.sendMail({
   from: process.env.MAIL_USER,
   to: to,
   subject: subject,
   text: body
  });

  res.json({
   success: true,
   message: "Email sent successfully"
  });

 } catch (err) {

  next(err);

 }

};