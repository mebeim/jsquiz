function JSQuiz(RESUME) {
	var OBJ 				= this,
		MAX_LEVEL			= 30,
		MAX_PAUSE_TIME		= 3600000, // 1 hour
		MOBILE				= window.MOBILE,
		lostGame, currentLevel, currentQuestion, currentAnswer, currentPoints, pointsPerQuestion, questionsPerLevel, questionsAnswered, questions,
		XMLp				= new XMLParser(),
		selectorAnswers		= '.game-answer',
// TODO: don't use querySelector when possible, getElementsByClassName has better performance (should make a separate func maybe?)
		gameStartOverlay	= document.querySelector('.app-start'),
		gameOverOverlay		= document.querySelector('.game-over-overlay'),
		gameStart			= document.querySelector('.game-start-button'),
		gameRestart			= document.querySelector('.game-restart-button'),
		gameQuit			= document.querySelector('.game-quit-button'),
		gameCode			= document.querySelector('.game-snippet code'),
		gameLevel			= document.querySelector('.game-current-level span'),
		gamePoints			= document.querySelector('.game-points span'),
		gameProgress		= document.querySelector('.game-progress-bar'),
		gameLevelUp			= document.querySelector('.game-level-up-overlay'),
		gameFinalScore		= document.querySelector('.game-final-score'),
		gameFinalLevel		= document.querySelector('.game-final-level'),
		gameFinalAnswered	= document.querySelector('.game-final-answered'),
		gameAnswers			= document.querySelectorAll(selectorAnswers);


	// == PUBLIC == //

	// Will start the game
	this.start = function() {
		loadLevel(1, 3, function() {
			updateInfo();
			loadQuestion(questions[0]);
			$(gameStartOverlay).fadeOut();
			$(selectorAnswers).each(function(i, el) {
				el.onpress(checkAnswer);
			});
			animateIn();
		});
	}

	// Will restart the game
	this.restart = function() {
		init();
		$(gameOverOverlay).fadeOut();
		OBJ.start();
	}

	// Will quit the game
	this.quit = function() {
		init();
		$(gameOverOverlay).fadeOut();
		$(gameStartOverlay).fadeIn();
	}

	// Will retrieve info about the current level
	this.levelInfo = function(a, b) {
		a == a || 1;
		a = a > MAX_LEVEL ? MAX_LEVEL : a <= 0 ? 1 : a;
		b = b > MAX_LEVEL ? MAX_LEVEL : b || a;
		for (var i=a; i <= b; i++) {
			console.log((i==a ? 'L' : 'l') + 'evel ' + i + ' will have ' + questionsFunction(i) + ' questions each one worth ' + pointsFunction(i) + ' points' + (i==b ? '.' : ';'));
		}
	}

	// Binding functions to elements
	gameStart.onpress(this.start);
	gameRestart.onpress(this.restart);
	gameQuit.onpress(this.quit);
//TODO: remove jquery
	$(gameAnswers).each(function(i, el) {
		this.code = this.querySelector('code');
	});

	init();


	// == PRIVATE == //

	// INIT function
	function init() {
		currentLevel		= RESUME && RESUME.currentLevel 		||  1;
		currentQuestion		= RESUME && RESUME.currentQuestion		||  1;
		currentAnswer		= RESUME && RESUME.currentAnswer		||  0;
		currentPoints		= RESUME && RESUME.currentPoints		||  0;
		pointsPerQuestion	= RESUME && RESUME.PPQ					||  1;
		questionsPerLevel	= RESUME && RESUME.QPL					||  3;
		questionsAnswered	= RESUME && RESUME.questionsAnswered	||  0;
		questions			= RESUME && RESUME.questions			||  new Array();
		lostGame			= false;
		if (RESUME) {
			loadQuestion(questions[currentQuestion-1]);
			updateInfo();
			updateProgressBar((currentQuestion-1) / questionsPerLevel * 100);
			$(gameStartOverlay).fadeOut();
			$(selectorAnswers).each(function(i, el) { el.onpress(checkAnswer); });
			animateIn();
			RESUME = undefined;
		}
		else {
			updateProgressBar();
			$('.wrong').removeClass('wrong');
		}
	}

	// Will map for each level an amount of questions
//TODO: I don't like all those "if"s, maybe we should hack something with a switch, or better, make a math function.
	function questionsFunction(x) {
		if (x > 30) return;
		if (x == 30) return 30;
		if (x >= 25) return 15;
		if (x >= 22) return 10;
		if (x >= 18) return 9;
		if (x >= 15) return 8;
		if (x >= 10) return 7;
		if (x >= 8) return 6;
		if (x >= 5) return 5;
		if (x >= 3) return 4;
		if (x >= 1) return 3;
		return;
	}

	// Will assing an amount of points for each question
	function pointsFunction(x) {
		return Math.round(Math.pow(x, 1.8)/1.5);
	}

	// Will load level n with q questions
	function loadLevel(n, q, callback) {
		XMLp.parseLevel(n, q, function(response) {
			if (response.status == "ok") {
				questions = response.data;
				callback();
			}
		});
	}

	// Will load question data
	function loadQuestion(q) {
//TODO: should we throw errors instead?
		if (!q) return "loadQuestion error: no question given";

		gameCode.className = '';
		gameCode.textContent = q.snippet;
		fixCodePosition();
		hljs.highlightBlock(gameCode);
		currentAnswer = q.right_answer;

		for (var i = 0; i < q.answers.length; i++) {
			gameAnswers[i].code.textContent = q.answers[i];
			$(gameAnswers[i])[~q.comments.indexOf(i) ? 'addClass' : 'removeClass']('comment');
		}

		return true;
	}

	// Will check if the chosen answer is correct
	function checkAnswer(event) {
		function animate(r) {
			var others;

			if (r) {
				updateProgressBar(currentQuestion / questionsPerLevel * 100);
				animateOut.call(this);
				questionsAnswered++;
			} else
				$(this).addClass('wrong');
		}

		if (!lostGame) {
			if (parseInt(this.dataset.answer) == currentAnswer) {
				animate.call(this, true);
				setTimeout(proceed, 400);
			} else {
				animate.call(this, false);
				setTimeout(lose, 400);
			}
		}
	}

	// Self explanatory
//TODO: declare functions in a more coherent order (e.g. core, private, public)
	function isLastQuestion() {
		return (currentQuestion == questionsPerLevel);
	}

	// Will position the code to the center
//TODO: maybe we should consider using flex when possible
	function fixCodePosition() {
		$(gameCode).removeClass('fixed-code');
		$(gameCode).width('auto');
		$(gameCode).height('auto');
		$(gameCode).css('max-width', 'none');
		$(gameCode).css('max-width', $(gameCode).width() + 2 + 'px');
		$(gameCode).height($(gameCode).height());
		$(gameCode).addClass('fixed-code');
	}

	// Will update GUI status info
	function updateInfo() {
		gameLevel.textContent = currentLevel;
		gamePoints.textContent = currentPoints;
	}

	// Will update GUI progress bar
	function updateProgressBar(percentage) {
		if (!percentage) {
			gameProgress.style.opacity = '0';
			setTimeout(function() {
				gameProgress.style.width = '0';
				setTimeout(function() {
					gameProgress.style.opacity = '1';
					gameProgress.style.width = '3%';
				}, 500);
			}, 200);
		} else {
			gameProgress.style.width = percentage + '%';
		}
	}

	function animateIn() {
		gameCode.style.opacity = '1';

		var els = document.querySelectorAll('.game-answer');
		for (var i=0; i < els.length; i++) {
			$(els[i]).removeClass("right hide");
		}
	}

	function animateOut(newLevel) {
		gameCode.style.opacity = '0';

		var els = document.querySelectorAll('.game-answer');
		$(this).addClass("right");

		if (isLastQuestion()) {
			(function(el) {
				setTimeout(function() { 
					$(el).removeClass("right");
					$(el).addClass("hide");
				}, 300);
			})(this);
		}

		for (var i=0; i < els.length; i++) {
			if (els[i] != this) $(els[i]).addClass("hide");
		}
	}

	function animateLevelUp() {
		gameLevelUp.querySelector('span').textContent = 'LEVEL ' + currentLevel;
		$(gameLevelUp).fadeIn();
		setTimeout(function() { $(gameLevelUp).fadeOut(); animateIn(); }, 1500);
		updateProgressBar();
	}

	function proceed() {
		function nextLevel() {
			currentLevel++;
			currentPoints += pointsPerQuestion;
			questionsPerLevel = questionsFunction(currentLevel);

			loadLevel(currentLevel, questionsPerLevel, function() {
				currentQuestion = 1;
				loadQuestion(questions[currentQuestion-1]);
				pointsPerQuestion = pointsFunction(currentLevel);
				animateLevelUp();
				saveSession();
			});
		}

		function nextQuestion() {
			currentQuestion++;
			currentPoints += pointsPerQuestion;

			loadQuestion(questions[currentQuestion-1]);
			animateIn();
			saveSession();
		}

		if (isLastQuestion()) {
			nextLevel();
		} else {
			nextQuestion();
		}

		updateInfo();
	}

	function lose() {
		lostGame = true;
		gameFinalScore.textContent = currentPoints;
		gameFinalLevel.textContent = currentLevel;
		gameFinalAnswered.textContent = questionsAnswered;

		$(gameOverOverlay).fadeIn();
		delete localStorage.jsq_session;
	}

	function saveSession() {
		if (lostGame) return;

		var session = {
			"data": {
				"currentLevel":			currentLevel,
				"currentQuestion":		currentQuestion,
				"currentAnswer":		currentAnswer,
				"currentPoints":		currentPoints,
				"PPQ":					pointsPerQuestion,
				"QPL":					questionsPerLevel,
				"questionsAnswered":	questionsAnswered,
				"questions":			questions
			},

			"saveDate": +new Date()
		};

		localStorage.jsq_session = JSON.stringify(session);
	}
}

