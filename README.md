# Hello World

# ヾ(●ω●)ノ

## Objectif

* Afficher Hello World sur la vue de la page d'accueil d'un projet Node

## Packages & librairies

* Express (https://www.npmjs.com/package/express)
* Ejs (https://www.npmjs.com/package/ejs)

## Procédure

### Architecture

* Les node_modules sont l'équivalent du dossier `vendor` en PHP
```
.
├── node_modules
├── package-lock.json
├── README.md
├── server.js
└── views
    └── home.ejs
```
* Ici l'architecture est simple car il reste à comprendre l'interaction d'Express avec l'arborescence, notamment pour aller chercher les vues
* `server.js` est le super front controller, à dispatcher également avec la pratique

### `Server.js`

#### Express

> http://expressjs.com/fr/

Mini framework qui facilite la création d'une application en Node.js
* Il faut le require puis l'instancier dans une variable, la doc recommande de le faire dans des constantes
```js
const express = require('express');

const app = express();
```
* Express sert principalement au routing et à la création du serveur
* Ici on s'en sert pour paramétrer l'interaction avec le moteur de template EJS :
```js
app.set('view engine', 'ejs');
```
* Du coup plus besoin de spécifier l'extension des fichiers .ejs

* La route est unique dans ce mini exercice, elle mène à la racine sans action autre que de générer la vue `home.ejs` qui se situe dans le dossier `views`
```js
app.get('/', (req, res) => {
    // Va chercher la vue 'home' dans le dossier views et lui passe la variable text
    res.render('home', {text: text});
});
```
* __Note :__ Pour le test on lui passe une variable en deuxième param, on aurait pu lui mettre un callbacks en troisième param (pour renvoyer une erreur par exemple)
* __Note :__ Par défaut Express va chercher la vue dans le dossier `views`, à voir comment paramétrer ça pour plus de flexibilité

* On termine par lancer le serveur sur le port défini :
```js
app.listen(port, () => {
    console.log('app launched on port ' + port);
});
```

