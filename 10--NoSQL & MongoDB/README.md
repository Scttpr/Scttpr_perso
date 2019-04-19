# NoSQL & MongoDB

> * MongoDB Official Docs: https://docs.mongodb.com/manual/core/security-encryption-at-rest/https://docs.mongodb.com/manual/
> * SQL vs NoSQL: https://academind.com/learn/web-dev/sql-vs-nosql/
> * Learn more about MongoDB: https://academind.com/learn/mongodb

## What is MongoDB

* Nom de l'entreprise et de son produit le plus connu : un moteur de BDD
* Construit pour de grosses BDD (rapide)

## Comment ça marche

* On a une base de données qui contient des collections qui comprennent elles des documents
* __MongoDB est schemaLess, pas besoin d'avoir la même structure__
* Plus flexible et scalable

* Utilise du JSON pour stocker des données (Ou plutôt BSON, binary Json qui est en fait transformé par MongoDB directement)
* Proche d'un objet en js, on peut stocker des arrays aussi

## Les relations en NoSQL

* Les datas sont dupliquées entre les documents de différentes collections au besoin
    * Embedded documents on inclus la data dans le document
* On peut aussi faire des références :
    * References : on link les document entre eux (RTFM)

* On peut faire des relations mais on est pas obligé (et en faire beaucoup rend les requêtes plus lentes)

## Installer MongoDB

> * https://www.mongodb.com/

* Créer et paramétrer un cluster

### Pour installer en local :

* `npm install --save mongodb`
* Dans le fichier database :

```js
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (cb) => {
    // Bien modifier le user et le pass dans la string
    MongoClient.connect('urlServieDansParAtlas')
        .then(client => {
            console.log('Connected');
            db = client.db();
            cb();
        } 
        .catch(err => {
            console.log(err);
            throw err;
        });
}

// Permet d'exécuter la connexion si il y a une requête
const getDb = () => {
    if(db) {
        return db;
    }
    throw 'No db found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

```

* Ensuite dans le fichier du front controller :
```js
// En début de fichier
const mongoConnect = require('./utils/database').mongoConnect;

// En fin de fichier
mongoConnect(() => {
    app.listen(3000)
})
```

### Modification des Model

* Par exemple product :
```js
const getDb = require('./utils/database').getDb;

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        // Nom de la collection avec laquelle je bosse
        db.collection('products')
            .insertOne(this)
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }
}
```

### Ajouter un produit

* Dans le controller :
```js
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl)
    product.save()
        .then(result => {
            // console.log(result);
            console.log('Created Product');
            res.redirect('/admin/products');
        });
        .catch(err => {
            console.log(err);
        });
};
```
* Les id sont gérés par MongoDB

### L'outil compass

* Une application pour avoir un interface graphique avec MongoDB

### Fetch tous les produits

* Dans le model de produit :
```js
static fetchAll() {
    const db = getDb();
    // Appeler find return tous les produits par défaut
    // On stocke tout ça dans un array js
    return db.collection('products').find()
        .toArray()
        .then(products => {
            return products
        })
        .catch(err => console.log(err));
}
```

* Dans le controller, la méthode getProducts() :
```js
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};
```

### Fetch un seul produit

* Dans le model :
```js
// En dehors de la class on require mongoDb pour convertir les id
const mongodb = require('mongodb');

// A l'intérieur de la class product on écrit la méthode findById
static findById(prodId) {
    const db = getDb();
    // Avec un objet en param, MongoDB utilise un filtre, renvoi quand même un cursor
    // MongoDB utilise _id /!\
    // On ne peut pas donner une string à manger dans la requête, il faut appeler une class de mongodb pour convertir tout ça
    // findOne ne renvoi pas de cursor par contre
    return db.collection('products').find({ _id: new mongodb.objectId(prodId) })
        .next()
        .then(product => {
            return product;
        })
        .catch(err => console.log(err));
}
```

* Dans le controller :
```js
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};
```

### Edit & Delete les produits

* Dans le controller :
```js
//  NE PAS OUBLIER DE REQUIRE mongodb et de créer une constante qui comprend le prodId de l'objet


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .getProducts({ where: { id: prodId } })
    // Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    
    const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, new ObjectId(prodId))
    product.save()
        .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};
```

* Dans le Model :

```js
// Dans le constructor de la class, on ajoute un argument optionnel (l'id)
constructor(title, price, description, imageUrl, id) {
    this.title = title;
    ...
    this._id = id;
}

// On édite la méthode save pour éditer si le produit a un id, sinon on le crée
save() {
    const db = getDb();
    let dbOp;
    if(this._id) {
        // On peut update one ou update many
        // Le premier param d'update one est un filtre en objet js
        // Le second est la méthode de sauvagarde dans la BDD, update ne remplace pas, il faut utiliser la clé $set
        dbOp = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
        dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
        .then(result => console.log(result))
        .catch(err => console.log(err))
}
```
* /!\ C'est mieux de convertir l'id en object Id dans le constructeur du Model, pas besoin de require MongoDB dans le controller

* Pour supprimer il y a plusieurs méthodes mais on va choisir la méthode static dans le Model

```js
static deleteById(prodId) {
    const db = getDb();
    // On peut utiliser deleteMany ou deleteOne
    return db.collection('collectionName').deleteOne({ _id: new mongodb.ObjectId(prodId) })
        .then(result => console.log('deleted'))
        .catch(err => console.log(err))
}
```

* Dans le controller :

```js
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
```

