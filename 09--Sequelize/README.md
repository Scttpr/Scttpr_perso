# Sequelize

## Qu'est-ce que Sequelize

* C'est un ORM
* On ne travaille plus avec les requêtes écrites mais avec des objets js
* Sequelize fonctionne en active record

## Se connecter à la BDD

* `npm install --save sequelize` == Sequelize nécessite l'installation de mySql2
* Dans database.js :
```js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('dbName', 'username', 'pass', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;
```

## Les Models

* require sequelize
```js
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

// Maintenant on peut définir un Model, on supprime la classe et on utilise sequelize
const Product = sequelize.define('modelName', {
    id: {
        // Sequelize et pas sequelize !!!
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    // Si on veut juste un type
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

module.exports = Product;
```

## Sequelize peut créer des tables

* Dans app.js, on check si la table existe et si ce n'est pas le cas on la crée grâce à sync (si pas de table ça crée, sinon ça n'écrase pas !) :
```js
const sequelize = require('./utils/database');
sequelize.sync()
    .then(result) => {
        app.listen(3000);
    }
    .catch(err => console.log(err));
```

## Insérer des données 

* Dans le controller qui gère l'ajout de données, dans la méthode postAddProduct :
```js
Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
})
    .then(result => console.log('Created product'))
    .catch(err => console.log(err));
```

## Retrouver des données

* Dans le controller on veut récupérer un produit (par exemple)
* Sequelize intègre pleins de méthodes pour aller chercher des données, pas besoin de coder dans le Model
```js
exports.getIndex = (req, res, next) => {
    Product.findAll({
        where: xxx
    })
        .then(products => {
            res.render('route', {
                prods: products,
                pageTitle: 'Shop'
            })
        })
        .catch(err => console.log(err));
}
```

* Pour retrouver un seul produit :
```js
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('route', {
                prod: product,
                pageTitle: 'title'
            })
        })
        .catch(err => console.log(err));
}
```

## Update & delete datas

* Dans le controller :
```js
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product.findById(prodId)
        .then(product => {
            // Maj des données
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            // Save datas
            return product.save();
        })
        // Ici on return la sauvegarde et donc on récupère les erreurs des deux blocks dans le catch et ça évite d'intriquer trop de fonctions
        .then(result => {
            console.log('Updated product');
            res.redirect('/path/');

        })
        .catch(err => console.log(err));
}
```

* Ici on positionne le redirect dans la deuxième promesse pour éviter de redirect avant le traitement du cb

Dans le controller :

```js
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return product.destroy();
        })
        then(result => {
            console.log('prod destroyed');
            res.redirect('path');
        })
        .catch(err => console.log(err));
}
```

## Créer un model User

* Créer un fichier model User :
```js
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

// Maintenant on peut définir un Model, on supprime la classe et on utilise sequelize
const User = sequelize.define('user', {
    id: {
        // Sequelize et pas sequelize !!!
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    // Si on veut juste un type
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = User;
```

## Relationships

* Dans le front controller (app.js ici) :
```js
const Product = require('./models/product');
const User = require('./models/user');

// Before sync(), l'objet d'options == RTFM

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

// Suite à cela, sync() va créer les relations à la création de la table.
// Pour forcer la synchronisation malgré la création (les datas sont effacées) :
sequelize.sync({force: true})
```

### Créer et gérer un utilisateur

* Toujours dans le front controller :

```js
sequelize.sync()
    .then(result => {
        // Je check si j'ai au moins un utilisateur dans la BDD (ça me semble pas opti car si l'id 1 a été supprimé ça va déconner)
        return User.findById(1);
    })
    .then(user => {
        // Ici je dois return quelque chose
        if(!user) {
            return User.create({name: 'Max', email: 'test@test.fr'});
        }
        // Pas obligé mais plus propre pour la promise
        return Promise.resolve(user)
    })
    then(user => {
        console.log(user);
        app.listen(3000);
    })
    .catch(err => console.log(err))
```

