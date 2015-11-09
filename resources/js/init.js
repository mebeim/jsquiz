function main() {

	// Try to resume the game

	RESUMED = false;

	if (storageON()) {

		var lastSession = localStorage.jsq_session;

		if (lastSession) {

			lastSession = JSON.parse(lastSession);

			if (new Date() - lastSession.saveDate < 3600000) {

				JSQ = new JSQuiz(lastSession.data);

				RESUMED = true;
			}
		}
	}

	if (!RESUMED) JSQ = new JSQuiz();


	_('.app-footer').onpress = function () {
		_('.app-credits').fadeIn();
	};
	_('.app-credits-icon').onpress = function () {
		_('.app-credits').fadeIn();
	};
	_('.game-info .app-title-text').onpress = function () {
		_('.app-credits').fadeIn();
	};
	_('.app-credits-close-button').onpress = function () {
		_('.app-credits').fadeOut();
	};

	_('.scrollable').addEventListener("touchmove", function(e) {
		el = e.currentTarget;
		if (el.offsetHeight < el.scrollHeight || el.offsetWidth < el.scrollWidth)
			e.stopPropagation();
	});
}


var MOBILE 		= 'ontouchstart' in window,
	STANDALONE	= navigator.standalone;

document.documentElement.className += 'loading ' + (MOBILE ? 'mobile ' + (STANDALONE ? 'webapp splash' : '') : 'desktop');


// Event bindings

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

document.addEventListener("DOMContentLoaded", main);

window.addEventListener("load", function() {
	document.documentElement.removeClass("loading");
});
