var $timer_display = $("#timer-display");
var $q = $("#question");

var questionObj = function (str, arr, n) {
    return {
        question: str,
        options: arr,
        answer: n
    }
}

var intervalId = null;

var clock = {
    time: 0,
    maxTime: 0,

    stop: function () {
        clearInterval(intervalId);
    },
    start: function (n) {
        clock.maxTime = n;
        clock.time = clock.maxTime;
        intervalId = setInterval(clock.tick, 1000);
        clock.displayTime();
    },
    tick: function () {
        clock.time--;
        if (clock.time === 0) {
            clock.displayTime();
            game.selectAnswer(400);
            clock.stop();
        } else {
            clock.displayTime();
        }
    },
    displayTime: function () {
        $timer_display.text(clock.timeConverter());
    },
    timeConverter: function () {
        var minutes = Math.floor(clock.time / 60);
        var seconds = clock.time - (minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes === 0) {
            minutes = "00";
        }
        else if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return minutes + ":" + seconds;
    },
}

var game = {
    questions: [],
    nextIndex: 0,
    currentQuestion: questionObj(0,0,0),
    score: 0,
    lastQuestion: false,

    fillOptions: function () {
        for (let i = 0; i < 4; i++) {
            let ref = "#" + i;
            $(ref).text(this.currentQuestion.options[i]);
        }
    },
    emptyOptions: function () {
        for (let i = 0; i < 4; i++) {
            let ref = "#" + i;
            $(ref).text("");
        }
    },
    displayQuestion: function () {
        $q.text(this.currentQuestion.question)
        this.fillOptions();
    },
    displayScore: function () {
        this.emptyOptions();
        $("#score").text("Score: " + this.score + " out of " + this.nextIndex);
    },
    newQuestion: function () {
        if (game.lastQuestion) {
            $q.text("Game over! You answered all the questions!");
            $("#restart").removeClass("hide");
        } else {
            $("#score").text("");
            clock.start(30);
            game.currentQuestion = game.questions[game.nextIndex];
            game.nextIndex++;
            if (game.nextIndex >= game.questions.length) {
                game.lastQuestion = true;
            }
            game.displayQuestion();
        }
    },
    selectAnswer: function (i) {
        if (i === this.currentQuestion.answer) {
            $q.text("Correct!");
            this.score++;
        } else if (clock.time === 0) {
            $q.text("You ran out of time!");
        } else {
            $q.text("Incorrect!");
        }
        this.displayScore();
        setTimeout(game.newQuestion, 5000);
        clock.stop();
    },
    buildQuestions: function () {
        for (let i = 0; i < 10; i++) {
            let q = "This is question " + i;
            let a = ["First answer", "Second answer", "Third answer", "Fourth answer"];
            let n = i % 4;
            this.questions.push(questionObj(q, a, n))
        }
    },
    init: function () {
        this.questions = [];
        this.score = 0;
        this.nextIndex = 0;
        this.currentQuestion = questionObj(0,0,0);
        this.lastQuestion = false;
        this.buildQuestions();
        this.newQuestion();
    }
}

function createListeners() {
    $(".answer").on("click", function () {
        game.selectAnswer(parseInt(this.id));
    });

    $("#restart").on("click", function() {
        game.init();
        $("#restart").addClass("hide");
    })
}

createListeners();
game.init();