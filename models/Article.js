var mongoose = require("../config/config.js");

var Schema = mongoose.Schema;

var noteSchema = require("./Note");

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  link: {
    type: String,
    required: true,
  },

  paragraph: {
    type: String,
    required: true,
  },

  author: {
    type: String,
  },

  date: {
    type: String,
  },

  saved: Boolean,

  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
