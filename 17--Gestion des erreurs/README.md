# Gestion des erreurs

> * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
> * https://expressjs.com/en/guide/error-handling.html

## Les types d'erreurs

* Les erreurs techniques/ réseaux == On y peut pas toujours grand chose (MongoDB est fermé) Il faut signaler ces erreurs au user
* Les erreurs attendues == Le fichier ne peut pas être lu >> Il faut aussi informer le user et l'inviter à relancer l'app (rafraichir ou autre)
* Les bugs et erreurs de logiques == A réparer pendant le développement ! Pas de message au user car c'est notre faute !

* Les erreurs sont 'thrown' > Un object JS qui explicite l'erreur
    * Les outils pour tester :
        * Code synchrone : try-catch
        * Code asynhcrone : then-catch
        * Dans ce cas on peut directement géré cette erreur ou utilisé un module Express de gestion des erreurs !
* Pas d'erreur envoyée ?
    * Vérifier les valeurs/données
    * Décider si on throw l'erreur ou si on gère l'erreur directement

* Communiquer avec le user :
    * Error page : 500 (dernière chose à faire)
    * Renvoyer la même page avec les erreurs informées (pas mal !)
    * Rediriger avec un message d'information

* Dans le projet courant on utilise :
    * Le statut 402 avec un message d'erreur
    * Les middlewares de validations envoient des erreurs qu'on récupère et qu'on gère à la main
    * `throw new Error()` == Throw une erreur

## Un peu de théorie

* `throw new Error()` == géré par Express "behind the scenes", pour expliciter ce qu'il se passe on crée un fichier error-sandbox.js dans lequel on code :
```js
const sum = (a, b) => {
    // Si a et b existent alors ok
    if (a && b) {
        return a + b;
    }
    // Sinon je throw une erreur qui envoi 'Invalid arguments'
    throw new Error('Invalid arguments');
}

// Pour du code synchrone, on peut gérer les erreurs comme ceci (ce que fais Express avec le throw new Error behind the scenes):
try {
    console.log(sum(1))
} catch (error) {
    console.log('Error occured');
    // Ici je log mon erreur et ça revient au même que tout à l'heure.
    // Par contre je peux coder ce que je veux ici pour traiter l'erreur et l'application ne s'arrête pas !!
    console.log(error);
}

// Pour du code asynchrone :
// C'est juste du try catch asynchrone et on connait déjà son utilisation !
.then()
.catch()
```

* Cela renvoi un message d'erreur avec le message et le fichier où l'erreur apparait, ce message est une erreur non gérée >> L'application crash

## Envoyer des erreurs dans le code

* Dans app.js, la méthode User.findById ira dans le bloc catch() uniquement s'il y a des erreur techniques.
    * Si on veut gérer nous même des erreurs, où améliorer le système, on peut ajouter des conditions dans la méthode pour être sûr d'avoir un user
    * Dans le catch, il vaut mieux throw une erreur plutôt que de console.log car cela renvoi une erreur réelle et non plus une information. Express nous aide ensuite à régler cette erreur de façon plus efficace (on pourrait aussi juste utilisé next() mais on veut l'info de l'erreur !)

* Pour renvoyer des pages d'erreurs : dans le catch on peut render la page avec une erreur de statut 500 en ajustant les messages d'erreurs, on peut également renvoyer vers une nouvelle route avec une vue spécifique

## utiliser le middleware de gestion des erreurs Express

* Le problème de le faire à la main dans les catch blocks, ça fait beaucoup de répétitions de codes
    * Au lieu de rediriger, ou renvoyer une page, on utilise l'outil Express : `throw error` :
    ```js
    // Dans le catch block je crée un objet error
    const error = new Error(err);
    // On ajoute le statut en cas de render et non de redirection, c'est toujours mieux
    error.httpStatusCode = 500;
    // Si on utilise next avec un objet erreur en param, Express le reconnait et saute tous les autres middlewares et exécute le code d'un middleware qui gère les erreurs
    return next(error);
    ```

    * Dans app.js on code le middleware qui gère les erreurs :
    ```js
    // Tout à la fin du fichier après la gestion de la 404, on ajoute un middleware un peu spécial
    // 4 args avec une error en premier, Express reconnait que ce middleware est celui de la gestion des erreurs ! Il atterit donc ici en cas de next(error) !!!
    // Si il y en a plusieurs, Express va les exécuter de haut en bas !
    app.use((error, req, res, next) => {
        res.redirect('/500');
    })
    ```

* /!\ A l'intérieur d'une promesse, d'un cb, etc. (code asynchrone), il faut faire attention car le throw error ne fonctionne il faut pour cela utiliser : `next(new Error(err));`

## Les statuts HTTP

* Ils servent au navigateur pour savoir si les échanges HTTP se passent bien et précisent les erreurs
* 2xx == Succès
    * 200 == nickel
    * 201 == Nickel, ressource créée
* 3xx == Redirection
    * 301 == Déplacé de façon permanente
* 4xx == Error côté client
    * 401 == Pas authentifié
    * 403 == Pas autorisé
    * 404 == Pas trouvé
    * 422 == Input non valide
* 5xx == Error côté serveur
    * 500 == Error côté serveur

* __Toujours dans le soucis de données des bonnes infos au navigateur on précise toujours le statut dans la réponse !__