// found at https://steinbrennergit.github.io/trivia-game/
// repo at https://github.com/steinbrennergit/trivia-game/
// linked from https://steinbrennergit.github.io/bootstrap-portfolio/

// References to html elements for display
var $timer_display = $("#timer-display");
var $q = $("#question");

// intervalId necessary to be defined outside clock
var intervalId = null;

// Question object contains the question, options, and index of correct answer
var questionObj = function (str, arr, n) {
    return {
        question: str,
        options: arr,
        answer: n
    }
}

// Took code from stopwatch exercise and modified to suit this purpose
var clock = {
    time: null,
    maxTime: null,

    // Clear the interval before starting a new timer
    stop: function () {
        clearInterval(intervalId);
    },

    // Start takes the number of seconds to count down from
    start: function (n) {
        clock.maxTime = n;
        clock.time = clock.maxTime;
        intervalId = setInterval(clock.tick, 1000);
        clock.displayTime();
    },

    // Each tick counts down 1 second
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

    // Update timer display in html
    displayTime: function () {
        $timer_display.text(clock.timeConverter());
    },

    // Fancy str manipulation to output the display
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
};
// End of stopwatch code


// Game object
var game = {

    // Declare obj variables
    questions: null,
    nextIndex: null,
    currentQuestion: null,
    score: null,
    lastQuestion: null,

    // Display all the options for the current question
    fillOptions: function () {
        for (let i = 0; i < 4; i++) {
            let ref = "#" + i;
            $(ref).text(this.currentQuestion.options[i]);
        }
    },

    // Empty the display of options; call after a selection is made
    emptyOptions: function () {
        for (let i = 0; i < 4; i++) {
            let ref = "#" + i;
            $(ref).text("");
        }
    },

    // Display the current question
    displayQuestion: function () {
        $q.text(this.currentQuestion.question)
        this.fillOptions();
    },

    // Display the player's progress; call after a selection is made
    displayScore: function () {
        this.emptyOptions();
        let ending = "s.";
        if (this.nextIndex === 1) {
            ending = ".";
        }
        $("#score").text("Score: " + this.score + " correct out of " + this.nextIndex + " question" + ending);
    },

    // Check if game over; grab the next question and call displayQuestion()
    newQuestion: function () {
        // If the game is over; display msg, unhide the restart button
        if (game.lastQuestion) {
            $q.text("Game over! You answered all the questions!");
            $("#restart").removeClass("hide");

            // If game is running; reset display, reset clock, grab next question
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

    // Called when player selects an answer or time-out; determine if correct, change display
    selectAnswer: function (i) {
        // If correct; display msg and increment score
        if (i === this.currentQuestion.answer) {
            $q.text("Correct!");
            this.score++;

            // If incorrect; display appropriate msg for time-out or wrong answer
        } else if (clock.time === 0) {
            $q.text("You ran out of time! The correct answer was: '" + correctAnswer + "'");
        } else {
            let correctAnswer = this.currentQuestion.options[this.currentQuestion.answer];
            $q.text("Incorrect! The correct answer was: '" + correctAnswer + "'");
        }

        // Display current progress, stop the clock, freeze the page for 4 seconds
        this.displayScore();
        clock.stop();
        setTimeout(game.newQuestion, 4000);
    },

    // Builds a list of placeholder questions; would love to replace this with an API
    // Or any other way to avoid manually hard-coding 10+ questions
    buildQuestions: function () {
        for (let i = 0; i < 10; i++) {
            let q = "This is question " + i;
            let a = ["First answer", "Second answer", "Third answer", "Fourth answer"];
            let n = i % 4;
            this.questions.push(questionObj(q, a, n))
        }
    },

    // Initial function call for game obj; starts (or resets) the game
    init: function () {
        this.questions = [];
        this.score = 0;
        this.nextIndex = 0;
        this.currentQuestion = questionObj(0,0,0);
        this.lastQuestion = false;
        this.buildQuestions();
        this.newQuestion();
    }
};

// Creates listeners for buttons
function createListeners() {

    // Select an answer, pass the id (index) of the anwer to the game
    $(".answer").on("click", function () {
        game.selectAnswer(parseInt(this.id));
    });

    // Restart button only appears when the game ends; hides itself again if clicked
    $("#restart").on("click", function() {
        game.init();
        $("#restart").addClass("hide");
    })
}

// Initial function calls to start the game
createListeners();
game.init();