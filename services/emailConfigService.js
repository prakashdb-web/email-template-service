const db = require("../config/db");

exports.getEmailCredentials = async () => {

  const sql = "SELECT mail_user, mail_pass, service FROM email_config LIMIT 1";

  const [rows] = await db.query(sql);

  if (rows.length === 0) {
    throw new Error("Email configuration not found");
  }

  return rows[0];
};