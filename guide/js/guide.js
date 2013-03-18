$(function () {
  $(".example").on("click", function () {
    var $self = $(this)
      , $pre = $("<pre></pre>");

      // Clear all of the old examples
      $("pre").remove();
      $(".example").removeClass("active");

      // Insert the new code block
      $pre
        .text( $self.html().trim().replace(/    /g, "") )
        .appendTo( $self )
        .addClass("html")
        .each(function(i, e) {hljs.highlightBlock(e)});
  
      // Make this example active
      $self.addClass("active");

      return false;
  });

  $("nav a").on("click", function (e) {
    var target = $(this).attr("href")
      , offsetTop = $(target).offset().top;

    $('body,html').animate({scrollTop: offsetTop}, 300);
    return false;
  });
});