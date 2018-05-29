var express = require("express");
var body = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");

var app = express.Router();

var db = require("../models");

app.get("/", function(req, res) {
  var data = req.body;
  news.all(function(data) {
    var hbsObject = {
      news: data,
    };
    res.json(hbsObject);
    //res.render("index", hbsObject)
  });
});

app.get("/scrape", function(req, res) {
  request("https://thedynastyguru.com/category/baseball/", function(
    error,
    response,
    html
  ) {
    var $ = cheerio.load(html);
    var results = [];
    $(".vw-post-box-title").each(function(i, element) {
      var title = $(this)
        .children("a")
        .text();
      var link = $(this)
        .children("a")
        .attr("href");

      results.push({
        title: title,
        link: link,
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

app.post("/note", function(req, res) {
  note.create([req.body.noteInfo], function(result) {
    res.json(req.body.noteInfo);
  });
});

module.exports = app;
