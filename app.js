const express = require("express");

const emailRoutes = require("./routes/emailRoutes");

const app = express();

app.use(express.json());

app.use("/email", emailRoutes);

module.exports = app;