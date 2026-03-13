const db = require("../\Config/db");

async function getTemplate(name) {

  const query =
  "SELECT subject, body FROM templates WHERE name=?";

  const [rows] =
  await db.execute(query,[name]);

  if(rows.length === 0){
    throw new Error("Template not found");
  }

  return rows[0];
}

module.exports = {
  getTemplate
};