# Construction d'une API REST complète

## Planifier son API

* La première étape est de faire la liste des endpoints

## Chapitre précédent suffisant pour la route get et post

## Ajouter de la validation côté serveur

* `express-validator` == cf cours sur la validation
* __Toujours valider les requêtes qui modifient la BDD__

## Créer le Model et l'utiliser

* `mongoose` == cf cours sur Mongoose
* `timestamps: true` == mongoose note le timestamp au moment de l'update (remplace le created-At et updated-At)

## Images statiques et erreurs

* Dans server.js :
```js
// Require path avant
app.use('/images', express.static(path.join(__dirname, 'images')));
```

* __Pour l'erreur cf cours sur les erreurs et fichier app.js de l'exemple__
* Pour charger les images, il faut réutiliser Multer (cf cours sur le down et upload)
    * Côté front, il ne faut pas un content-type application/json mais il faut se servir de la classe native FormData (cf file)

## update & delete post

* Utiliser les méthodes PUT & DELETE
* __cf documents & cours précédent__

## Comment fonctionne l'authentification

* Le client envoi ses data d'authentification au serveur
* Avant cette requête aurait amené à la creation d'une session, sur une REST API ce n'est pas possible !
* A la place on retourne un token qui aura des datas validées par le serveur, le token est stocké sur le client et ce token sera attaché à toutes les requêtes suivantes, celui-ci sera validé par le serveur à chaque requête
* Le token contient du JSON et une signature > JSON web token

* `jsonwebtoken` == module pour créer des JSON web tokens
* Dans la méthode signin :
```js
// Dans la méthode après avoir vérifié le mot de passe
const token = jwt.sign({
    email: loadedUser.email,
    userId: loadedUser._id.toString()
}, 'maStringSecret', { expiresIn: '1h' });
```

* Pour l'authentification et la validation du token sur toutes les requêtes : créer un middleware isAuth.js
* Côté front, il faut ajouter un header Authorization (header pour passer de l'auth au serveur)
    * headers: {
        Authorization: 'Bearer' + this.props.token
    }

* Dans le fichier du middleware :
```js
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // thow err
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'monSecret')
    } catch {
        // throw err
    }
    if (!decodedToken) {
        // throw err
    }
    req.userId = decodedToken.userId;
    next();
}
```

* Ajouter le middleware aux routes et passer le token depuis le front sur toutes les fetch (passer le token depuis le front)

## Authorization

* Dans le controller feed :
    * Ajouter une vérification sur le user connecté correspond au créateur
