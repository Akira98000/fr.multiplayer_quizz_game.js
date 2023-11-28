const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next-button");
const timerElement = document.getElementById("timer");

let currentQuestionIndex = 0;
let questions = [];
let timer;

fetch("./assets/data/data.json")
    .then((response) => response.json())
    .then((data) => {
        questions = data;
        displayQuestion(currentQuestionIndex);
        startTimer(); 
    });

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
        resetTimer();
        startTimer(); 
    } else {
        window.location.href = "./../../cli.html";
    }
});

function displayQuestion(index) {
    const question = questions[index];
    questionElement.textContent = question.question;
    choicesElement.innerHTML = "";

    question.choices.forEach((choice, choiceIndex) => {
        const choiceButton = document.createElement("button");
        choiceButton.type = "button";
        choiceButton.textContent = choice;
        choiceButton.addEventListener("click", () => checkAnswer(index, choiceIndex));
        choicesElement.appendChild(choiceButton);
    });
}

function checkAnswer(questionIndex, choiceIndex) {
    const correct = questions[questionIndex].correct;
    const selectedButton = choicesElement.querySelectorAll("button")[choiceIndex];

    if (choiceIndex === correct) {
        alert("Bonne réponse !");
        selectedButton.classList.add("correct");
    } else {
        alert("Mauvaise réponse. Essayez encore !");
        selectedButton.classList.add("incorrect"); 
    }
    
    clearInterval(timer); 
    nextButton.click(); 
}


function checkAnswer(questionIndex, choiceIndex) {
    const correct = questions[questionIndex].correct;
    if (choiceIndex === correct) {
        alert("Bonne réponse !");
        nextButton.click(); 
    } else {
        alert("Mauvaise réponse. Essayez encore !");
    }
    clearInterval(timer); 
}


function startTimer() {
    let timeLeft = 10; 

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            timerElement.textContent = `timeout !`;
            clearInterval(timer); 
            nextButton.click();
        } else {
            timerElement.textContent = `${timeLeft} sec`;
            timeLeft--;
        }

        if (timeLeft < 0) {
            clearInterval(timer); 
            timerElement.textContent = `timeout !`;
            nextButton.click();
        }
    }, 1000); 
}

function resetTimer() {
    clearInterval(timer); 
    timerElement.textContent = ""; 
}


