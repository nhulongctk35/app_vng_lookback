(function ($) {
  var defaults = {
        animation: "dissolve",
        separator: ",",
        speed: 2000
    };

    $.fx.step.textShadowBlur = function(fx) {
    $(fx.elem).prop('textShadowBlur', fx.now).css({textShadow: '0 0 ' + Math.floor(fx.now) + 'px black'});
  };

  $.fn.textrotator = function(options){
    var settings = $.extend({}, defaults, options);

    return this.each(function(){
      var el = $(this);
      var array = [];
      $.each(el.text().split(settings.separator), function(key, value) {
        array.push(value);
      });
      el.text(array[0]);

      // animation option
      var rotate = function() {
        el.animate({
          textShadowBlur:20,
          opacity: 0
        }, 500 , function() {
          var index = $.inArray(el.text(), array);
          if((index + 1) == array.length) index = -1;
          el.text(array[index + 1]).animate({
            textShadowBlur: 0,
            opacity: 1
          }, 500 );
        });
      };
      setInterval(rotate, settings.speed);
    });
  };

  var inViewportElements = [];
  // Plugin starts here.
  $.fn.inViewport = function(inFunction, outFunction) {

    // Loop through all the elements selected.
    return this.each(function() {

      // Add the element, with in and out functions to the elements array.
      var el = {
        element: this,
        inFunction: inFunction,
        outFunction: outFunction
      };
      inViewportElements.push(el);

      // Do the check to see if any of the elements are in the viewport.
      var doCheck = function () {

        // Calculate the viewports measurements.
        var vpTop = $(window).scrollTop(),
            vpBottom = vpTop + $(window).height(),
            vpLeft = $(window).scrollLeft(),
            vpRight = vpLeft + $(window).width();

        // Loop through the elements checking if they're in the viewport.
        for (var i = 0; i < inViewportElements.length; i++) {

          // Calculate the elements measurements.
          var element = inViewportElements[i].element,
            $element = $(element),
            elTop = $element.offset().top,
            elLeft = $element.offset().left,
            elRight = elLeft + $element.outerWidth(),
            elBottom = elTop + $element.outerHeight();

          // Check the elements measurements against the viewports.
          if (
            elTop < vpBottom
            && elLeft < vpRight
            && elBottom > vpTop
            && elRight > vpLeft
          ) {
            // In viewport.
            if ($element.attr('data-vpStatus') != "in") {
              // If not already in the viewport, then update the status...
              $element.attr('data-vpStatus', "in");
              // .. and fire the callback.
              if (typeof(inViewportElements[i].inFunction) == "function") inViewportElements[i].inFunction.call(element);
            }
          } else {
            // Not in viewport.
            if ($element.attr('data-vpStatus') != "out") {
              // If not already out of the viewport, then update the status...
              $element.attr('data-vpStatus', "out");
              // .. and fire the callback.
              if (typeof(inViewportElements[i].outFunction) == "function") inViewportElements[i].outFunction.call(element);
            }
          }
        }
      };

      $(window).scroll(doCheck).resize(doCheck);
      doCheck();
    });
  };
}(window.jQuery));
