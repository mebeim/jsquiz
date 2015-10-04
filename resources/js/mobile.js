// PROTO


// Polyfill for IE9
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

var pressEvent = new CustomEvent("press");


// MAIN


var MOBILE 		= 'ontouchstart' in window,
	STANDALONE	= navigator.standalone;

document.documentElement.className += " " + (MOBILE ? (STANDALONE ? 'mobile webapp splash loading' : 'mobile') : 'desktop');


if (MOBILE) {

	addEventListener("load", function(){
		if (STANDALONE) {
			var root = document.documentElement;
			if (RESUMED)
				setTimeout(function(){ root.removeClass("splash loading"); }, 500);
			else {
				root.addClass("load");
				root.removeClass("loading");
				setTimeout(function(){ root.removeClass("splash load"); }, 1000);
			}
		}
	});

	// Prevent inappropriate scrolling on iOS (simulate app)
	document.addEventListener("touchmove", function(e){e.preventDefault();});
	
	var tapping = false;
	document.addEventListener("touchstart", function() { tapping = true; }, true);
	document.addEventListener("touchmove", function() { tapping = false; }, true);
	document.addEventListener("touchend", function(e) { tapping && e.target.dispatchEvent(pressEvent); tapping = false; }, true);

}

else {

	document.addEventListener("click", function(e) { e.target.dispatchEvent(pressEvent); }, true)

}
