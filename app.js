// import modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const _ = require("lodash");

// initializations
const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

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

// routes
app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, docs) => {
      if (err) {
        res.send(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
      title: title,
      content: content,
    });

    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Article saved successfully");
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err, articles) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Articles deleted successfully");
      }
    });
  });

app.route("/articles/:title")
  .get((req, res) => {
    Article.findOne({ title: req.params.title }, (err, article) => {
      if (err) {
        res.send(err);
      } else if (article) {
        res.send(article);
      } else {
        res.send(
          `Article not found. The title searched was ${req.params.title}`
        );
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.send("Article replaced successfully");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.send("Article updated successfully");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.title }, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Article deleted successfully");
      }
    });
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
