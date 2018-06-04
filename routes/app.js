var express = require("express");
var body = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("../config/config.js");

var app = express.Router();

var db = require("../models");

app.get("/scrape", function(req, res) {
  request("https://razzball.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    var results = [];
    $("article").each(function(i, element) {
      var title = $(this)
        .find(".entry-title")
        .text();
      var link = $(this)
        .find(".read_more")
        .attr("href");
      var paragraph = $(this)
        .find(".entry-summary")
        .text();
      var author = $(this)
        .find(".fn")
        .text();
      var date = $(this)
        .find(".entry-date")
        .text();

      results.push({
        title: title,
        link: link,
        paragraph: paragraph,
        author: author,
        date: date,
        saved: false,
      });
    });
    for (var i = 0; i < results.length; i++) {
      if (results[i].title != "") {
        db.Article.create(results[i])
          .then(function(db) {
            console.log(db);
          })
          .catch(function(err) {
            return res.json(err);
          });
      }
    }
    res.send("Scraped");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      var hbsObject = { article: dbArticle };
      //res.json(hbsObject);
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/saved", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      var hbsObject = { article: dbArticle };
      //res.json(hbsObject);
      res.render("saved", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .exec(function(err, dbArticle) {
      hbsObject = { article: dbArticle };
      // console.log(dbArticle.note[0].title);
      res.render("notes", hbsObject);
    });
});

app.get("/delete-note/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id }).exec(function(err, dbNote) {});
  res.send("delted");
});

app.get("/save-article/:id", function(req, res) {
  console.log();
  db.Article.update({ _id: req.params.id }, { $set: { saved: true } }).exec(
    function(err, dbNote) {}
  );
  res.send("saved");
});

app.get("/delete-article/:id", function(req, res) {
  db.Article.update({ _id: req.params.id }, { $set: { saved: false } }).exec(
    function(err, dbNote) {}
  );
  res.send("delted");
});

app.post("/articles/:id", function(req, res) {
  //console.log(req.body);
  db.Note.create(req.body).then(function(dbNote) {
    console.log(dbNote._id);
    return db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { note: dbNote._id } },
      { new: true }
    ).then(function(dbArticle) {
      // var hbsObject = { note: dbArticle };
      // res.json(dbArticle);
    });
    //res.send("sent note");
  });
});
module.exports = app;
