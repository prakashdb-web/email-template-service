const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "0123",   // put your mysql password here if you have one
    database: "email_service",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;