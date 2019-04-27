# Authentification avancée

## Reset les mots de passe

* Nécessite de nouvelles vues et de nouvelles routes (reset.pug)
* Dans le controller auth:
```js
exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};
```

## Implémenter la logique de Token

* Créer la méthode post pour le formulaire de reset:
```js
// Require crypto first:
const crypto = require('crypto');

exports.postReset = (req, res, next) => {
    // Génrère un buffer ou une erreur
    crypto.randomBytes(32, (err, buffer) => {
        // Si erreur je redirige
        if (err) {
            return res.redirect('/reset');
        }
        // Si ok, je génère le token depuis le buffer en le transformant en string
        const token = buffer.toString('hex');
        // On cherche s'il y a un user correspondant au mail entrée dans le formulaire
        User.findOne({ email: req.body.email })
            .then(user => {
                // Si non, je flash l'erreur et je redirige
                if (!user) {
                    req.flash('error', 'No account with this email');
                    return res.redirect('/reset');
                }
                // Si oui, j'ajoute le token au model et sa date d'expiration et je return le save
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                // Redirige vers la home
                res.redirect('/');
                // Envoi le mail avec le token dans l'URL
                transporter.sendMail({
                    to: req.body.email,
                    from: '...',
                    subject: '...',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                })
            })
            .catch(err => console.log(err));
    })
}
```
* __/!\ Il faut ajouter une propriété resetToken et resetTokenExpiration dans le Model user.js__
* __Ne pas oublier d'ajouter la route post pour le reset avec un token en partie variable__

## Le formulaire de changement d'email

* Créer une vue pour le formulaire et une méthode pour gérer la route dans auth.js
```js
exports.getNewPassword = (req, res, render) => {
    // Récupère le token définir dans la route et du coup l'URL
    const token = req.params.token;
    // Utilise mongoose pour aller chercher l'utilisateur correspondant au token et vérifie si la date courante n'est pas $gt (greater than) la date d'expiration !
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: ...,
                pageTitle: ...,
                errorMessage: message,
                // J'ajoute le userId à la vue
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => console.log(err));
}
```

* __Il faut ajouter un champ caché input avec le userId et un autre avec le passwordToken dans la vue__

## Ajouter la logique pour update le password

* Dans le controller auth.js (ne pas oublier de créer la route correspondante !):
```js
exports.postNewPassword = (req, res, next) => {
    // Récupère les données du formulaire
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    // Crée une variable resetUser pour gérer le passage de la donnée dans les promesses
    let resetUser;

    // Trouve un user correspondant au token et l'id du user
    User.findOne({resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now()}, _id: userId})
        .then(user => {
            // Attribue le user à la variable resetUser et retourne le pass crypté
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            // Attribue les nouvelles valeurs au Model et update
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            // Redirige
            res.redirect('/login');
        })
        .catch(err => console.log(err));
}
```

## Authorisation (gestion des droits)

* Restreindre les accès d'un utilisateur
* Dans la méthode getProducts on restreint la recherche à la bdd avec un filtre dans la méthode find() :
```js
// Dans la méthode on filtre les produits qui ont un userId égale au userId de la personne connectée
Product.find({userId: req.user._id})
```

* Il faut aussi protéger les requêtes en post (protéger les delete & edit)
* Dans la méthode postEditProduct du controller admin, il faut ajouter une condition qui permet de vérifier les droits de l'utilisateur courant :
```js
// Dans la méthode :
Product.findById(prodId)
    .then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        // Puis reste du block suivant en déplaçant le then suivant au return plutôt pour éviter qu'il soit exécuté quand même
    })
```

* Pour le delete cf admin.js file
* __/!\ A priori grosse possibilité d'amélioration !!!__