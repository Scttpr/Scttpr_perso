# Routes dynamiques & Modèles avancés

## Ajouter un paramètre à la route

* `router.get('/product/:productId', callback)` == Mettre les routes avec des variables dynamiques à la fin des routes concernant le chemin spécifié (cette route sera définie après toutes les /product/etc.)

* `const prodId = req.params.productId;` == Express donne le param directement, on peut donc aller chercher les params directement via cette ligne (à récupérer dans le controller)

## Charger des données

* Méthode dans le model pour aller chercher le produit :
```js
static findById(is, cb) {
    getProductsFromFile(products => {
        const product = products.find(p => p.id === id)
        cb(product);
    })
}
```

* Pour utiliser dans la méthode getProduct du controller :
```js
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    });
}
```

### Charger la vue avec le produit détaillé

