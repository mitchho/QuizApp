

// Note: ideally you'd save this data in a JSON file,
// and use jQuery to load the JSON. It's better to store
// raw data like this in an external JSON file, instead of
// inside the JS code that contains application logic. This
// array gets set equal to questions[] in getNewQuiz().
var QUIZDATA = [
  {
    text: "What breed of dog is this ?",
    choices: ["Fox Terrier", "Boston Terrier", "Welsh Terrier", "Irish Terrier"],
    correctChoiceIndex: 2,
    imagePath: "images/welshTerrier.jpg"
  },
  {
    text: "Can you guess the breed of this dog ?",
    choices: ["Poodle", "Border Collie", "Beagle", "Basset Hound"],
    correctChoiceIndex: 1,
    imagePath: "images/borderCollie.jpg"
  },
  {
    text: "What is the breed of this dog ?",
    choices: ["Bolognese", "Scottish Terrier", "Pekingese", "Maltese"],
    correctChoiceIndex: 3,
    imagePath: "images/maltese.jpg"
  },
  {
    text: "What breed of dog is this ?",
    choices: ["Schnauzer", "Wired Fox Terrier", "Jack Russell Terrier", "Chinook"],
    correctChoiceIndex: 1,
    imagePath: "images/foxTerrier.jpg"
  },
  {
    text: "Can you guess the breed of this dog ?",
    choices: ["Airedale Terrier", "Irish Setter", "Irish Terrier", "Golden Retriever"],
    correctChoiceIndex: 2,
    imagePath: "images/irishTerrier.jpg"
  },
  {
    text: "What is the breed of this dog ?",
    choices: ["Yorkshire Terrier", "Dachshund", "Irish Terrier", "Shih Tzu"],
    correctChoiceIndex: 3,
    imagePath: "images/shihTzu.jpg"
  },
  {
    text: "What is the breed of this dog ?",
    choices: ["Rottweiler", "Pit Bull Terrier", "Afghan Hound", "German Shepherd"],
    correctChoiceIndex: 0,
    imagePath: "images/rottweiler.jpg"
  },
  {
    text: "What breed of dog is this ?",
    choices: ["Rottweiler", "Beagle", "Afghan Hound", "German Shepherd"],
    correctChoiceIndex: 1,
    imagePath: "images/beagle.jpg"
  },
  {
    text: "What is the breed of this dog ?",
    choices: ["Siberian Husky", "English Setter", "Dalmatian", "Cocker Spaniel"],
    correctChoiceIndex: 0,
    imagePath: "images/siberianHusky.jpg"
  },
  {
    text: "Can you guess the breed of this dog ?",
    choices: ["Lakeland Terrier", "Cairn Terrier", "Pomeranian", "Schnauzer"],
    correctChoiceIndex: 2,
    imagePath: "images/pomeranian.jpg"
  }
];