* /!\ Utiliser une condition au moment du stockage de l'id dans le Model pour faire fonctionner la condition dans la méthode save :
```js
this._id = id ? new mongodb.ObjectId(id) : null;
```

### Les relations

* Dans l'exemple on va travailler sur les cart et les order du projet

* Pour chaque user on veut stocker une cart
  * La cart contiendra les produits
  * Une relation one to one entre user & carte
    * On a donc pas besoin du model cart du coup avec MongoDB
    * Ni des tables pivots order-item.js et du model order.js

* Dans le Model User :
```js
// Dans le constructeur de la classe User, il faut le nom, le mail et AUSSI LA CART qui sera un objet contenant un array de produits

// On ajoute la méthode addToCart au Model
addToCart(product) {
  // Est-ce que le produit est déjà dans la carte > oui j'augmente la qty, sinon je l'ajoute
  // 
  const cartProductIndex = this.cart.items.findIndex(cp => {
    // On compare en s'assurant que les deux sont des strings, on pourrait utiliser aussi le ==
    return cp._productId.toString() === product._id.toString()
  });
  let newQty = 1;
  const updatedCartItems = [...this.cart.items];

  if(cartProductIndex >= 0) {
    // Si il y a déjà le produit dans la carte, on ajoute un à sa qty
    newQty = this.cart.items[cartProductIndex].qty +1;
    updatedCartItems[cartProductIndex.qty] = newQty
  } else {
    updatedCartItems.push({ productId: new ObjectId(product._id), qty: newQty })
  }
  // On crée un nouveau tableau avec tous les items contenus dans la cart grâce au spread operator
  updatedCartItems
  const updatedCart = {
    // On veut stocker uniquement l'id du produit et sa quantité
    items: updatedCartItems
  };
  const db = getDb();
  // Update product
  return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
}
```

* Pour créer un user dans l'app, il faut instancier la class du Model avec les datas de la BDD dans le constructeur

* Dans le controlleur :
```js
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('path'));
    })
    .catch(err => console.log(err));
};
```

#### Afficher les éléments de la cart

* Dans le model de l'utilisateur :
```js
// Pas besoin de grand chose pour récupérer la carte :!!!!
getCart() {
  const db = getDb();
  // On récupère un array de string depuis un array qui contient les objets produits de la cart
  const productIds = this.cart.items.map(i => {
    return i.productId;
  })
  // On va chercher dans la collection products et on utilise l'opérateur $in qui prend en param un array d'id
  return db.collection('products').find({ _id: { $in: productsIds } })
    .toArray()
    .then(products => {
      // On a tous les produits, on veut y rajouter toutes les qty via la méthode map
      return products.map(p => {
        // Spread operator pour rajouter la qty grâce à la méthode find sur les items de la carte du model courant.
        return {...p, qty: this.cart.items.find(i => {
          return i.productId.toString() === p._id.toString();
        }).qty
      };
      })
    });
}
```

* Dans le controller :
```js
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};
```

#### Supprimer un élément de la carte

* Dans le Model :

```js
// Nouvelle méthode
deleteItemFromCart(productId) {
  // filter() est une méthode native qui permet de filter...
  const updatedCartItems = this.cart.items.filter(item => {
    // Return true si je veux garder et false si je ne veux pas (ce sera faux si c'est l'item que je veux supprimer, donc qui est égal à l'id donné)
    return item.productId.toString() !== productId.toString();
  });
  const db = getDb();
  return db.collection('users').updateOne(
    { id: new ObjectId(this._id) },
    { $set: { cart: { items: updatedCartItems } } }
  )
}
```

* Dans controller :

```js
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
```

#### Ajouter une order

* Toujours dans le model User :
```js
// Il y a deux solutions, soit créer une collection d'order ou ajouter les orders à la collection user, ici on choisit la première
addOrder() {
  const db = getDb();
  // On veut avoir la carte et l'id du user, on reforme alors une variable avec ces infos
  // Cette nouvelle donnée est dupliquée depuis deux collections (products et users), mais ce n'est pas un problème car peu de risque de conflits entre les données
  return this.getCart()
    // J'ai tous mes produits
    .then(products => {
      const order = {
      // Je les ajoute dans la propriétés items
      items: products,
      // Je crée une propriété user qui contient ce qu'il me faut pour l'order
      user: {
        _id: new ObjectId(this._id);
        name: this.name,
        email: this.email
      }
    })
    // J'ajoute la carte dans la collection orders et je la vide
    return db.collection('orders').insertOne(order)
  }
  .then(result => {
      this.cart = { items: [] };
      return db
        // Et je clean la carte dans la db aussi
        .collection('users').updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
    })
    .catch(err => console.log(err));
}
```

* Dans le controller :

```js
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
```

#### Afficher les orders

* Dans le Model

```js
getOrders() => {
  const db = getDb();
  // Dans MongoDB on peut checker des conditions avec des chemins vers la data, il faut utiliser les simples quotes pour ça
  // Ici je vais chercher dans le modèle orders, dans les entrées user_id, tous les documents qui ont l'id courant
  return db.collection('orders').find({ 'user_id': new ObjectId(this._id) })
    .toArray();
}
```

* Dans le controller :

```js
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
```

### Gérer la suppression d'une collection à une autre

* Si je supprimer un produit dans une collection, ce même produit existera toujours dans l'autre collection s'il y est utilisé
* Il faudrait pour gérer cela créer un script qui s'exécute sur le serveur et qui vérifie toutes les 24h les erreurs de ce type et les nettoie
* Il pourrait y avoir un script qui nettoie les cartes toutes les 24h également