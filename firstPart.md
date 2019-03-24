# UDEMY - LEARN NODE JS

## Introduction

NodeJS - The complete Guide, dispensé par Maximilian Schwarzmüller sur la plateforme Udemy. Les notes de cours qui suivent vont de pairs avec les documents attenants qui sont des exercices d'application proposés tout au long du cours. En tant que notes provenant d'un apprenant (coucou), le contenu de ce fichier peut comporter des erreurs de compréhension. Par ailleurs, étant donné que le cours est en anglais, il s'agit d'une traduction _'in my own words'_, méfiance donc.

En ce qui concerne le contenu, je vous laisse explorer l'arborescence de ce README, je saute volontairement la partie d'introduction et la partie optionnelle de révision générale sur JS Vanilla. Pour les personnes les moins à l'aise avec JavaScript, je vous invite à consulter les liens ressources proposés par Maximilian listés ci-dessous.

### Ressources

### Node JS ?

C'est JS sorti de l'environnement du navigateur : sur serveur ou n'importe où ailleurs (on peut faire des applications Desktop avec Node). Cette évolution est permise grâce au passage en Open Source du moteur V8 de Google, Node est principalement codé en C et C++. Etant donné qu'il ne s'exécute pas dans le navigateur, il ne permet pas de manipuler le DOM. Toutefois, il conserve la gestion asynchrone propre aux events JS.

### Installer Node

> nodejs.org

* Installable sur tous les OS
* `node -v` == version installée

> On peut installer material icon theme

## LES BASES

### Comment le web fonctionne

* Client > URL > domain lookup > REQUETE vers un IP > Le code côté serveur pour gérer la requête (ici on peut interagir avec la bdd) > Renvoi la REPONSE en HTML, JSON ou XML (possède aussi un header)
* Requête/réponse fonctionne via le protocole HTTP/HTTPS (les règles d'envoi et de réponse)

### Créer un serveur Node Js

* `server.js` // `app.js` == Par convention, le nom du fichier qui gère l'application
* Node fonctionne avec des modules externes, que ce soit des paquets natifs ou non, il faut les importer pour les utiliser dans un projet.
* Les core modules de Node sont :
    * `http/https` == module de création de serveur et d'outils pour gérer les requêtes et réponses HTTP
    * `fs` == module d'interaction avec le système de fichier local
    * `os` == information sur le système d'exploitation __(RTFM davantage)__
    * `path` == __RTFM__

* `const http = require('http');` == Importer le module HTTP dans le projet via require. 
    * Le require est toujours disponible sur Node et permet d'importer un fichier en renseignant son chemin (commence toujours par `/` ou `./`) mais également un module global en renseignant son nom (comme http)

* `http.createServer(reqListener);` == méthode pour créer un serveur HTTP depuis le module http de node qui prend en param un listener à la requête (méthode qui se lance donc à chaque requête HTTP)
    * `http.createServer(function (req, res) {});` == syntaxe avec fonction anonyme
    * `http.createServer((req, res) => {});` == syntaxe avec fonction flèche

* Pour accéder au serveur, il faut stocker la méthode createServer dans une constante (`const server` par exemple) pour ensuite s'en servir car elle comprend elle-même des méthodes.
* `server.listen()`== Node écoute des requêtes potentielles et prend en param le port, le hostname, etc. (En dev on peut utiliser le port 3000)
* Maintenant en lançant le fichier dans le terminal `node server.js`, cela crée une boucle qui écoute les requêtes sur le port 3000 >> Vous avez créé votre serveur Node js.

### Cycle de vie & event loop

* Cycle de vie d'une application Node == node server.js > script du fichier (parse, variables, fonctions, etc.) --- /!\ On ne quitte pas l'application mais on rentre dans l'event loop
* Event loop == Boucle qui tourne tant que des listeners sont enregistrés (dans notre cas du set-up du serveur, createServer n'est pas stoppée et continue d'écouter).
* Le code est donc géré à l'intérieur de l'event loop car Node étant singlethread, il ne peut pas gérer plusieurs exécutions en même temps, l'event loop permettent de gérés une structure complexe grâce à l'asynchrone. __RTFM__
* `process.exit` == Exécute la fin de l'event loop (ce qu'on ne veut pas faire pour une page web mais important de comprendre le fonctionnement de Node Js)

* __Pour stopper l'exécution du serveur Node, on peut également ctrl + C dans le terminal ou le programme s'exécute.__

### Comprendre les requêtes

* `req` == Objet complexe de la requête
* Accéder à des informations sur la requête :
    * `req.headers` == header qui comprend :
        * Hostname
        * Quelle réponse on veut
        * Les cookies
        * Quel navigateur a émis la requête, etc.
    * `req.url` == URL
    * `req.method` == Méthode HTTP utilisée pour la requête (get, post, etc.)

### Comprendre la réponse

* `res`== Objet de la réponse qui comprend également ses méthodes
* `res.setHeader('Content-Type', 'text/html');` == Permet de paramétrer le header de la réponse (ici le type de données).
* `res.write('<h1>Hello World !</h1>');` == Permet d'écrire des données dans la réponse
* __`res.end()` == Obligatoire, permet de spécifier à Node que la réponse est terminée (on ne peut plus modifier la réponse après cette méthode)__

### Requêtes et routes

* `const url = req.url;` == Permet de parse l'URL de la requête
* Ensuite je veux vérifier le contenu de cet URL, le parser
    * `if (url === '/') {}` Si l'URL ne contient qu'un `/`, alors je renvoi une réponse qui correspond à cette route (via `res.write()`). Dans le `if`, terminer par un `return res.end()` pour couper l'exécution du script si il y a un match.

### Redirection

* `const method = req.method;` == Parse la méthode HTTP
* A la soumission du formulaire, on veut rediriger l'utilisateur sur l'accueil `/` et stocker le message dans un autre fichier
* `const fs = require('fs');` == require au début du fichier le module `fs`
* `fs.writeFile('message.txt', 'content');` == permet de créer un nouveau fichier message.txt
* `res.statusCode = 302` == Statut de la réponse après redirection
* `res.setHeader('Location', '/')` == Modification de la direction dans le header
