var questionArray = [new question("How far is the sun in sols?",["0","1","2","9.8"],1),new question("What is the greatest city in the bay?",["Port Costa","San Francisco", "Oakland","Sausalito"],0),new question("The following is a non-exhaustive list of Michael's Bay to Breaker's costumes. Which sucked the most to run in?",["Thor","Super Bloom", "Winnie the Pooh","Adam"],2), new question("How many kitkats did I eat in class on Monday?",["1","2", "3", "5+"],3)];
var user1Answer = "";
var questionNumber = 0;
var correctAnswer = "";
var liveQuestion = false;
var rights = 0;
var wrongs = 0;
var gameStart = false;

function question(question, answerArray, rightAnswerIndex) {
	this.question = question;
	this.answerArray = answerArray;
	this.rightAnswerIndex = rightAnswerIndex;
};

function reset() {
	user1Answer = ""; 
	questionNumber = 0;
	rights = 0; 
	wrongs = 0;
	$("#wrongAnswers").text(wrongs);
	$("#rightAnswers").text(rights);
}


function newQuestion () {
	$("#messageBox").empty();
	$("#answerRow").empty();
	if (questionNumber === questionArray.length) {
		gameOver();
		return;
	}
	question = questionArray[questionNumber];
	correctAnswer = question.rightAnswerIndex;
	$("#question").text(question.question);
	for (var i = 0; i < question.answerArray.length; i++) {
		$("#answerRow").append($("<div>").addClass("col-sm-3 answer").attr("id","answer"+i).data('answer',i).append($("<h3>").text(question.answerArray[i])));
	}
	timer.reset().start();
	liveQuestion = true;
	$(".answer").on("click", function() {
		guess(this);
	});
}

function gameOver () {
	$("#question").text("Game Over! You got " + rights + " of " + questionArray.length + " questions right.");
	$("#question").append($("<br>"));
	$("#question").append($("<button />").text("Play again?").attr("id","playAgain"));
	$("#playAgain").on("click", function() {
		reset();
		newQuestion();
	});
}

var timerRunning = false;
var intervals = [];

var timer = {

	time: 10,

	reset: function() {
		timer.time = 10;
		$("#timer").text(timer.time);
		return timer;
	},

	start: function() {
		if (!timerRunning) {
			intervals.push(setInterval(timer.count,1000));
		}
		timerRunning = true;
		return timer;
	},
	stop: function() {
		clearInterval(intervals.pop());
		timerRunning = false;
		return timer;
	},
	count: function() {
		if (timer.time<=0) {
			console.log("Time's up");
			outOfTime();
		} else {
			$("#timer").text(--timer.time);
		}
	}
}

function guess(obj) {
	user1Answer = $(obj).data('answer');
	$("#answer"+correctAnswer).css("color","green");
	timer.stop();
	if (liveQuestion) {
		liveQuestion = false;
		if (user1Answer === correctAnswer) {
			console.log("Hurray");
			$("#rightAnswers").text(++rights);
			$("#messageBox").text("Hurray! Next question in 5 seconds.");
		} else {
			console.log("Better luck next time");
			$("#messageBox").text("Wrong! Next question in 5 seconds.");
			$("#wrongAnswers").text(++wrongs);
			$("#answer"+user1Answer).css("color","red");
		}
		questionNumber++;
	}
	setTimeout(newQuestion,5000);
};

function outOfTime() {
	$("#wrongAnswers").text(++wrongs);
	$("#messageBox").text("You're out of time. Gotta be a little quicker!\r\nNext question in 5 seconds.");
	$("#answer"+correctAnswer).css("color","green");
	timer.stop();
	questionNumber++;
	setTimeout(newQuestion,5000);
}

$("html").click(function() {
	if(gameStart === false) {
		gameStart = true;
		$("#starterText").empty();
		reset();
		newQuestion();
	}
});