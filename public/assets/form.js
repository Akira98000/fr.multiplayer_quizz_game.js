const form = document.getElementById('saisie-form');
const inputNom = document.getElementById('nom-joueur');
const afficherNom = document.getElementById('afficher-nom');
const afficherUtilisateurs = document.getElementById('utilisateurs-connectes');
const messageConfirmation = document.getElementById('message-confirmation');
const afficherNombreUtilisateurs = document.getElementById('nombre-utilisateurs');

const sessionId = window.location.pathname.substring(1);
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('message', (event) => {
  try {
    const donnees = JSON.parse(event.data);

    if (donnees.type === 'confirmation') {
      messageConfirmation.textContent = donnees.message;
      afficherNom.textContent = `Votre nom: ${donnees.nom}`;
    } else if (donnees.type === 'utilisateurs') {
      const utilisateurs = donnees.utilisateurs.map(u => u.nom).join(', ');
      afficherUtilisateurs.textContent = utilisateurs;
      afficherNombreUtilisateurs.textContent = `Nombre d'utilisateurs connectés : ${donnees.nombre}`;
    }

    if (donnees.type === 'redirect') {
      window.location.href = donnees.redirect;
    }

  } catch (error) {
    console.error('Erreur lors de l\'analyse du message JSON :', error);
  }
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

function envoyerMessage(message) {
  socket.send(JSON.stringify(message));
}
