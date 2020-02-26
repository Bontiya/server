/* istanbul ignore next */ 
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const uriDB = `mongodb://localhost/bontiya_test`;

const configDB = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(uriDB, configDB);

const path = require("path");
const app = express();

const indexRouter = require("./routes/index");

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
