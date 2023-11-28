const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const utilisateursConnectes = new Map();
let nombreUtilisateurs = 0;

server.listen(8080, () => {
  console.log('Serveur HTTP écoutant sur le port 8080');
});

wss.on('connection', (socket, req) => {
  console.log('Nouvelle connexion WebSocket établie.');

  const sessionId = req.url.substring(1);
  socket.on('message', (message) => {
    try {
      const donnees = JSON.parse(message);

      if (donnees.type === 'connexion') {
        if (nombreUtilisateurs >= 3) {
          socket.send(JSON.stringify({ 
            type: 'erreur', 
            message: 'Nombre maximum d\'utilisateurs atteint.' 
          }));
          socket.close();
          return;
        }
        const nouveauSessionId = uuidv4(); 
        const nomJoueur = donnees.nom;
        
        utilisateursConnectes.set(nouveauSessionId, { socket, nomJoueur });
        nombreUtilisateurs++;
        if (nombreUtilisateurs === 3) {
          utilisateursConnectes.forEach(({ socket: userSocket, nomJoueur: userNom }, userSessionId) => {
            if (userSocket.readyState === WebSocket.OPEN) {
              userSocket.send(JSON.stringify({ 
                type: 'redirect', 
                message: 'Le nombre de joueurs requis pour commencer le jeu est atteint.', 
                redirect: '/client.html'
              }));
            }
          });
        }
        socket.send(JSON.stringify({ 
          type: 'confirmation', 
          message: `Connexion réussie. Votre Session ID: ${nouveauSessionId}`, 
          sessionId: nouveauSessionId,
          nom: nomJoueur
        }));
        updateClients();
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse du message JSON :', error);
    }
  });
  socket.on('close', () => {
    utilisateursConnectes.forEach((userSocket, userSessionId) => {
      if (userSocket === socket) {
        utilisateursConnectes.delete(userSessionId);
        nombreUtilisateurs--;
      }
    });
    updateClients();
    console.log('Connexion WebSocket fermée.');
  });
});

function updateClients() {
  const utilisateursListe = Array.from(utilisateursConnectes.entries()).map(([id, socket]) => ({
    sessionId: id, 
    nom: socket.nomJoueur
  }));
  const donneesReponse = {
    type: 'utilisateurs',
    utilisateurs: utilisateursListe,
    nombre: nombreUtilisateurs,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(donneesReponse));
    }
  });
}

app.get('/:sessionId', (req, res) => {
  res.sendFile(__dirname + '/public/client.html');
});

app.use(express.static('public')); 