// Quiz class definition - note the curly brackets
// indicate a class here
var Quiz = {

  score: 0,
  questions: [],            // set equal to QUIZDATA in getNewQuiz()
  currentQuestionIndex: 0,  // where does this get incremented ?
                            // in the handleSeeNext() function

  // we'll call this method below in this file
  // in the functions that deal with inserting
  // content into the DOM.
  currentQuestion: function() {
    return this.questions[this.currentQuestionIndex]
  },
 
  // ditto here: this is also used to generate content
  // that will be inserted into the DOM below.
  answerFeedbackHeader: function(isCorrect) {
    return isCorrect ? "<h6 class='user-was-correct'>correct (add breed info below here)</h6>" :
      "<h1 class='user-was-incorrect'>Incorrect (add correct breed info below here)</>";
  },

  // this method is used to generate text on
  // whether or not the user guessed correctly.
  // if they are correct, the feedback text will
  // be randomly chosen from `praises`, and if they're
  // incorrect, it will be randomly chosen from
  // `admonishments`.
  answerFeedbackText: function(isCorrect) {

    var praises = [
      "Wow. You got it right. I bet you feel really good about yourself now",
      "Correct. Which would be impressive, if it wasn't just luck",
      "Oh was I yawning? Because you getting that answer right was boring me to sleep",
      "Hear all that applause for you because you got this question right? Neither do I."
    ];

    var admonishments = [
      "Really? That's your guess? WE EXPECTED BETTER OF YOU!",
      "Looks like someone wasn't paying attention in telepathy school, geesh!",
      "That's incorrect. You've dissapointed yourself, your family, your city, state, country and planet, to say nothing of the cosmos"
    ];

    // another tenrary operator
    var choices = isCorrect ? praises : admonishments;
    return choices[Math.floor(Math.random() * choices.length)];

  },

  seeNextText: function() {
    return this.currentQuestionIndex <
      this.questions.length - 1 ? "Next" : "How did I do?";

  },

  questionCountText: function() {
    return (this.currentQuestionIndex + 1) + "/" +
      this.questions.length + " -->   ";
  },

  questionScoreText: function() {
    if (this.currentQuestionIndex > 0)
    {
      return (this.score + " out of " + this.currentQuestionIndex
        + " correct so far.");

    }
  //  return (this.currentQuestionIndex + 1) + "/" +
  //    this.questions.length + ": ";
  },

  finalFeedbackText: function() {
    return "You got " + this.score + " out of " +
      this.questions.length + " questions right.";
  },

  // this method compares the user's answer to
  // the correct answer for the current question
  scoreUserAnswer: function(answer) {
    var correctChoice = this.currentQuestion().choices[this.currentQuestion().correctChoiceIndex];
    if (answer === correctChoice) {
      this.score ++;
    }
    return answer === correctChoice;
  }

}  //  end Quiz class definition


// factory method for creating
// a new quiz.
function getNewQuiz() {
  var quiz = Object.create(Quiz);
  // `QUIZDATA` is defined at the top of this file
 
/*
 var json;
$.ajax({
    url: "../../Unit3JavaScript/QuizApp/js/quizData.json",
    dataType: 'json',
    success: function(data) {
        json = $.parseJSON(data.quizData);
    }
});
alert(json); 
  */
/*
$.each(JSON.parse('js/quizData.json'), function(idx, obj) {
	alert(obj.tagName);
});
*/

 

  quiz.questions = QUIZDATA;
  return quiz
}

// DOM manipulation
//
// the following functions handle listening for
// user events (answering a question, clicking "Next")
// and altering the DOM. Note the clear separation of
// concerns this gives us. The `Quiz` object is responsible
// for managing the state of the application (which question
// is the current one? is the user's answer correct?), and
// these functions are responsible for listening to what the
// user is doing and responding by generating the right elements
// and inserting them into the DOM.

function makeCurrentQuestionElement(quiz) {

  // this is the clone method mentioned in the comments at the top
  // of the file. Have a look at index.html to see the HTML that
  // this clone will give us. Again, the advantage here is that we
  // minimize the amount of HTML that we have inside our JavaScript,
  // which makes maintenance much easier.
  
  
  var question = quiz.currentQuestion();
  console.log($("#js-question-template").children('img'));
  
  var dogImagePath = question.imagePath;
  console.log(dogImagePath);
  $("#theDogImage").attr('src', dogImagePath);

  var questionElement = $("#js-question-template" ).children().clone();

  //  the jQuery find() method returns descendant elements of the selected element.
  questionElement.find(".js-question-count").text(quiz.questionCountText());
  questionElement.find(".js-question-score").text(quiz.questionScoreText());
  questionElement.find('.js-question-text').text(question.text);

  // add choices as radio inputs
  // question.choices is an array of text strings
  for (var i = 0; i < question.choices.length; i++) {

    var choice = question.choices[i];  //  text string 1-2-3 or 4
    //  choiceElement is just a div with a radio button and a label 
    //  to the right in it
    var choiceElement = $( "#js-choice-template" ).children().clone();
    //  makes the submit value equal the text in choice
    choiceElement.find("input").attr("value", choice);
    //  not sure about this line
    var choiceId = "js-question-" + quiz.currentQuestionIndex + "-choice-" + i;
    choiceElement.find("input").attr("id", choiceId)
    choiceElement.find("label").text(choice);
    choiceElement.find("label").attr("for", choiceId);
    questionElement.find(".js-choices").append(choiceElement);
     
  };

  return questionElement;
}

