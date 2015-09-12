<?php
if (strpos($_SERVER["HTTP_ACCEPT"], "application/xhtml+xml") !== false) {
	define("CDATA_ON", "<![CDATA[");
	define("CDATA_OFF", "]]>");
	header("Content-Type: application/xhtml+xml; charset=UTF-8");
	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
}
else {
	define("CDATA_ON", "");
	define("CDATA_OFF", "");
	header("Content-Type: text/html; charset=UTF-8");
}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>JS Quiz</title>
	<meta charset="utf-8"/>
	<base target="_blank"/>
	
	<!-- MOBILE -->
	<link rel="apple-touch-icon-precomposed" href="./resources/images/logo.png"/>
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
	<meta name="viewport" content="user-scalable = no, width = device-width"/>
	
	<link href="./reources/images/splash-ipad.png"
			media="(device-width: 320px) and (device-height: 568px)
					and (-webkit-device-pixel-ratio: 2)"
			rel="apple-touch-startup-image"/>
	<link href="./resources/images/splash-ipod.png"
			media="(device-width: 768px) and (device-height: 1024px)
					and (orientation: landscape)"
			rel="apple-touch-startup-image"/>
	<!-- /MOBILE -->
	
	<!-- EXTERNAL RESOURCES -->
	<link rel="stylesheet" href="resources/css/splash.css"/>
	<link rel="stylesheet" href="resources/css/style.css"/>
	<link rel="stylesheet" href="resources/css/code-highlight.css"/>
	<script src="resources/js/parse_xml.js"></script>
	<script src="resources/js/mobile.js"></script>
	<script src="resources/js/jquery.min.js"></script>
	<script src="resources/js/prefixfree.min.js"></script>
	<script src="resources/js/highlight.pack.js"></script>
	<!-- /EXTERNAL RESOURCES -->
</head>

<body>

	<header class="app-title">
		<h1 class="app-title-text">JS Quiz</h1>
		<div class="app-credits-icon">i</div>
	</header>
	
	<div class="app-container">
	
		<section class="app-overlay app-start">
			<h2 class="app-welcome-title">Welcome to JSQuiz!</h2>
			<div class="app-welcome-desc">JavaScript is the world's most misunderstood programming language. This quiz will test your JavaScript knowledge in depth. Click the start button to begin.</div>
			<button class="app-button game-start-button">JSQuiz.start();</button>
		</section>


		<div class="game-board">
			
			<header class="game-info">
				<h1 class="app-title-text">JS Quiz</h1>
				<div class="game-current-level">
					<span>1</span>
				</div>
				<div class="game-points">
					<span>0</span>
				</div>
				<div class="game-progress">
					<div class="game-progress-bar"></div>
				</div>
			</header>
			
			<div class="game-snippet scrollable">
				<div class="game-overlay game-level-up-overlay"> <span></span> </div>
				<div class="game-overlay game-over-overlay"> 
					<h2>GAME OVER!</h2>
					<p>YOU SCORED <span class="game-final-score"></span> POINTS,</p>
					<p>REACHED LEVEL <span class="game-final-level"></span></p>
					<p>AND ANSWERED <span class="game-final-answered"></span> QUESTIONS CORRECTLY.</p>
					<button class="app-button game-restart-button">New game</button>
					<button class="app-button game-quit-button">Quit</button>
				</div>
				<code></code>
			</div>
			
			<section class="game-answers">
				<h2 class="game-answers-title">What's the output?</h2>
				<div class="game-answer" data-answer="0" data-label="a">
					<code></code>
				</div>
				<div class="game-answer" data-answer="1" data-label="b">
					<code></code>
				</div>
				<div class="game-answer" data-answer="2" data-label="c">
					<code></code>
				</div>
				<div class="game-answer" data-answer="3" data-label="d">
					<code></code>
				</div>
			</section>
			
		</div><!-- #board -->
		
		<section class="app-overlay app-credits">
			<h2 class="app-credits-title">Credits</h2>
			<div class="app-credits-desc">
				<p>This game has been made possible by the work of <a href="">Marco Bonelli</a> and <a href="http://twitter.com/mttbernardini">Matteo Bernardini</a>.</p>
				<p>The snippets have been tested on Google Chrome v.37</p>
				<p>Here's the list of the other resources we used:</p>
				<ul class="app-credits-list">
					<li><a href="http://jquery.com/">jQuery</a> v.1.11.1</li>
					<li><a href="http://leaverou.github.io/prefixfree/">PrefixFree</a> v.1.0.7</li>
					<li><a href="http://highlightjs.org/">highlight.js</a> v.8.2</li>
				</ul>
			</div>
			<button class="app-button app-credits-close-button">Close</button>
		</section>

	</div><!-- #container -->
	
	<footer class="app-footer">
		<span class="app-footer-appname">JS Quiz alpha</span>
		<span class="app-footer-authors">by Marco Bonelli &amp; Matteo Bernardini</span>
	</footer>
	
	<script src="resources/js/app.js"></script>
</body>

</html>
