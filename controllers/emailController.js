const emailUtil = require("../utils/emailUtil");

exports.sendEmail = async (req, res) => {

  const { to, subject, template, values } = req.body;

  try {

    await emailUtil.sendEmail(to, subject, template, values);

    res.json({
      message: "Email sent successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};