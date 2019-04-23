# Sessions & cookies

> * https://www.quora.com/What-is-a-session-in-a-Web-Application
> * https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
> * https://github.com/expressjs/session

## Qu'est-ce qu'un cookie ?

* On peut envoyer une donnée en réponse qui pourra être utilisée ensuite dans les prochaines réponses, un cookie

## L'état actuel du projet

* On ajoute la possibilité de ce login et d'avoir un utilisateur connecté au site
* On crée un fichier de routes pour l'authentification + un controller et on modifie/crée les views en conséquence

## Ajouter "the request driven login solution"

* On sert du formulaire d'authentification pour travailler sur les cookies
* Au moment de lu login on stocke une variable booléenne dans la req pour confirmer et conserver l'authentification, on ajoute cette variable à toutes les views affichées pour ne pas avoir d'erreurs == ça ne marche pas car à la fin de la requête, la donnée disparait !

## Paramétrer un cookie

* Dans le controller auth.js :
```js
exports.postLogin = (req, res, next) => {
    // On param le header pour param le cookie
    // Le 1er param est le nom du header pour les cookies, le second est la donnée
    // On peut ajouter plusieurs caractéristiques ;Max-Age par exemple, Expires aussi, Domains, Secure (uniquement si HTTPS), HttpOnly, etc.
    res.setHeader('set-cookie', 'loggedIn=true; Secure');
    res.redirect('/');
}
```

* __/!\ Les cookies sont très peu sécurisés, les sessions sont plus adaptés pour les authentification__

## Qu'est-ce qu'une session ?

* C'est un cookie qu'on va stocker côté serveur (en gros), une donnée qui sera partagé pour la session courante de l'utilisateur
* Le client doit pouvoir se lier avec la session : pour cela il utilise un cookie qui possède l'id (hashed) de la session

## Le middleware Session

* `npm install --save express-session`
* `const session = require('express-session');` == on initialise la session dans le front-controller
* `app.use(session({ secret: 'my scret', resave: false, saveUnintialized: false }))` == Param la session

## utilisation de Session

* Dans le controller d'auth:
```js
exports.postLogin = (req, res, next) => {
    // La propriété session est fournie par express-session
    req.session.isLoggedIn = true;
}
```

## Utilisation de session avec MongoDB

* Les sessions mobilisent de la mémoire, donc on stocke les infos en BDD
* `npm install --save connect-mongodb-session` == module de gestion de stockage de session
* Dans le front controller :
```js
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'uri de connexion MongoDB',
    collection: 'sessions'
});

app.use(session({ 
    secret: 'my secret', 
    resave: false, 
    saveUnintialized: false,
    store: store
}));
```

## Supprimer un cookie

* Créer une formulaire et des routes pour le logout
* `req.session.destroy(() => res.redirect('/'));` == Détruit la session courante
* Le cookie de la session existe toujours et sera overwrite à la prochaien correction, il n'a plus de match côté serveur

* __/!\ param le front pour afficher uniquement si les variables existent (log in, log out, add to cart, etc.)__