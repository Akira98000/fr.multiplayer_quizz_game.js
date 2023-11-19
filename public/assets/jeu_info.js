const listeJoueurs = document.getElementById('liste-joueurs');

socket.addEventListener('message', (event) => {
  try {
    const donnees = JSON.parse(event.data);

    if (donnees.type === 'utilisateurs') {
      afficherListeJoueurs(donnees.utilisateurs);
    }
  } catch (error) {
    console.error('Erreur lors de l\'analyse du message JSON :', error);
  }
});

function afficherListeJoueurs(utilisateurs) {
    listeJoueurs.innerHTML = '';
  
    utilisateurs.forEach((joueur) => {
      const joueurElement = document.createElement('div');
      joueurElement.textContent = joueur.nom;
      listeJoueurs.appendChild(joueurElement);
    });
    console.log(utilisateurs);
  }
  
