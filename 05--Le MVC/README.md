# Le MVC sous Node.js

## Ajouter les controller

* Créer un dossier controllers
* On retrouve la sectoriation des fonctions dans les controllers : un controller gère un type de vues (produits, cartes, etc.)
* Syntaxe du controller :
```js
exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
}
```

* Il faut ensuite importer la fonction dans le fichier route qui la gère :
* `const productsController = require('../controllers/products');` == Un bundle de toutes les fonctions du controller
* `router.get('/add-product', productsController.getAddProduct);` == On met la fonction getAddproduct du controller en callback de la route !

* Attention, si on utilise des datas dans les fonctions, il faut qu'elles soient dans le controller !
* __Attention de bien gérer les exports et require dans chaque fichier !__

### Gestion de la page 404

* On est-ce que je `render` la page ? Dans `app.js`
* Je veux le mettre dans un nouveau controller (error.js) :
```js
exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found'});
    });
}
```
* Ensuite importer le controller dans `app.js` et mettre la fonction `get404` en callback de la route `app.use(errorController.get404)` ;)

## Ajouter un model

* Créer un dossier `models`
* Un Model représente un type de donnée, un produit par exemple (il a une image, un nom, un prix, etc.) et non une liste de produits !

```js
const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this);
    }

    static fetchAll() {
        return products;
    }

}
```

* L'utilisation de static ici permet comme en PHP de se servir de la fonction en appelant la classe sans instancier d'objets.
* On retrouve le modèle de l'active record ici où le model gère les requêtes liées à la bdd (ici un simple tableau pour l'instant)

* `const Product = require('../models/product');` == Importe la classe, par convention on lui met une majuscule
* `const product = new Product(req.body.title);` __puis__ `product.save()` == On instancie un objet produit en lui donnant le nom donné dans le formulaire, on sauve ensuite ce nouveau produit dans le tableau de produits avec la fonction save()

* `const allProducts = Product.fetchAll();` == Va chercher directement dans la classe sans instancier d'objet tous les produits du tableau

## Stocker des données dans un fichier via le model

* On utilise plus la variable produit mais un fichier importé
* `const fs = require('fs');` == Require le module qui permet d'interagir avec les fichiers en local
* `const path = require('path');` == Require le module pour gérer les chemins

### Dans la fonction save()

* `const p = path.join(rootDir, 'data', 'products.json');` == le chemin vers le fichier
* `fs.readFile(p, (err, data) => {});` == On commence par lire le fichier et on file un callback :
```js
// Interieur du callback :
let products = [];
// Si le fichier existe et qu'il n'y a pas d'erreurs, alors products = le contenu du fichier
if (!err) {
    products = JSON.parse(data);
}
// Pousser la valeur du model dans le tableau
products.push(this);
// Ecrire le contenu du tableau dans le fichier
fi.writeFile(p, JSON.stringify(products), (err) => {console.log(err)});
```

* Dans la fonction `fetchAll()` on utilise readFile :
```js
fs.readFile(p, (err, data) => {
    if (err) {
        return [];
    } else {
        return JSON.parse(data);
    }
});
```

## Fetch data depuis le Model

* Etant donné que la fonction readFile s'exécute dans la fonction fetchAll, le code est lu de façon asynchrone et renvoi donc undefined.
* Pour palier au problème on rajoute un cb en param de la fonction findAll()

* __REVOIR LE COURS 98 & 99__