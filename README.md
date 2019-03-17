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
* /!\ Express permet de chaîner les appels en utilisant `.get()` dans le `app` :
```
app.get('/', function(req, res) {

})
// Url variable, numeroPokemon va dans req.params.numeroPokemon (On ne peut pas forcer le type de la donnée !)
.get('/pokemon/:numeroPokemon', function(req, res) {

})
```