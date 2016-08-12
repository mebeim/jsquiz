function JSQuiz(RESUME) {
	var game 				= this,
		MAX_LEVEL			= 30,
		MAX_PAUSE_TIME		= 3600000, // 1 hour
		MOBILE				= window.MOBILE,
		lostGame, currentLevel, currentQuestion, rightAnswer, currentPoints, pointsPerQuestion, questionsPerLevel, questionsAnswered, questions,
		XMLp				= new XMLParser(),
		gameStartOverlay	= _('.app-start'),
		gameStart			= _('.game-start-button'),
		gameRestart			= _('.game-restart-button'),
		gameQuit			= _('.game-quit-button'),
		gameBoard			= _('.game-board'),
		gameCode			= _('.game-snippet code'),
		gameLevel			= _('.game-current-level span'),
		gamePoints			= _('.game-points span'),
		gameProgress		= _('.game-progress-bar'),
		gameLevelUp			= _('.game-level-up-overlay span'),
		gameFinalScore		= _('.game-final-score'),
		gameFinalLevel		= _('.game-final-level'),
		gameFinalAnswered	= _('.game-final-answered'),
		gameAnswers			= _('.game-answer', "ALL");


	// == PUBLIC == //

	// Will start the game
	this.start = function() {
		loadLevel(1, 3, function() {
			updateGUI();
			cleanBoard();
			loadQuestion(questions[0]);
			gameStartOverlay.fadeOut();
		});
	}

	// Will restart the game
	this.restart = function() {
		init();
		game.start();
	}

	// Will quit the game
	this.quit = function() {
		init();
		gameStartOverlay.fadeIn();
	}

	// Will retrieve info about a range of levels
	this.levelInfo = function(a, b) {
		a == a || 1;
		a = a > MAX_LEVEL ? MAX_LEVEL : a <= 0 ? 1 : a;
		b = b > MAX_LEVEL ? MAX_LEVEL : b || a;
		for (var i=a; i <= b; i++) {
			console.log((i==a ? 'L' : 'l') + 'evel ' + i + ' will have ' + questionsFunction(i) + ' questions each one worth ' + pointsFunction(i) + ' points' + (i==b ? '.' : ';'));
		}
	}

	// Binding functions to elements
	gameStart.addEventListener("press", this.start);
	gameRestart.addEventListener("press", this.restart);
	gameQuit.addEventListener("press", this.quit);

	for (var i = 0, el; el = gameAnswers[i]; i++) {
		el.addEventListener("press", checkAnswer);
		// make a reference for the <code> element inside answers
		el.code = el.children[0];
	}

	init();


	// == PRIVATE == //

	// INIT function
	function init() {
		currentLevel		= RESUME && RESUME.currentLevel 		||  1;
		currentQuestion		= RESUME && RESUME.currentQuestion		||  1;
		currentPoints		= RESUME && RESUME.currentPoints		||  0;
		pointsPerQuestion	= RESUME && RESUME.PPQ					||  1;
		questionsPerLevel	= RESUME && RESUME.QPL					||  3;
		questionsAnswered	= RESUME && RESUME.questionsAnswered	||  0;
		questions			= RESUME && RESUME.questions			||  null;
		lostGame			= false;

		updateGUI();
		cleanBoard();

		if (!questions) { // load questions if not available
			loadLevel(currentLevel, questionsPerLevel, function() {
				loadQuestion(questions[currentQuestion-1]);
				saveSession(); // saves the new loaded questions
			});
		}
		if (RESUME) {
			questions && loadQuestion(questions[currentQuestion-1]);
			gameStartOverlay.fadeOut();
			RESUME = undefined;
		}

	}

	// Will save the game data in the LocalStorage
	function saveSession() {
		if (lostGame) return;

		var session = {
			"data": {
				"currentLevel":			currentLevel,
				"currentQuestion":		currentQuestion,
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

	// Will assing an amount of points-per-question for level x
	function pointsFunction(x) {
		return Math.round(Math.pow(x, 1.8)/1.5);
	}

	// Will load level n with q questions
	function loadLevel(n, q, callback) {
		XMLp.parseLevel(n, q, function(response) {
			if (response.status == "ok") {
				questions = response.data;
				// TODO: might remove this when the DB of questions is complete
				questionsPerLevel = questions.length;
				callback();
			}
		});
	}

	// Will prepare question
	function loadQuestion(q) {

		gameCode.className = '';
		gameCode.textContent = q.snippet;
		hljs.highlightBlock(gameCode);
		rightAnswer = q.right_answer;

		for (var i = 0; i < q.answers.length; i++) {
			gameAnswers[i].code.textContent = q.answers[i];
			gameAnswers[i][~q.comments.indexOf(i) ? 'addClass' : 'removeClass']('comment');
		}

	}

	// Will check if the current question is the last one of the level
	function isLastQuestion() {
		return (currentQuestion == questionsPerLevel);
	}

	// Will check if the chosen answer is correct and proceed() or lose()
	function checkAnswer(event) {

		var proc = (parseInt(this.dataset.answer) == rightAnswer);

		if (!gameBoard.hasClass("next-question", "level-up", "game-over")) {
			if (proc) {
				this.addClass('right');
				proceed();
			}
			else {
				this.addClass('wrong');
				lose();
			}
		}

	}

	// Will proceed for new question/new level
	function proceed() {

		animateOut();

		questionsAnswered++;
		currentPoints += pointsPerQuestion;

		if (isLastQuestion()) { // Next Level
			currentLevel++;
			currentQuestion = 1;
			questions = null;
			questionsPerLevel = questionsFunction(currentLevel);
			pointsPerQuestion = pointsFunction(currentLevel);

			updateGUI(100);

			setTimeout(function() {
				animateLevelUp();
				loadLevel(currentLevel, questionsPerLevel, function() {
					saveSession();
					setTimeout(function() {
						loadQuestion(questions[currentQuestion-1]);
						cleanBoard();
						updateGUI();
					}, 1500);
				});
			}, 400);

			last = true;

		}
		else { // Next Question
			currentQuestion++;
			updateGUI();

			setTimeout(function() {
				loadQuestion(questions[currentQuestion-1]);
				cleanBoard();
			}, 400);
		}

		saveSession();
	}

	// Will display the final recap of the game after losing
	function lose() {
		lostGame = true;
		gameFinalScore.textContent = currentPoints;
		gameFinalLevel.textContent = currentLevel;
		gameFinalAnswered.textContent = questionsAnswered;
		gameBoard.addClass("game-over");
		delete localStorage.jsq_session;
	}

	// Will update the whole GUI based on the status vars
	function updateGUI(percent) {
		gameLevel.textContent = currentLevel;
		gamePoints.textContent = currentPoints;
		if (typeof percent != "number")
			gameProgress.style.width = Math.max(((currentQuestion-1) / questionsPerLevel * 100), 3) + '%';
		else
			gameProgress.style.width = percent + "%";
	}

	// Will begin the transition to new level
	function animateLevelUp() {
		gameLevelUp.textContent = 'LEVEL ' + currentLevel;
		gameBoard.addClass("level-up");
	}

	// Will begin the transition to new question
	function animateOut() {
		gameBoard.addClass("next-question");
	}

	// Will end transitions and clean the game board
	function cleanBoard() {
		gameBoard.removeClass("next-question level-up game-over");
		_('.right').removeClass("right");
		_('.wrong').removeClass("wrong");
	}

}
