# Comprendre la validation (gestion des inputs utilisateurs)

> * https://express-validator.github.io/docs/
> * https://github.com/chriso/validator.js

## Pourquoi utiliser la validation

* Les interactions via les inputs ne sont jamais fiables, il faut limiter au maximum les possibilités rentrées par les users pour avoir une meilleure correspondance entre les datas users et les datas en db (on peut rentrer une adresse mail inexistante)
* La validation est un middleware qui se lance dans la gestion des requêtes !

## Comment valider un input ?

* Entre l'input et le serveur :
    * On peut valider sur le client grâce à JS avec les events (c'est mieux pour l'UX mais ça reste optionnel)
    * Valider sur le serveur (le sujet du jour), obligatoire car le user ne peut pas jouer sur ce code, c'est plus sécurisé
    * Il y a aussi des built-in validation sur les bdd (optionnel aussi mais toujours mieux)
    * Toujours renvoyer un message d'erreurs aidant le user

## Installation & validation basique

* `express-validator` == Module pour gérer la validation
* On valide sur les routes en post ou le user envoi des données !
* Dans les routes d'auth puis le controller:
```js
// On utilise la syntaxe newGen pour récupérer seulement ce qui nous intéresse dans l'objet check
const { check } = require('express-validator/check');


```

* On peut ajouter les middlewares dans la route, ici on veut un middleware check dans les routes qui gèrent des inputs :
* On peut ajouter un message dans le middleware

```js
// La méthode check prend en param les champs à vérifier, elle retourne un objet sur lequel on peut faire des vérifications (ici un Email)
router.post('/singup', check('email').isEmail().withMessage('Please enter a valid email'), authController.postSignup);
```

* Dans le controller :
```js 
const { validationResult } = require('express-validator/check')

// Dans la méthode postSignUp, au départ juste en dessous des premières const déclarées
const errors = validationResult(req);
if (!errors.isEmpty()) {
    // Statut de la requête si erreur, puis on render la même page (getSignUp)
    return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        // On veut passer les erreurs sous la forme d'un array et plus particulièrement le message de sa première clé
        errorMessage: errors.array()[0].msg;
    });
}
```

## Customiser les validations

* Une liste de validator compris dans le module validator :
> * https://github.com/chriso/validator.js

* On peut nous même ajouter les notres et chainer de multiples validateurs :
```js
router.post(
    '/singup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        // Personnalise le message et l'envoi, doit return true si c'est ok
        .custom((value, {req}) => {
            if (value === 'test@test.com') {
                throw new Error('This email address is forbidden');
            }
            return true;
        }),
    // Pour ajouter un validateur, on peut le mettre dans un array mais ce n'est pas obligatoire
    // Ne pas oublier de require les validateurs qu'on veut
    // /!\ Si je veux envoyer un message d'erreurs par défaut pour toutes les validations, je peux passer ce message en deuxième param de la méthode body ou check
    body('password')
        .isLength({min: 5, max: 10})
        .isAlphanumeric(...),
        .isMessage('tata');
    authController.postSignup);
```

## Gérer l'équivalence de mot de passe

```js
router.post(
    '/singup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            if (value === 'test@test.com') {
                throw new Error('This email address is forbidden');
            }
            return true;
        }),
    body('password')
        .isLength({min: 5, max: 10})
        .isAlphanumeric(...),
        .isMessage('tata');
    body('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }),
    authController.postSignup
);
```

## Ajouter des validations async

* Pour gérer les validations de façon asynchrone il faut travailler le traitement dans le fichier des routes des auths
```js
// D'abord require le Model
const User = require('../models/user');

router.post(
    '/singup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            // La connexion à la bdd est asynchrone
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc => {
                        // Promise est un objet js qui permettra de d'enchainer avec un catch si besoin
                        return Promise.reject('mon message d\'erreur');
                    });
                });
        }),
    body('password')
        .isLength({min: 5, max: 10})
        .isAlphanumeric(...),
        .isMessage('tata');
    body('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }),
    authController.postSignup
);
```

### Conserver la valeur de l'input

* il suffit d'ajouter les inputs en data à passer à la vue dans les méthodes postSignUp, etc en cas d'erreurs

## Ajouter des classes CSS conditionnelles

* Si on veut passer une data pour faire en sorte que le champ ait une bordure rouge ou verte à la soumission, on peut gérer ça côté back
* On peut ajouter un array d'erreurs pour de validation d'erreurs à passer à la vue
* Ensuite côté Front, si on ajoute une classe dynamique en fonction de la data servie côté back:
```js
// Dans la  vue et dans la balise input du mail par exemple :
.#{validationErrors.find(current => current.param === 'email') ? 'invalid' : ''}
```
* Il suffit ensuite de traiter la classe en CSS

## Validation pour le log in

* On retrouve la même logique que précédemment, mais il y a en plus les erreurs de correspondance entre les password ou le mail (cf fichier auth.js)

## Nettoyer les données

* Les "sanitizers" == Trim, lowerCase, etc. Permet de stocker les données uniformément
* Ici on s'attarde sur le côté visuel plus que le côté sécurité (qui sera abordé plus tard)
* Dans les middlewares de validation dans les routes, il existe des méthodes pour nettoyer les données : .normalizeEmail(), .trim(), ...

### Valider l'addition de produit et l'édition de produit

* Le process est une fois encore le même, cf docs fournis (dans /routes/admin.js /controllers/admin.js, vues)
* __/!\ Sur le rechargement de la page d'édition il faut refournir l'id du produit !!__
