// import modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

// initializations
const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// connect to database
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI);

// define collections
const Article = new mongoose.model(
  "Article",
  (articleSchema = new mongoose.Schema({
    title: String,
    content: String,
  }))
);

app.get("/", (req, res) => {
  res.render("home")
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
