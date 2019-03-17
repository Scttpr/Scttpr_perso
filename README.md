# Découverte de Node.js
_Notes du cours d'OpenClassRoom sur Node.js_

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