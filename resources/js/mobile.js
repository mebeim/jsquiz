// PROTO

Object.defineProperties(Element.prototype, {
	"onpress" : {
		value: function(handler, capt) {
			if (MOBILE) {
				var tap;
				this.addEventListener("touchstart", function(){ tap = true; }, capt);
				this.addEventListener("touchmove", function(){ tap = false; }, capt);
				this.addEventListener("touchend", function(e){ tap && handler.call(this, e); tap = false; }, capt);
			} else this.addEventListener("click", handler, capt);
		}
	}
});

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

}
