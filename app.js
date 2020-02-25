if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const uriDB = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@cluster0-x8shq.gcp.mongodb.net/bontiya_${process.env.NODE_ENV}?retryWrites=true&w=majority`;

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
