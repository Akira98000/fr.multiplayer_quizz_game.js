let questions = [];
let questionIndex = 0;
let timer;
const dureeQuestion = 10;

const questionText = document.getElementById('question-text');
const reponseInput = document.getElementById('reponse-input');
const repondreButton = document.getElementById('repondre-button');
const resultatText = document.getElementById('resultat-text');
const compteurText = document.getElementById('compteur-text');

function afficherQuestion() {
  if (questionIndex < questions.length) {
    questionText.textContent = questions[questionIndex].question;
    resultatText.textContent = '';
    reponseInput.value = '';
    repondreButton.disabled = false;
    demarrerCompteur();
  } else {
    questionText.textContent = 'Fin du jeu.';
    resultatText.textContent = '';
    reponseInput.disabled = true;
    repondreButton.disabled = true;
  }
}

function demarrerCompteur() {
  let tempsRestant = dureeQuestion;
  compteurText.textContent = `Temps restant : ${tempsRestant}s`;

  timer = setInterval(() => {
    tempsRestant--;
    compteurText.textContent = `Temps restant : ${tempsRestant}s`;

    if (tempsRestant === 0) {
      clearInterval(timer);
      repondreButton.disabled = true;
      verifierReponse();
    }
  }, 1000);
}

function verifierReponse() {
  const reponseJoueur = reponseInput.value.trim();
  const reponseCorrecte = questions[questionIndex].reponse;

  if (reponseJoueur.toLowerCase() === reponseCorrecte.toLowerCase()) {
    resultatText.textContent = 'Bonne réponse!';
  } else {
    resultatText.textContent = 'Mauvaise réponse.';
  }

  questionIndex++;
  setTimeout(afficherQuestion, 2000);
}

repondreButton.addEventListener('click', () => {
  clearInterval(timer);
  repondreButton.disabled = true;
  verifierReponse();
});

fetch('./data/question.json')
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    afficherQuestion();
  })
  .catch((error) => {
    console.error('Erreur lors du chargement des questions :', error);
  });
