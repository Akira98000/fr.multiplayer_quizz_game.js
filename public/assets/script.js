document.addEventListener('DOMContentLoaded', () => {
    loadQuizData();
});

function loadQuizData() {
    fetch('./data.json') // Assurez-vous que le chemin est correct
        .then(response => response.json())
        .then(questions => {
            displayQuestion(questions[0]); // Afficher la première question
        });
}

function displayQuestion(questionData) {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answer-buttons');

    questionElement.textContent = questionData.question;
    answersElement.innerHTML = ''; // Nettoyer les boutons précédents

    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer, questionData.correctAnswer));
        answersElement.appendChild(button);
    });
}

function selectAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        console.log("Bonne réponse !");
    } else {
        console.log("Mauvaise réponse !");
    }
    // Ajoutez ici la logique pour passer à la question suivante
}
