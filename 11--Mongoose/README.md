# Mongoose

## What is mongoose

* C'est un ODM (ORM pour une BDD non relationnelle) pour MongoDB

## Installer Mongoose

> * https://mongoosejs.com/docs/

* Mongoose fait tout le travail du fichier database.js
* Il suffit d'importer Mongoose dans le fichier app.js
```js
// A la fin du fichier
mongoose.connect('urlToConnect');
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
```

## Créer le schéma produit

* Dans le Model product :
```js
const mongoose = require('mongoose');
// MongoDB est schemaless ? On aura quand même une certaine structure, si on se concentre sur la data, il faut savoir a minima à quoi la donnée ressemble mais on peut sortir du schéma
const Schema = mongoose.Schema;

// Il faut lui passer un objet qui définit la donnée
const productSchema = new Schema({
    title: {
        type: String,$
        // Ici on restreint la flexibilité du noSQL mais c'est pas mal non plus ;)
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    description: {
        type: String,
        required: true
    }
    imageUrl: {
        type: String,
        required: true
    }
});

// On export un model mongoose, le nom en premier param sera utilisé pour créer le nom de la collection en minuscule et au pluriel
module.exports = mongoose.model('modelName', productSchema);
```

## Sauvegarder des données avec Mongoose

* Dans le controller :

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
      title: title,
      price: price,
      ...
  });
  product
    // Méthode fournie par Mongoose
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};
```

## Fetch tous (ou un seul) les produits

* Dans le controller :

```js
exports.getProducts = (req, res, next) => {
    // Find est similaire à la méthode de MongoDB mais renvoi directement un objet, pas un cursor
    // Pour récupérer un seul produit il suffit d'utiliser findById('stringQuiSeraTransforméeEnObjectId')
    Product.find()
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

## Editer et supprimer un produit

* Dans le controller :
```js
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findById(prodId)
        .then(product => {
            product.title = title;
            product.price = price;
            ...
            return product.save();
        })
        .then(result => {
        // console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
        })
        .catch(err => {
        console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
    // Méthode fournie par Mongoose aussi
    Product.findByIdAndRemove(prodId)
        .then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    };
```

## Gérer les relations avec Mongoose

* Dans le Model User :
```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    }
    email: {
        type: String,
        required: true
    }
    // Si je veux embedded datas
    cart: {
        // je veux stocker un objectId
        items: [{ productId: { type: Schema.Types.ObjectId, required: true }, qty: { type: Number, required, true }]
    }
})

module.exports = mongoose.model('User', userSchema);
```

* Dans app.js :
```js
// On crée un user ici pour en avoir un connecté dans tous les cas
mongoose.connect('stringToConnect')
    .then(result => {
        User.findOne()
            .then(user => {
                if(!user) {
                    const user = new User({
                    name: 'Toto',
                    email: 'toto@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
                }
            })
        app.listen(3000);
    })
    .catch(err => console.log(err));
```

```js
// Pour rendre le user disponible partout dans l'application dans l'objet req, revoir le cours précédent
```

* Une fois le user défini, on veut l'utiliser avec les produits
* On édite le Model pour lui ajouter l'id du user

```js
const productSchema = new Schema({
    title: {
        type: String,$
        // Ici on restreint la flexibilité du noSQL mais c'est pas mal non plus ;)
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    description: {
        type: String,
        required: true
    }
    imageUrl: {
        type: String,
        required: true
    }
    userId: {
        type: Schema.Types.ObjectId,
        // Je peux également définir la même référence côté Product pour avoir la relation dans les deux sens
        ref: 'refToTheOtherModel',
        required: true
    }
});
```

* On doit également éditer le controller pour ajouter le UserId
    * Il suffit d'aller chercher le user dans la requête, Mongoose ira chercher l'id directement

* __Si je veux récupérer toutes les données du user et pas seulement le userId__
    * `.select('title price -_id')` == Sélectionne seulement les champs qui m'intéressent
    * `.populate('userId', 'lesChampsQueJeVeux')` == Populate un champ avec toutes les infos du champ relié

## Travailler avec la cart

* Dans le Model on doit recréer les méthodes getCart(), addToCart(), etc.:

```js
// On peut créer des méthodes dans un model
userSchema.methods.addToCart = function(product) {
    // On retrouve le même schéma de données que précédemment, pas grand chose ne bouge
    // A la fin:
    this.save();
}
```

* __/!\ `.populate()` ne renvoit pas de promesses, il faut utiliser `.execPopulate()` après pour cela__

## Travailler avec les orders

* On crée le model Order et on retrouve une logique proche des autres Models