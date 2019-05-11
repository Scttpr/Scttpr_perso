# Websocket

* Un protocole qui permet de créer des services web en temps réel

## Comment ça marche ?

* Jusqu'à maintenant Client & Serveur, on fonctionne par requête et réponse, une fois le traitement de la requête, le serveur renvoi la réponse

* Comment faire pour informer le client si quelque chose change sur le serveur (par exemple une connexion au chat, ou un client a envoi un message au serveur, comment le client b peut voir le changement sachant qu'il n'envoi pas de requête ?)
* Websocket permet de push des informations du serveur vers le client
    * Protocole construit depuis HTTP
    * Ce n'est plus requête réponse, ça devient des échanges de données dans les deux sens (push data), on peut utiliser les deux protocole (HTTP, websocket) dans une application !

## Les solutions au websocket

* Le module le plus populaire est socket.io
* Utilise le websocket, mais on a pas besoin de socket.io pour paramétrer un websocket !
* `yarn add socket.io` == __/!\ Il faut installer le module côté front et côté back !__

### Côté serveur

* Pour paramétrer socket.io, dans le fichier server.js (le front controller):
```js
// C'est un protocole différent, les requêtes websocket ne rentrent pas en conflit avec les requêtes HTTP
mongoose.connect('UrlDeConnexion')
    .then(result => {
        const server = app.listen(8080);
        // On installe le webscoket ici ! Socket io renvoi une fonction qu'on peut exécuter directement, elle prend le server HTTP en param !
        const io = require('socket.io')(server);
        // On peut param des listeners, ATTENTION, IL FAUT PARAM LA CONNEXION COTE CLIENT AUSSI
        io.on('connection', socket => {
            console.log('Client connected');
        })

    })
```

### Côté client

* `yarn add socket.io-client` == __/!\ Ce n'est pas le même module !__
* Dans le main composant React :
```js
import openSocket from 'socket.io-client';
// Dans le composant, dans la méthode componentDidMount (à la fin), on initialise la connexion !
openSocket('urlDeMonServeurOuSeTrouveLeWebSocketCoteServeur');
```

## Partager une instance de IO entre les fichiers

* Côté back on crée un nouveau fichier socket.js
```js
let io;

// Grâce à ce module on peut importer Io dans n'importe quel fichier
module.exports = {
    init: httpServer => {
        require('socket.io')(httpServer);
        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!')
        }
        return io;
    }
}
```
* Dans app.js on change le require de socket io en remplaçant le module par le fichier et on appelle la méthode init à qui on passe notre serveur !!

## Synchroniser l'ajout de post

* dans le controller feed.js :
```js
// J'importe mon module perso avec ma connexion
const io = require('../socket');

// Dans la méthode createPost, une fois le post créé, juste avant d'envoyer la réponse :
// L'objet io contient pleins de méthodes,  emit pour envoyer un message à tous les utilisateurs connectés, broadcast tous les users sauf celui qui a envoyé la requête !
// Premier param: nom de l'action, deuxième les datas
io.getIo().emit('posts', { action: 'create', post: post });
// IL FAUT PARAM LA REACTION COTE CLIENT !!!
```

* Côté front, dans le main composant, dans componentDidMount :
```js
const socket = openSocket('urlServeur');
// Ecoute le serveur avec le nom de l'action (la clé) et traite les datas !
socket.on('posts', data => {
    // Si l'action côté serveur est une création, alors je lance la méthode qui permet d'ajouter un post !
    if (data.action === 'create') {
        this.addPost(data.post);
    }
});
```

## Mettre à jour un post pour tous les clients connectés

* Dans le controller feed.js :
```js
// Dans la méthode updatePost après avoir sauvé le post
io.getIo().emit('posts', { action: 'update', post: result });
```

* Côté front :
```js
// Crée une nouvelle méthode dans le main component
updatePost = post => {
    // iCI LE SETSTATE
}

// Ensuite dans le componentDidMount
socket.on('posts', data => {
    // Si l'action côté serveur est une création, alors je lance la méthode qui permet d'ajouter un post !
    if (data.action === 'create') {
        this.addPost(data.post);
    }
    else if (data.action === 'update') {
        this.updatedPost(data.post);
    }
```

* __/!\ Pour trier correctement__ :
    * Ajouter sort() dans la méthode getPosts() !