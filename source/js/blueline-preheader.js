/* ==========================================================
 * blueline-preheader
 *
 * Slides down from the top of Knight Lab websites to reveal
 * a global navigation.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* PREHEADER PUBLIC CLASS DEFINITION
  * ============================== */

  var Preheader = function (element, options) {
    this.$element = $(element)
    this.$preheader = $(".preheader")
    this.options = $.extend({}, $.fn.preheader.defaults, options)

    if(this.$preheader.length == 0) {
      this.$preheader = $('<iframe/>')
                            .addClass("preheader")
                            .css({
                                display: "none"
                              , width: "100%"
                              , border: 0
                            })
                            .prependTo(this.$element)
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
    })
  }

  $.fn.preheader.defaults = {
      target: "https://cdn.knightlab.com/libs/blueline/latest/preheader.html"
    , height: 250
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

    e.preventDefault()

    $this.preheader(data)
  })

}(window.jQuery);