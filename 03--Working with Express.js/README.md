# Travailler avec Express

## Express

* Mini-framework qui permet de simplifier la création du serveur et la gestion des requêtes/réponses
* Les alternatives à Express :
    * Vanilla Node.js == ça fonctionne !
    * Adonis.js == Inspiré par Laravel
    * Koa, Sails.js, etc.



### Installer Express

* `npm install --save express` == Une dépendance en local qui sera nécessaire même pendant le déploiement
* `const express = require('express');` == importer le module
* `const app = express();` == express export une fonction qui initialise un nouvel objet qui va gérer des éléments

## Les middlewares

* Les requêtes passent par une série de fonctions avant de renvoyer la réponse == ce sont __les middlewares__
* `app.use((req, res, next) => {});` == Permet d'ajouter un nouveau middleware, on lui passe une fonction qui sera exécutée pour toutes les requêtes entrantes
    * Le param `next` permet de passer d'un middleware à un autre sur la route de la requête vers la réponse

* `res.send('<h1>Hello</h1>');` == Permet d'envoyer une réponse plus simplement que via Vanilla, le typage se fait automatiquement par exemple, renvoyer la réponse signifie la fin du tunnel de middleware

* `app.listen` == permet de simplifier le lancement du serveur

## Les routes

* `app.use()` == Peut-être utilisé de plusieurs manières.
    * `app.use('/', (req, res, next) => {})` == Permet d'indiquer une route, si il y a un match, il y a un `send()` et donc coupe le script
* On doit hiérarchiser les middlewares de haut en bas pour ne pas générer de conflits