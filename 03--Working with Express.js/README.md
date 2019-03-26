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

## Parser les requêtes

* `res.redirect('/');` == Redirection vers une autre route
* `req.body` == Par défaut, la requête ne parse pas son body, il faut installer un module externe pour pouvoir utiliser `req.body`
    * `npm install --save body-parser` == Module externe qui permet de parse le body de la requête
    * `const bodyParser = require('body-parser');`
    * `app.use(bodyParser.urlencoded());` == Parse les body transmis via les formulaires

* `req.body` == renvoi un objet avec les données du body

## Limiter l'exécution d'un middleware à une méthode POST

* `app.get()` == app.use() pour les requêtes en GET
* `app.post()` == même chose pour les requêtes en POST

* __/!\ Deux routes avec le même chemin mais avec des méthodes différentes sont bien différentes et peuvent donc bien coexister !__

* `app.put()`, et les autres existent, c'est pour plus tard

## Utiliser le router Express

* Créer un dossier routes
* admin.js == Fichier qui gère les parties admin du site (les routes de modification de la bdd par exemple)
* shop.js == Fichier qui correspond à ce que l'user voit (l'accueil, la page produit, etc.)

* Require Express puis `const router = express.Router();` == Mini express app qu'on peut ensuite exporter
    * S'utilise ensuite de la même manière qu'app
    * `const adminRoutes = require('./routes/admin');` == importe le router qui gère les routes admins
        * `app.use(adminRoutes);` == utilisation de l'import

* L'utilisation de get et post rend possible le mélange de la hiérarchie des routes (le / n'a pas besoin d'être à la fin)

## Créer une route 404

* `app.use((req, res, next) => {res.status(404).send('Not found !')})` == `app.use` est de toute façon toujours traitée donc si la requête arrive jusqu'à cette méthode, ça veut dire que c'est une fausse route et donc une 404. A noter la façon de chainer les méthodes : il faut que `send()` soit en dernier !

## Filtrer les chemins

* Pour les routes, on peut créer un filtre en spécifiant que les routes allant vers tel router commencer forcément par /admin (par exemple), du coup, pas besoin de préciser le chemin complet dans la définition des routes, juste la partie variable
* Dans app.js :
    *  `app.use('/admin', adminRoutes);` == Toutes les routes admins commencent par /admin

## Créer et servir une page HTML

* Créer un dossier views (par convention)
* Y mettre des fichiers .
* `res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));` == Dans le callback de la route. `path.join` fonctionne sans les slashs
    * __/!\ Ne pas commencer le chemin par un `/` ! Le chemin doit être absolu et le / renvoi à la racine du système !!!__
    * `const path = require('path');` == Module externe pour les chemins !
    * __`__dirname` == chemin absolu du dossier sur la machine, du coup quelque soit l'OS, ça fonctionne__
        * __/!\ __dirname peut être au mauvais endroit dans le projet !__

## Utiliser une aide pour la navigation

* Créer un dossier util avec un fichier path.js (il n'y a pas de conflit avec le module externe car c'est pas le même require)

* require le module path
* `module.exports = path.dirname(process.mainModule.filename);` == Définit le chemin de base du projet
* `const rootDir = require('../util/path');` == require le module local 

* `res.sendFile(path.join(rootDir, 'views', 'shop.html'));` == __RESULTAT__

## Servir les fichiers statiques

* Créer un dossier public (Tous les dossiers sont par défaut inaccessibles comme le Deny de PHP), le dossier public est une exception car je veux pouvoir accéder à mes fichiers statiques
* Dossier CSS avec un fichier style.css
* __Il faut pouvoir servir les pages statiques (fournir les pages directement en lien avec le projet (css, js, img, etc.)__

* `app.use(express.static(path.join(__dirname, 'public')));` == Rend les fichiers et dossiers de public accessibles
    * __/!\ Express vient chercher directement dans le dossier public__
        * Lien pour le fichier css :`/css/style`
        
* On peut servir plusieurs dossier statiques !

