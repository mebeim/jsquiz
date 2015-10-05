// PROTO

Object.defineProperties(Element.prototype, {
	"onpress" : {
		set: function(handler) {
			if (MOBILE) {
				var tap;
				this.addEventListener("touchstart", function(){ tap = true; });
				this.addEventListener("touchmove", function(){ tap = false; });
				this.addEventListener("touchend", function(e){ tap && handler.call(this, e); tap = false; });
			} else this.addEventListener("click", handler);
		}
	}
});

// MAIN


var MOBILE 		= 'ontouchstart' in window,
	STANDALONE	= navigator.standalone;

document.documentElement.className += 'loading ' + (MOBILE ? 'mobile ' + (STANDALONE ? 'webapp splash' : '') : 'desktop');

if (MOBILE) {

	addEventListener("load", function(){
		if (STANDALONE) {
			var root = document.documentElement;
			if (RESUMED)
				setTimeout(function(){ root.removeClass("splash"); }, 500);
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

addEventListener("load", function() {
	document.documentElement.removeClass("loading");
});