function makeAnswerFeedbackElement(isCorrect, correctAnswer, quiz) {
  var feedbackElement = $("#js-answer-feedback-template").children().clone();
  feedbackElement.find(".js-feedback-header").html(
    quiz.answerFeedbackHeader(isCorrect));
  //feedbackElement.find(".js-feedback-text").text(
  //  quiz.answerFeedbackText(isCorrect));
  feedbackElement.find(".js-see-next").text(quiz.seeNextText());
  return feedbackElement;
}

function makeFinalFeedbackElement(quiz) {
  var finalFeedbackElement = $("#js-final-feedback-template").clone();
  finalFeedbackElement.find(".js-results-text").text(quiz.finalFeedbackText());
  return finalFeedbackElement;
}

// this function just listens for when the user clicks the next button
// element - if there are more questions, it displays the next one,
// otherwise it displays the final feedback
function handleSeeNext(quiz, currentQuestionElem) {

  $("main").on("click", ".js-see-next", function(event) {

    if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
      // manually remove event listener on the `.js-see-next` because they
      // otherwise continue occuring for previous, inactive questions
      $("main").off("click", ".js-see-next");
      quiz.currentQuestionIndex ++;
      $("main").html(makeCurrentQuestionElement(quiz));
    }
    else {
      $("main").html(makeFinalFeedbackElement(quiz))
    }
  });
}

// listen for when user submits answer to a question
function handleAnswers(quiz) {
  $("main").on("submit", "form[name='current-question']", function(event) {
    event.preventDefault();
    //  note that answer is a string here
    var answer = $("input[name='user-answer']:checked").val();
    console.log("answer chosen: " + answer);
    quiz.scoreUserAnswer(answer);
    var question = quiz.currentQuestion();
    var correctAnswer = question.choices[question.correctChoiceIndex];
    var isCorrect = answer === correctAnswer;  //  huh ?
    handleSeeNext(quiz);  // adds listener for "Next" button
    $("main").html(makeAnswerFeedbackElement(isCorrect, correctAnswer, quiz));
  });
}

// listen for when the user indicates they want to
// restart the game.
function startNewQuiz() {
  $("main").on("click", ".js-restart-game", function(event){
    event.preventDefault();
    // this removes all event listeners from `<main>` because we want them
    // set afresh by `beginQuizHandler`
    $("main").off();
    beginQuizHandler();
  });
}

// display the quiz start content, and listen for
// when the user clicks "start quiz"
function beginQuizHandler() {
	//  note that this inserts the html from the "js-start-template"
	//  div inside the main element - confirmed in web inspector
  $("main").html($("#js-start-template").clone());
  $("form[name='game-start']").submit(function(event) {
    var quiz = getNewQuiz();
    event.preventDefault();
   // When .html() is used to set an element's (main here) content , any content that 
   // was in that element is completely replaced by the new content. Additionally,
   // jQuery removes other constructs such as data and event handlers from 
   // child elements before replacing those elements with the new content. This 
   // explains why the "#js-start-template" content cloned and added to the main 
   // element above disappears as soon as we click the start button.
    $("main").html(makeCurrentQuestionElement(quiz));
    handleAnswers(quiz); //  adds listener for "Submit" button
    startNewQuiz();      //  adds listener for "Start Over" button
  });
}

$(document).ready(function(){

	beginQuizHandler();
});