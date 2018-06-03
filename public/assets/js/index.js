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
    // console.log(noteObject);
    $.ajax({
      type: "POST",
      url: "/articles/" + articleId,
      data: noteObject,
    }).then(function(data) {
      console.log(data);
      closeModal();
    });
  });
  function closeModal() {
    $("#.new_note").val("");
    $("#noteModal").modal("hide");
    window.location = "/articles";
  }

  $("#scraper").on("click", function(event) {
    console.log("scraped");
    event.preventDefault;
    $.ajax({
      mthod: "GET",
      url: "/scrape",
    }).then(function(data) {});
  });
});
