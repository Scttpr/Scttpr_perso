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
