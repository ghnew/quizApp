// Variables
const quizContainer = document.getElementById('wrapper');
const resultsContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const loadingScreen = document.getElementById("loading");

// Pagination
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
let slides; // for selecting all slides
let currentSlide = 0;

// individual questions
let myQuestions;

function buildQuiz(){
	// variable to store the HTML output
	const output = [];

	// for each question...
	myQuestions.forEach(
		(currentQuestion, questionNumber) => {

			// to store all options
			const options = [];

			// randomize currect and incorrect option
			let itemOptions = [...currentQuestion.incorrect_answers];
			itemOptions.push(currentQuestion.correct_answer);

			shuffleArray(itemOptions);

			// and for each available option...
			for (let i = 0; i < itemOptions.length; i++) {

				// ...add an HTML radio button
				options.push(
					`<div class="check-wrapper">
						<div class="form-check">
								<input 
									class="form-check-input" 
									type="radio" 
									name="question${questionNumber}" 
									value="${itemOptions[i]}" 
									id="question${questionNumber}${i}"
								>
								<label 
									class="form-check-label" 
									for="question${questionNumber}${i}"
								>
									${itemOptions[i]}
								</label>
						</div>
					</div>`
				);
			}

			// add the question card and include all the options
			output.push(
				`<div class="card">
					<div class="card-body">
						<div 
							class="card-title"
						>
							${currentQuestion.question}
						</div>
						<div class="card-text">
							${options.join('')}
						</div>
					</div>
				</div>`
			);
		}
	);

	// finally combine our output list into one string of HTML and put it on the page
	quizContainer.innerHTML = output.join('');
}

function showSlide(n) {
	slides[currentSlide].classList.remove('active');
	slides[n].classList.add('active');
	currentSlide = n;
	if (currentSlide === 0) {
		previousButton.style.display = 'none';
	} else {
		previousButton.style.display = 'inline-block';
	}
	if (currentSlide === slides.length - 1) {
		nextButton.style.display = 'none';
		submitButton.style.display = 'inline-block';
	} else {
		nextButton.style.display = 'inline-block';
		submitButton.style.display = 'none';
	}
}

function showResults() { 
	// gather answer containers from our quiz
	const answerContainers = quizContainer.querySelectorAll('#quiz .card-text');

	// keep track of user's correct answers
	let numCorrect = 0;

	// for each question...
	myQuestions.forEach((currentQuestion, questionNumber) => {

		// find selected answer
		const answerContainer = answerContainers[questionNumber];
		const selector = `input[name=question${questionNumber}]:checked`;
		const userAnswer = (answerContainer.querySelector(selector) || {}).value;

		// if answer is correct
		if(userAnswer === currentQuestion.correct_answer){
			// add to the number of correct answers
			numCorrect++;

			// color the answers green
			answerContainers[questionNumber].parentElement.parentElement.classList.add("alert-success");
		}
		// if answer is wrong or blank
		else{
			// color the answers red
			answerContainers[questionNumber].parentElement.parentElement.classList.add("alert-danger");
		}
	});

	// show number of correct answers out of total
	resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
	resultsContainer.style.display = "block";
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
		}
}

document.addEventListener("DOMContentLoaded", function() {

	fetch("https://opentdb.com/api.php?amount=5&category=23&difficulty=easy&type=multiple")
		.then(res => res.json())
		.then(data => {
			myQuestions = data.results;

			loadingScreen.style.display = "none";

			buildQuiz(); // render quiz

			slides = document.querySelectorAll("#quiz .card");
			showSlide(currentSlide);
		});


	// event listerners
	previousButton.addEventListener("click", () => {
		showSlide(currentSlide - 1);
	});

	nextButton.addEventListener("click", () => {
		showSlide(currentSlide + 1);
	});

	submitButton.addEventListener('click', showResults);

});