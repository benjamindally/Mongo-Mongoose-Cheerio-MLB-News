var express = require("express");
var body = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");

var app = express.Router();

var db = require("../models");

// app.get("/", function(req, res) {
//   var data = req.body;
//   articl.all(function(data) {
//     var hbsObject = {
//       news: data,
//     };
//     res.json(hbsObject);
//     //res.render("index", hbsObject)
//   });
// });

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

app.get("/", function(req, res) {
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
app.post("/note", function(req, res) {
  note.create([req.body.noteInfo], function(result) {
    res.json(req.body.noteInfo);
  });
});

module.exports = app;
