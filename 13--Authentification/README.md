# Authentification

## Qu'est-ce que l'authentification ?

* Permet de gérer les droits d'utilisation sur le site et de créer des groupes d'utilisateurs
* Un utilisateur se connecte, si tout est ok au niveau des id, on crée une session pour le user, if signed is, alors on accède au contenu protégé

## Mettre en place l'authentification

### Le signup

* Après avoir créé le formulaire et les routes
* __/!\ Il faut encrypter le password !__
    * `npm install --save bcryptjs` == Require le bcrypt dans le controller auth

* Dans le controller auth.js:
```js
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    ...
    // ici on ajoutera la validation plus tard
    // On veut savoir si le user existe déjà (on peut par exemple faire en sorte que les emails soient uniques), on peut aussi trouver un utilisateur avec cet email
    User.findOne({ email: email });
        .then(user => {
            // Si le user existe je redirect
            if(user) {
                return res.redirect('/signup');
            }
            // Encryptage du password
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                // Sinon, je crée un nouveau user
                const user = new User({
                    email: email,
                    password: password,
                    ...
                });
                return user.save();
                })
                .then(result => {
                    res.redirect('/');
                })
        })
        .catch(err => console.log(err));
}
```

### Le signin

* Dans le controller auth.js:

```js
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            // Si le user n'existe pas je redirige
            if(!user) {
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password);
                .then(result => {
                    // On arrive ici si le password est true ou false, ce n'est pas une erreur
                    if(result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err));
                            res.redirect('/');
                    }
                    res.redirect('/login');
                })
                .catch(err => res.redirect('/login'));
        })
}
```

* Ensuite je protège les routes en ajoutant la condition if(!req.session.isLoggedIn) alors interdiction et redirection

## Protéger les routes via un middleware

* La protection précédente est pas ouf, il vaut mieux créer son propre middleware

* On crée un dossier middleware dans le projet et on crée un fichier is-auth.js qui comprend une fonction:
```js
module.exports = (req, res, next) => {
    if(!req.session;isloggedIn) {
        return res.redirect('/login');
    }
    next();
}
```

* Dans le dossier routes.js on peut ajouter le middleware: 
```js
const isAuth = require('../middleware/is-auth');
// Ensuite dans une route on donne en param le middleware
// La fonction n'ira pas faire un next si on n'est pas authentifié
router.get('/nomRoute', isAuth, controller.methodHandler);
```

## Attaques CSRF

* Cross-Site Request Forgery == Hack en abusant des sessions
    * Le user est redirigé vers un faux site sur lequel il peut y avoir un lien qui renvoi vers la vraie page et qui envoi des requêtes
    * On veut garantir que la session soit utilisable uniquement depuis nos views, graĉe au CSRF token

### Se protéger grâce au token

* `npm install --save csurf` == module pour utiliser le token
* Dans le frontcontroller :
```js
const csrf = require('csurf');

// Plus loin, on param la protection, on peut lui filer des options
const cdrfProtection = csrf();

// Après avoir initialisé la session :
app.use(csrfProtection);
```

* Pour toutes les request en post, le module recherche un token CSRF dans la view, il faut donc d'abord le rendre disponible dans les views concernées via la méthode render : `csrfToken: req.csrfToken()`
    * Ensuite on ajoute un input hidden avec la value du token et le name '_csrf' __(Important car le module va chercher ce nom !)__

* __/!\ Pour rendre ça plus efficace et ne pas avoir à charger cela dans toutes les méthodes render__
    * On dit à Express qu'il faut telle data dans toutes les vues sous la forme d'un middleware :
    ```js
    app.use((req, res, next) => {
        // locals sont natifs en js
        res.locals.csrfToken = req.csrfToken();
        next();
    })
    ```

## Donner un feedback à l'utilisateur

* Lors des redirection, il faut donner des feedbacks au user
* On peut utiliser la session, mais c'est embêtant de l'avoir en permanence, je veux le rendre flash, les flash messages
* `npm install --save connect-flash` == Module pour les messages flash en session :
```js
// Dans le front controller
const flash = require('connect-flash');

// A mettre après la session
app.use(flash());
```

Dans le controller auth:
```js
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            // Si le user n'existe pas je redirige
            if(!user) {
                // Premier param, le nom du message et en deux le message
                req.flash('error', 'message');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password);
                .then(result => {
                    // On arrive ici si le password est true ou false, ce n'est pas une erreur
                    if(result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/');
                    }
                    res.redirect('/login');
                })
                .catch(err => res.redirect('/login'));
        })
}
```

* `errorMessage: req.flash('error')` == Dans la méthode render en data pour la vue et traitement dans la vue
* __/!\ la méthode renvoie un array vide, donc dans le render, on veut juste avant ajouter une vérification sur le contenu de la variable, si le message est vide, on le transforme en variable null__