const form = document.getElementById('saisie-form');
const inputNom = document.getElementById('nom-joueur');
const afficherNom = document.getElementById('afficher-nom');
const afficherUtilisateurs = document.getElementById('utilisateurs-connectes');
const messageConfirmation = document.getElementById('message-confirmation');
const afficherNombreUtilisateurs = document.getElementById('nombre-utilisateurs');
const formElements = document.querySelectorAll('.form-elements');
const subtitle = document.getElementById('subtitle');
const title = document.getElementById('title');
const description = document.getElementById('description');

const sessionId = window.location.pathname.substring(1);
const socket = new WebSocket('ws://localhost:8080');

let nomUtilisateur;

socket.addEventListener('message', (event) => {
  try {
    const donnees = JSON.parse(event.data);

    if (donnees.type === 'confirmation') {
      messageConfirmation.textContent = donnees.message;
      nomUtilisateur = donnees.nom;
      subtitle.textContent = `Bienvenue, ${nomUtilisateur} dans mon serveur !`;
      title.textContent = 'En Attente ...';
      afficherNom.textContent = `pseudo dans le serveur : ${donnees.nom}`;
    } else if (donnees.type === 'utilisateurs') {
      const utilisateurs = `Voici la liste des joueurs actuellement connectés: ${donnees.utilisateurs.map(u => u.nom).join(', ')}`;
      //const utilisateurs = donnees.utilisateurs.map(u => u.nom).join(', ');
      afficherUtilisateurs.textContent = utilisateurs;
      afficherNombreUtilisateurs.textContent = `Nombre d'utilisateurs connectés : ${donnees.nombre}`;
    }
    if (donnees.type === 'erreur'){
      subtitle.textContent = `Désolé , ${nomUtilisateur} mon serveur est bouché !`;
      title.textContent = 'Erreur 441 détectée';
      messageConfirmation.textContent = `Message d'erreur signalé par le serveur 'CH:BASEL': ${donnees.message}. Je suis navré ${nomUtilisateur} mais malheureusement la session de cette serveur à dépassé la limite de 3 joueurs. Veuillez réessayer plus tard.` ;
    }

    if (donnees.type === 'redirect') {
      window.location.href = donnees.redirect;
    }

  } catch (error) {
    console.error('Erreur lors de l\'analyse du message JSON :', error);
  }
});

form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  const formParent = form.parentNode;
  formParent.removeChild(form);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nomJoueur = inputNom.value;
  socket.send(JSON.stringify({
    type: 'connexion',
    nom: nomJoueur
  }));

  inputNom.value = ''; 
});

form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  description.textContent = 'Veuillez attendre que les autres joueurs se connectent sur votre serveur, il faut être minumum 3 joueurs pour commencer la partie';
  inputNom.value = '';
});



function envoyerMessage(message) {
  socket.send(JSON.stringify(message));
}
