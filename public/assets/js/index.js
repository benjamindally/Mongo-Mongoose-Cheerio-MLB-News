$(function() {
  var articleId = "";
  $(".notes").on("click", function() {
    articleId = $(this).attr("value");
    $("#note_modal").modal("show");

    var title = $(this).data("title");
    console.log(articleId);

    $.ajax({
      method: "GET",
      url: "/articles/" + articleId,
    })
      .then(function(data) {
        $(".modal-header").empty();
        $(".modal-header").prepend(`${data.title} <br>
        Create a Note`);
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  $("#save_note").on("click", function() {
    var noteObject = {
      title: $("#note_title")
        .val()
        .trim(),
      body: $(".new_note")
        .val()
        .trim(),
    };
    $.ajax({
      type: "POST",
      url: "/articles/" + articleId,
      data: noteObject,
    }).then(function(data) {
      console.log(data);
    });
  });

  $("#scraper").on("click", function(event) {
    console.log("scraped");
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "/scrape",
    }).then(function(data) {
      window.location = "/";
    });
  });

  $("#view_notes").click(function(event) {
    event.preventDefault();
    window.location = articleId;
  });

  $(".delete_note").click(function(event) {
    event.preventDefault();
    let id = $(".delete_note").attr("id");
    let queryUrl = "/delete-note/" + id;

    $.ajax({
      method: "GET",
      url: queryUrl,
    }).then(function(data) {
      window.location = articleId;
    });
  });

  $(".save_article").click(function(event) {
    event.preventDefault();
    let id = $(this).attr("value");
    let queryUrl = "/save-article/" + id;

    $.ajax({
      method: "GET",
      url: queryUrl,
    }).then(function(data) {
      alert("Your article has been saved.");
    });
  });

  $("#view_saved").click(function(event) {
    event.preventDefault();

    $.ajax({
      method: "GET",
      url: "/saved",
    }).then(function(data) {
      console.log(data);
      window.location = "/saved";
    });
  });

  $(".delete_article").click(function(event) {
    event.preventDefault();
    let id = $(this).attr("value");
    let queryUrl = "/delete-article/" + id;

    console.log(queryUrl);
    $.ajax({
      method: "GET",
      url: queryUrl,
    }).then(function(data) {
      window.location = "/saved";
    });
  });
});
