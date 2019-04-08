# Introduction à SQL

> * https://www.w3schools.com/sql/
> * https://github.com/sidorares/node-mysql2


## Connecter son application à une base de données SQL

* `npm install --save mysql2` == Dépendance mySQL

* Dans le dossier util > database.js :

```js
const mysql = require('mysql2');
```

* Il y a deux façons de se connecter à la bdd :
    - Une connexion qui se connecte à chaque query (assez inefficient)
    - Créer une connexion pool :
    ```js
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'dbName',
        password: 'myPass'
    })

    module.exports = pool.promise();
    ```
* Promises permet d'écrire du code plus structuré que les callbacks

* `const db = require('./utils/database');` == Require la connexion
* `db.end()`, `db.execute('SELECT * FROM products')` == Commandes pour fermer l'écoute sur le module ou pour faire des requêtes SQL

* Promise == Un objet qui permet de gérer du code asynchrone :
```js
db.execute('SELECT * FROM products')
    .then((result) => {
        console.log(result[0], result[1]);
    });
    .catch((err) => {
        console.log(err);
    });
```

* le résultat est un objet qui comprend deux objets

## Fetch des produits

* On travaille sur les Models
* Pas besoin de fs et de path dans le Model
* on garde la class Product
* On réinitialise toutes les méthodes
* On travaille avec des promises et non plus des cb

* __On require la db pour avoir accès au pool__

* Méthode fetchAll dans le Model:
```js
static fetchAll() {
    return db.execute('SELECT * FROM products');
}
```

* Dans le controller :
```js
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    // L'array permet d'extraire les éléments de l'array dès les params
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
}
```

## Ajouter des produits

* Dans le model :
```js
save() {
    // Les points d'interrogations sont une sécurité sur les injections SQL, le tableau en deuxième param remplace les points d'interrogation
    db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [this.title, this.price, this.imageUrl, this.description])
}
```

* Dans le controller :
```js
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product
        .save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
}
```

### Fetch un seul produit

* Dans le model :
```js 
static findById(id) {
    return db.execute('SELECT * FROM products WHERE product.id = ?', [id])
}
```

* Dans le controller :
```js
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product]) => {
            res.render('shop/product-detail', {
                product: product[0],
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}
```