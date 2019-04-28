# Comprendre les requêtes asynchrones

> * https://www.json.org/
> * https://developers.google.com/web/updates/2015/03/introduction-to-fetch
> * https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started

## Qu'est-ce que les requêtes asynchrones ?

* Modèle classique == Une requête et une réponse (page HTML ou une redirection qui renvoi une page HTML)
* Dans les applications modernes ont fait de plus en plus de requêtes "behind the scenes"
    * Ces requêtes comprennent des datas en JSON
    * Le serveur traite la requête et renvoi une réponse en JSON aussi

## Ajouter du JS côté client

* Dans le dossier public/js on crée un fichier admin.js
* Ne pas oublier d'importer le fichier dans la vue products.ejs dans lequel on supprime le formulaire car on écoutera le click au bouton et non pas au dubmit
```js
// Le fichier admin.js
const deleteProduct = (btn) => {
    // Récupère les éléments attenant
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
};
```

* Dans le fichier ejs on édite le bouton pour lui ajouter un attribut `onclick="deleteProduct()"`

## Envoyer et gérer les requêtes "de fond"

* il y a d'autres méthodes que GET et POST, ici DELETE est sémantique, c'est plus clair
* Dans le fichier /routes/admin.js :
```js
router.delete('/product/:productId', isAuth, adminController.deleteProduct);
```

* Dans controllers/admin.js :
```js
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
    // Ici on ne veut plus rediriger mais renvoyer du JSON
      res.status(200).json({
          message: 'Success !'
      });
    })
    .catch(err => {
      res.status(500).json({
          message: 'Deleting product failed'
      })
    });
};
```

* Dans le fichier côté client admin.js :
```js
// Le fichier admin.js
const deleteProduct = btn => {
    // Récupère les éléments attenant
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');

    fetch(`/admin/product/${prodId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    // Pour récupérer la data en json
    .then(result => {
        return result.json();;
    })
    .then(date => {
        productElement.parentNode.removeChild();
    })
    .catch(err) => {
        console.log(err);
    }
};
```