# Découverte de Node.js
_Notes du cours d'OpenClassRoom sur Node.js_

__/!\ Le début du contenu est en commentaire dans le fichier `server.js`__

## Recap rapide des commentaires
* Node.js est plus bas-niveau que les autres langages web (php et js côté client)
* Une application doit elle-même créer son serveur et gérer les réponses et requêtes (voir objet `http`)

## LES EVENTS

### Ecouter un événement sur Node

* Les objets (pas tous mais beaucoup) Node.js émettent des `events` qui héritents tous du `EventEmitter`.
* On écoute un event avec la méthode `on()` :
```
server.on('close', function() {
    code à executer
});
```
* La création d'un serveur avec cette syntaxe (le CB est automatiquement ajouté en param pour la méthode `createServer()`) :
```
var server = http.createServer(function(req, res) {

});
```
* est une contraction de :
```
var server = http.createServer();
server.on('request', function(req, res) { });
```

* __On peut écouter plusieurs fois un même `event`__

### Emettre un événement

* Il suffit d'inclure le module EventEmitter puis de 'l'instancier'
```
var EventEmitter = require('events').EventEmitter;

var jeu = new EventEmitter();
```
* `emit('eventName', 'options')` == méthode de l'`EventEmitter` pour émettre un event. Elle prend en param le nom de l'event et d'autres params facultatifs
* `jeu.on('eventName', function() {...})` == Ecouter l'event

## LES MODULES

### Un module ?

* Node possède une librairie restreinte en natif, les modules sont pleins d'extensions codés par Régis ou Jean-Michel et disponible sur NPM (gestionnaire de paquet de Node)
> https://www.npmjs.com/
* NPM doit-être installé sur la machine, la procédure est décrite sur le site.
* `npm search mysql` == On peut chercher un module en LDC
* Les modules NPM sont installés dans le dossier `node_modules`
* `npm update` == MAJ des modules
* __`package.json` == équivalent de composer.json en PHP, permet de gérer ses modules et de ne pas toujours les versionnés__
    * RTFM = syntaxe des numéros de version
    * `"monModule": "~0.3.5"` == Le `~` autorise la mise à jour du module si disponible, par défaut, ce n'est pas le cas

### Utiliser un module

* Il suffit de require son module pour l'utiliser, le `require` renvoi un objet contenant les méthodes du module
    * `var test = require('./module');` == Chemin vers module.js
    * `var test = require('test');` == Tous les fichiers sans chemin sont rangés dans le dossier `node_modules`
        * Si `node_modules` n'existe pas, Node va remonter l'arborescence jusqu'à trouver un fichier du même nom
        * `var monModule = require('monModule').moduleObjet` == Parfois la doc indique qu'il faut require un objet particulier du module

* `exports.monModule = monModule;` == Dans le fichier du module il faut systématiquement faire un `exports`
    * `exports.monModule = function() { ... };` == Syntaxe alternative
    * __Les fonctions non exportées resteront privées__

## EXPRESS.JS

### Le routing
* Micro-framework (oui, oui, il faut l'installer comme un module !) pour faciliter la création d'applications (notamment le router & la gestion des vues) :
```
// Require le framework
var express = require('express');

// Création de l'objet app
var app = express();

// Route vers la racine
app.get('/', function(req, res) {
    code à éxécuter
});

app.listen(8080);
```
* Terminer ses routes par la gestion de la page 404 :
```
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});
```
* /!\ Express permet de chaîner les appels en utilisant `.get()` :
```
app.get('/', function(req, res) {

})
// Url variable, numeroPokemon va dans req.params.numeroPokemon (On ne peut pas forcer le type de la donnée !)
.get('/pokemon/:numeroPokemon', function(req, res) {

})
```

### La gestion des vues

* Il existe pas mal de moteurs de templates (au final c'est un peu ce que fait PHP), c'est-à-dire écrire du HTML en pouvant intégrer du contenu variable
    * Twig (moteur de template utilisé aussi en PHP) // https://github.com/twigjs/twig.js/wiki
    * Haml (à l'air plutôt stylé, très dry) // http://haml.info/
    * Jade (un peu dans le même style mais apparemment encore plus dry :O) // http://jade-lang.com/
    * EJS (A l'air plus proche d'HTML, surement pas mal pour débuter) // https://www.ejs.co/

* Le code dans l'app transmets les variables à la vue dans la fonction `render` (équivalent de `show`) :
```
app.get('/etage/:etagenum/chambre', function(req, res) {
    res.render('home.ejs', {name: currentName});
});
```
* En EJS cela donne ça :
```
<h1>Salut <%= name %></h1>
```
* __/!\ Par défaut, Node va chercher les fichiers vues dans le le dossier `views` !__

### Le début de la folie : les MIDDLEWARES

> Doc == http://expressjs.com/en/guide/using-middleware.html
> Les Middlewares d'Express == http://expressjs.com/en/resources/middleware.html

* __Middlewares__ == Petits morceaux d'application spécialisées, micro-fonctionnalités
    * Ils communiquent entre eux en se passant maximum 4 params :
        * err == erreurs
        * req == requête du visiteur
        * res == réponse à envoyer
        * next == CB vers la fonction suivante
* Comme pour les routes, on peut les chainer et on utilise tout ça avec un petit `app.use()` :
```
var express = require('express');
var monMiddlewareDeLaMuerte = require('monMiddlewareDeLaMuerte');

var app = express();

app.use(monMiddlewareDeLaMuerte()) // Active le middleware

.use(express.static(__dirname + '/public')) // /public contient des fichiers statiques (middleware chargé de base)

.use(function(req, res){ // Réponse
    res.send('Salut les nazes');
});

app.listen(8080);
```

## SOCKET.IO

* Librairie qui permet de faciliter la mise en place d'outils de communication synchrone (un chat par exemple)
    * Se base sur plusieurs technos dont WebSocket (permet un échange bilatéral synchrone entre client et serveur)
    * Etant donné qu'il est basé sur plusieurs techno, il couvre un bon panel de navigateurs

### Set up

* socket.io doit gérer à la fois le fichier serveur (app.js par exemple) et client (index.ejs)

#### Côté serveur

* En plus du code qui permet de générer une page, il faut une fonction qui écoute la connexion en direct :
```
// Require socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, console.log
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});
```
* __Il y a donc deux connexions du client : une classique (HTTP) et une en temps réel (socket.io)

#### Côté client

* On charge le JS en fin de fichier pour ne pas bloquer le DOM
* `<script src="/socket.io/socket.io.js"></script>` == Le module `socket.io` fourni par le fichier `socket.io.js` (chemin automatique)

* Une fois le code de gestion de la communication fourni, on peut agir côté client pour communiquer avec le serveur :
```
// Connexion simple au serveur
var socket = io.connect('http://localhost:8080');
```

### Les échanges

* Il y a deux types d'échanges : le client veut causer au serveur et vice-versa

#### Serveur -> Client
```
// On event de connection
io.sockets.on('connection', function (socket) {
    // Emit('typeEmit', contenu en string ou objet)
    socket.emit('message', 'Vous êtes bien connecté !');
});
```
* Il faut paramétrer l'échange avec un listener côté client :
 ```
 <script>
    var socket = io.connect('http://localhost:8080');
    // On ('typeEvent', CB)
    socket.on('message', function(message) {
        alert('Coucou');
    })
</script>
```