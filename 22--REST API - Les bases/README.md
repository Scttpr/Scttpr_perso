# REST API - Les bases

> * https://academind.com/learn/node-js/building-a-restful-api-with/

## Qu'est-ce qu'une API REST ? Et pourquoi l'utiliser ?

* REST API permet de résoudre un problème : Tous les interfaces ne veulent pas que le serveur génèrent les pages HTML, Ex :
    * Applications mobiles (utilisent des librairies spécifiques côté front et n'utilisent pas forcément du HTML), elle ne veulent que des datas
    * SPA (Single Page Application), comme le site Udemy == Une page qui ne se recharge pas et qui est géré uniquement côté client par JS, ce type d'applications n'interagit qu'avec des datas (avec des API)
    * Service APIs (Google Maps API par exemple), ces API veulent interagir avec une API REST côté back, encore une fois, que de la data

* Le front se retrouve séparé du back qui n'a pour simple fonction que de servir des données à la demande

* REST = Representational State Transfer == On transfère des données plutôt que des interfaces utilisateurs
* La requête et la réponse change mais la logique côté serveur reste la même !

## Accéder aux données avec une API REST

* Côté client on a une application mobile ou une SPA
* Côté serveur on a une API (qui peut fonctionner pour plusieurs clients), donc on peut créer deux applications (interface) avec les mêmes données !
* OU une application qui se sert d'un service API et c'est un peu plus particulier

* __Le lien entre le client et le serveur ? LES DATAS !!!__

* Type de datas :
    * HTML == `<p>Toto</p>`, ce code contient les données et la structure, contient donc l'UI // __PBLME ?__ Difficile à parser si on a juste besoin des données !
    * Plain Text == `Toto`, pure data, pas d'UI et difficile à parser <<< VRAIMENT PAS TOP !
    * XML == `<name>Toto</name>`, uniquement data, pas d'UI, lisible mais il faut un parser spécifique !
    * JSON == `{ "name": "Toto" }`, uniquement data, pas d'UI mais très concis et est très facilement convertible en JS!!! << __WINNER__

## Comprendre le routing et les méthodes HTTP

* Le routing :
    * Traditionnellement == On envoie une requête du client vers le serveur (avec un lien ou un formulaire par exemple)
        * Côté API == On envoie une requête avec méthode HTTP et suivant un chemin spécifique (AJAX, fetch, etc)
            * __Les endpoints sont la combinaison entre une méthode HTTP et leur chemin !__

* Les méthodes HTTP :
    * GET == Get une réponse (lecture)
    * POST == Post une ressource sur le serveur (créer ou ajouter)
    * PUT == Put une ressource sur le serveur (créer ou éditer/écraser)
    * PATCH == Mettre à jour des parties d'une ressource
    * DELETE == Supprimer une ressource
    * OPTIONS == "Determine whether follow-up Request is allowed (sent automatically)

* __/!\ Tout ceci est sémantique ! On peut supprimer avec une méthode POST mais ce n'est pas conventionnel__

## Les principes fondamentaux de l'API REST

* __Uniform interface principle__ == L'API doit avoir des endpoints clairement définis avec une structure de données requête-réponse également clairement définie c'est-à-dire bien documenté, logique et prédictible
* __Stateless interactions principle__ == Le serveur et le client sont totalement séparées, toutes les requêtes sont gérées de façon séparées, le serveur ne stocke rien pour le client (sessions, cookies, etc.).
* __Cacheable principle__ == Le serveur doit paramétré le cache des headers pour permettre au client de mettre les réponses en cache
* __Client-server principle__ == Le serveur et le client sont séparés, le client n'est pas concerné par le stockage de données
* __Layered System__ == Le serveur gère la redirection vers d'autres API au besoin, le client ne le fait pas
* __Code on demand__ == Le serveur peut ponctuellement transférer du code exécutable au client sur demande (très peu courant)

## Créer une API REST

* Créer un serveur Node (server.js ou app.js)
* Modules : Nodemon, Express, Body Parser
* Créer des routes avec le router express (dossier routes)
* Créer des controllers

### Envoyer une requête et répondre

* Dans le controller :
```js
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{ title: 'First Post', content:'tototototo' }]
    });
};
```

* Pour une route POST :
```js
// Il faut require body parser avant et le paramétré pour le json (dans server.js) :
app.use(bodyParser.json()); //application/json

exports.postPosts = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    // Il faudra créer le post dans la db
    res.status(201).json({
        message: 'Posts created successfully',
        post: { id: new Date().toISOString(), title: title, content: content }
    })
}
```

* Postman = Outil de développement pour API (entrer des requêtes, visualiser les réponses)

## Les erreurs CORS

* fetch API == méthode qui permet de faire des requêtes au serveur :
```js
fetch('http://localhost:8080/posts')
    .then(res => res.json())
    .then(resData => console.log(resData))
    .catch(err => console.log(err));
```

* Ce code génère une erreur CORS depuis CodePen
* CORS == Cross-Origin Resource Sharing (pas autorisé par les navigateurs) :
    * localhost:3000 pour client et serveur == pas de soucis
    * Si le client et le serveur sont sur des domaines différents, ça crée des erreurs CORS (On ne peut pas partager des ressources entre domaines)
* __LES ERREURS CORS PEUVENT ETRE UNIQUEMENT GEREES COTE SERVEUR__
    * Paramétré le header pour chaque requête :
    ```js
    app.use((req, res, next) => {
        // On autorise ici l'accès à toutes les URLs
        res.setHeader('Access-Control-Allow-Origin', '*');
        // On param aussi les méthodes HTTP
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        // Headers venant du client (on donne toujours les param en 2e param)
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    })
    ```

## Envoyer une requête POST

* Côté client encore avec fetch():
```js
fetch('monURL', {
    method: 'POST',
    // Il faut transformer la data
    body: JSON.stringify({
        title: 'Tata',
        content: 'Tatati tatata',
    }),
    // Il faut aussi paramétré le header
    headers: {
        'Content-type': 'application/json',
    },
})
    .then(res => res.json())
    .then(resData => console.log(resData))
    .catch(err => console.log(err));
```

* La requête OPTIONS est envoyée mécaniquement par le navigateur qui est une requête qui fonctionne pour vérifier que les options CORS sont bien autorisées (si la requête POST fonctionne, il y aura une requête OPTIONS juste avant)