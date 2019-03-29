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

