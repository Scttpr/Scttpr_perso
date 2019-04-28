# Ajouter des moyens de paiement

> * https://stripe.com/docs

## Le processus

* Collecter les moyens de paiement (cb, paypal, etc.)
* Vérifier la méthode
* Charger les moyens de paiements
* Gérer ...
* Procéder au paiement dans l'application

* Stripe offre un service pour gérer le paiement

* Côté client on collecte les data de paiement et les envoi à Stripe
* Stripe renvoi ensuite un token envoyé côté serveur
* On effectue le paiement côté serveur qu'on envoi à Stripe qui gère en fait le paiment et renvoie une confirmation

## Ajouter une page de checkout

* Ajouter une vue, une route (get, auth) et une méthode dans le controller :
```js
exports.getCheckout = (req, res, next) => {
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      products.forEach(p => {
          total += p.qty * p.productId.price;
      })
      res.render('shop/checkout', {
        path: '/cart',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
```

## Utiliser Stripe

> * https://stripe.com/fr/
* Il faut créer un compte.

* /!\ En production il faut switch de testing data à live data
* Pour la vue : cf /views/shop/checkout.ejs
* Ceci crée un `pay with card` bouton qui ouvre une fenêtre modale géré par Stripe
* Copier le code fournit par Stripe dans le controllers/shop.js (cf fichier)
* __Ne pas oublier d'installer Stripe !__
* Stripe sécurise la fenêtre modale, on ne peut pas modifier son formulaire. Pour faire fonctionner l'ensemble il faut désactiver le csrf token des routes liées à Sripe en mettant le middleware qui gère le csrf après la route correspondante (cf app.js)