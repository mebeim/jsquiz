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
			if (RESUMED)
				setTimeout(function(){ $('html').removeClass("splash loading"); }, 500);
			else {
				$('html').addClass("load");
				$('html').removeClass("loading");
				setTimeout(function(){ $('html').removeClass("splash load"); }, 1000);
			}
		}
	});

	document.addEventListener("touchmove", function(e){e.preventDefault();});

}
