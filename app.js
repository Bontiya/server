if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

// db server
// const uriDB = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@cluster0-x8shq.gcp.mongodb.net/bontiya_${process.env.NODE_ENV}?retryWrites=true&w=majority`;
// db local
const uriDB = `mongodb://localhost/bontiya_${process.env.NODE_ENV}`;

const configDB = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
mongoose.connect(uriDB, configDB);

const path = require("path");
const app = express();

const indexRouter = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
