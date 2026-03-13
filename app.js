const express = require("express");

const emailRoutes =
require("./routes/emailRoutes");

const app = express();

app.use(express.json());

app.use("/api",emailRoutes);

app.use((err,req,res,next)=>{

 console.error(err);

 res.status(500).json({

  success:false,
  message:err.message

 });

});

module.exports = app;