* Pour accéder à mon utilisateur partout dans mon projet, il faut créer un nouveau middleware :
```js
// Vu que c'est un middleware, il est appelé que lors d'une requête, pas au lancement de l'app
app.use((req, res, next) => {
    user.findById(1)
        // On ajoute la propriété user à l'objet req, cela permet de se servir de cette propriété pour les requêtes
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});
```

### Les méthodes de relationships

* Dans le controller :
```js
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // Façon plus élégante, avec la méthode lié à la relation
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    });
    // Sinon manuellement mais moins beau
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     // On peut faire manuellement
    //     userId: req.user.id
    // })
    .then(result => {
        console.log('prod created');
        res.redirect('path');
    })
    .catch(err => console.log(err))
}
```

#### Fetch des produits liés à un user

* Dans le controller :

```js
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // Méthode pour aller chercher le produit lié au user
    req.user.getProducts({where: {id: prodId}})
        .then(products => {
            // Petite sécurité
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('path', {
                datasToView...
            })
        })
}
```

#### One to many - Many to many

* Créer le fichier model cart :
```js
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

// Ici on ne veut qu'un id pour la carte, les éléments produits seront trouvés grâce à la table User
const Cart = sequelize.define('cart', {
    id: {
        // Sequelize et pas sequelize !!!
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },   
});

module.exports = Cart;
```

* En plus du model cart, il faut créer une table cart-item.js (__La table pivot__):
```js
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

// Ici on ne veut qu'un id pour la carte, les éléments produits seront trouvés grâce à la table User
const CartItem = sequelize.define('cartItem', {
    id: {
        // Sequelize et pas sequelize !!!
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: Sequelize.INTEGER
});

module.exports = CartItem;
```

* __Ensuite dans le front controller on va ajouter les relationships__

```js
// Après avoir importé les différents fichiers plus haut
User.hasOne(Cart);
Cart.belongsTo(User);
// Relation many to many donc il faut préciser la table pivot
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
```

#### Créer et fetch une cart

* Il faut créer une carte dans le front controller également pour que chaque user ait sa carte (même vide) :

```js
// Dans la suite de promises de la méthode sync()
.then(user => {
    ....
}
.then(user => {
    return user.createCart();
})
.then(cart) => {
    app.listen(3000)
}
.catch(...)
```

* On veut utiliser une carte associée à un user, dans shop.js (le controller) :
```js
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            // Du coup on peut fetch les produits de la carte
            return cart.getProducts()
                .then(products => {
                    res.render('path', {
                        products, ...
                    })
                });
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
}
```



#### Ajouter des produits à la carte

* Dans le controller du shop :
```js
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQty = 1;

    req.user.getCart()
        .then(cart => {
            // Si c'est déjà dans la carte
            fetchedCart = cart
            return cart.getProducts({ where: { id: prodId }})
        })
        // Extract le bon produit
        .then(products => {
            let product;
            if(products.length > 0) {
                product = products[0];
            }
            if(product) {
                // Mon ancienne qty
                const oldQty = product.cartItem.qty;
                newQty = oldQty + 1
                return product;
            }
            return Products.findById(prodId);
            // Promises sur le return 
            .then(product => {
                // Sequelize permet d'ajouter un produit dans la relationship
                return fetchedCart.addProduct(product, { through: { qty: newQty } });
            })
            .catch(err => console.log(err))
        .then(() => {
            res.redirect('path');
        })
        })
        .catch(err => console.log(err))
    })
}
```

* Pour supprimer les produits dans la carte on suit la même logique

### Créer le model Order & clear la card

* On veut bouger tous les éléments de la carte pour s'enregistrer dans un Order

* order.js > Un Model de plus :)
     * Structure similaire à cart.js
     * Double relationships dans app.js (User > Order && Order > Product)

* Clear cart
    * `setProducts(null)`

* __`.getOrders({include: ['products']})` == pour fetch les produits résultant de la requête getOrders dans le cadre d'une table pivot (permet de transformer l'objet reçu en array__