// ##### END OBJECT DEFINITION #### //


function main() {

	// Will check if Storage API is usable
//TODO: define this somewhere else
	function storageON() {
		try {
			localStorage.setItem("__test", "data");
		} catch (e) {
			if (/(QUOTA_?EXCEEDED|SecurityError|ReferenceError)/i.test(e.name))
				return false;
		} 
		return true;
	}

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


//TODO: remove jquery

	$('.app-footer')[0].onpress(function () {
		$('.app-credits').fadeIn();
	});
	$('.app-credits-icon')[0].onpress(function () {
		$('.app-credits').fadeIn();
	});
	$('.game-info .app-title-text')[0].onpress(function () {
		$('.app-credits').fadeIn();
	});
	$('.app-credits-close-button')[0].onpress(function () {
		$('.app-credits').fadeOut();
	});

	$('.scrollable').on("touchmove",function(e){
		el = e.currentTarget;
		if (el.offsetHeight < el.scrollHeight || el.offsetWidth < el.scrollWidth)
			e.stopPropagation();
	});
}

$(document).ready(main);


// Some workarounds for unsupported methods

Object.getOwnPropertyDescriptor(Node.prototype, "children") || Object.defineProperty(
	Node.prototype,
	"children",
	{
		get: function() {
//TODO: return an instance of HTMLCollection
			return Array.prototype.filter.call(this.childNodes, function(el){return el.nodeType==1;});
		}
	}
);
