/* ==========================================================
 * blueline-preheader
 *
 * Slides down from the top of Knight Lab websites to reveal
 * a global navigation.
 * ========================================================== */
var _gaq = _gaq || [];

!function ($) {

  "use strict"; // jshint ;_;


 /* PREHEADER PUBLIC CLASS DEFINITION
  * ============================== */

  var Preheader = function (element, options) {
    this.$element = $(element)
    this.$preheader = $(".preheader")
    this.options = $.extend({}, $.fn.preheader.defaults, options)

    // Prepend to the fixed nav, if available.
    var $fixed = this.$element.closest(".navbar-fixed-top");
    this.$container = $fixed.length ? $fixed : $("body");

    if(this.$preheader.length == 0) {
      this.$preheader = $('<iframe/>')
                            .addClass("preheader")
                            .css({
                                display: "none"
                              , width: "100%"
                              , border: 0
                            })
                            .prependTo(this.$container)
    }
  }

  Preheader.prototype = {
      constructor: Preheader

    , toggle: function () {
        this.$preheader
          .height(this.options.height)
          .attr("src", this.options.target)
          .slideToggle(this.options.duration)
      }
  }

 /* PREHEADER PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.preheader

  $.fn.preheader = function (options) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('preheader')

      if (!data) $this.data('preheader', (data = new Preheader(this, options)))
      data.toggle();
      _gaq.push(['knightlabTracker._trackEvent', 'Preheader', 'PreheaderToggle']);
    })
  }

  $.fn.preheader.defaults = {
      target: "http://cdn.knightlab.com/libs/blueline/latest/preheader.html"
    , height: 215
    , duration: 200
  }

  $.fn.preheader.Constructor = Preheader

 /* PREHEADER NO CONFLICT
  * ================== */

  $.fn.preheader.noConflict = function () {
    $.fn.preheader = old
    return this
  }

 /* PREHEADER DATA-API
  * =============== */
  $(document).on('click.preheader.data-api', '[data-toggle="preheader"]', function (e) {
    var $this = $(this)
      , data = $(this).data()

    // If we're using preheader in a responsive navbar,
    // and the btn-navbar is visible, we won't override the link's
    // default behavior
    if ($(".btn-navbar:visible").length) return;

    e.preventDefault()

    $this.preheader(data)
  })

}(window.jQuery);