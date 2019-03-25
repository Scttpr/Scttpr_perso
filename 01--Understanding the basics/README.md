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

### Parse le body des requêtes

* Il n'y a pas d'équivalent à req.url ou req.method pour les datas de la requête
* Cela est du au fait que les datas sont sous forme de flux
* STREAM > Request body part1 > request body part 2 > etc. > Fully parsed
* Buffer == permet de travailler avec le flux de data. Il s'agit d'un arrêt de bus, c'est un construct qui permet de faire patienter des bouts de code en attendant l'exécution d'un script, on travail donc avec des chunks de data

* _Exemple :_

* `const body = [];` == Le body de la requête qui est un array vide
* `req.on('data', (chunk) => {body.push();})` == On crée un listener, on push le chunk dans l'array du body
* `req.on('end', () => {const parsedBody = Buffer.concat(body).toString()})` == Il faut les buffers, pour créer des arrêts de bus, Buffer == busstop
* On retrouve dans le parsedBody le résultat d'un formulaire post par exemple, on peut l'utiliser :
    * `const message = parsedBody.split('=')[1];` == stocke le message dans une constante message

### Comprendre l'exécution du code des listeners

* __L'ordre du code ne se fait pas dans l'ordre dans lequel il est écrit__
* Les closures sont souvent asynchrones et s'exécutent plus tard
* Quand il rencontre un nouveau listener, Node ajoute à son registre le listener, quand un event arrive, que les conditions sont réunies, le code dans le callbacks s'exécute
* Cela prévient le comportement bloquant du code en faisant du non bloquant monothread

### Code bloquant et non bloquant

* `writeFileSync()` == Méthode synchrone, bloque l'exécution des lignes suivantes tant que l'action n'est pas effectuée
* Si on ne veut pas bloquer, il faut utiliser la version asynchrone (`writeFile()`) qui prend un callbacks en troisième param (qui reçoit un objet `err`) >>> Cela permet de renvoyer une réponse d'erreur ou ce qu'on veut

* Event driven architecture <<< Concept très important, structure des callbacks, etc. RTFM

### Single thread, event loop et le code bloquant

* Un seul thread (un seul process)
* On handle plusieurs requêtes grâce à l'event loop et le code non bloquant
* Event loop : automatiquement créée par Node au lancement de l'application
    * Elle gère les Event Callbacks == Elle exécute le code lié à un event quand l'event arrive
* Worker pool == Gère les opérations lourdes comme le fs en dehors de l'event loop, peut se lancer sur différents threads
    * Quand le worker a terminé il allume le callbacks lié à l'event et réintègre l'event loop

* Event loop dans le sens de la boucle
* Event loop = Comporte des timers (setTimeout, setInterval), check les autres callbacks qui sont en attente et qui s'exécutent quand l'action est terminée (Input ou Output). S'il y a trop de cb, la loop y reviendra à la boucle suivante
    * Poll, les nouveaux events en Input et Output, si ça s'exécute pas, cela devient un pending cb comme au dessus, ils peuvent être aussi exécuté tout de suite et placé dans les timers s'ils cmportent des timers
* Check == Execute les cb qui sont setimmediate()
* Close cb == execute les close events
* process.exit == uniquement s'il n'y a plus d'handlers enregistrés (dans un contexte de serveur, le serveur listener ne stoppe jamais, l'application ne quitte donc jamais l'event loop)

### Utiliser les modules Node

* Il faut séparer les bouts de code, par exemple en séparant la partie routing de l'application
* `routes.js` == copier coller la gestion des routes, on n'a plus besoin de require fs dans server.js
    * Il faut connecter les deux fichiers entre eux
    * On stocke les routes dans une constante qui est une fonction anonyme qui prend en param la req et la res
    * On export avec `module.exports = requestHandler;` à la fin d'un fichier OU `module.exports = {handler: requestHandler, someText: 'text'}` (après on accède au handler en faisant `routes.handler`) OU `module.exports.handler = requestHandler; module.exports.someText = 'tata';` (on peut utiliser le raccourci de cette dernière version en utilisant juste `exports`) __ETC__
        * On peut le require dans un autre fichier == `const routes = require('./routes');` (Node prend en compte le .js à la fin donc pas besoin, le chemin permet de stipuler que ce n'est pas un module global)
        * `const server = http.createServer(routes)` == Prend la méthode importée en callback, comme avant l'import au final
* __On ne peut pas manipuler le fichier importé, on peut juste lire l'import__
