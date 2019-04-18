# NoSQL & MongoDB

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