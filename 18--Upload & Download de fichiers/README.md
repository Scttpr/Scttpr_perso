# Gérer le téléchargment et le chargement des fichiers

> * https://github.com/expressjs/multer
> * https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
> * http://pdfkit.org/docs/getting_started.html

## Upload un fichier

### Créer l'input côté frontend

* Dans le formulaire d'ajout de produit, on change l'imageUrl input :
```html
<!-- TRES IMPORTANT IL FAUT PRECISER LE ENCTYPE POUR LES FICHIERS -->
<form ... enctype="multipart/form-data">
    <label for="image">Image</label>
    <input 
        type="file" 
        name="image" 
        id="image">
</form>
```

### Gestion du fichier côté serveur

* Dans la route il faut modifier le validateur qui oblige le format de l'image à une string
* __/!\ Le bodyParser est pour l'instant paramétré pour encodé en string tous les éléments qui sont soumis (ça transforme toutes les données en text, donc ça ne marche pas avec le fichier !)__
    * BodyParser ne gère pas les fichiers, il faut installer multer :
        * `npm install --save multer`
    * On garde quand même Body Parser


### Utiliser multer

* `const multer = require('multer');` == Il faut importer multer dans app.js
* Pour configurer le stockage avec multer, dans app.js :
```js
const fileStorage = multer.diskStorage({
    // Pour gérer la destionation
    destination: (req, file, cb) => {
        // Le cb gère une erreur ici null et la destination du fichier ici le dossier images
        cb(null, 'images');
    },
    // Gérer le nom du fichier
    filename: (req, file, cb) => {
        // On donne un nom unique avec la date
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})
```
* `app.use(multer({ storage: fileStorage }).single('image'));` == Puis l'utiliser avec des options (dest pour la destination, storage pour quelque chose de plus riche) en objet de la première méthode !

* admin controller :
```js
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    // Je modifie la récupération de l'input avec multer
    const imageUrl = req.file;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
}
```

### Filtrer les fichiers par MIME Type (extensions)

* Toujours dans app.js :
```js
const fileFilter = (req, file, cb) => {
    // Si c'est le bon format je mets true en param
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    // Sinon false
    } else {
        cb(null, false);
    }
}

// Plus bas
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

```

### Stocker les fichiers dans la BDD

* Les fichiers ne doivent pas être stocker en BDD, on stocke le chemin. Par contre on stocke les images et fichiers sur le serveur

* Dans admin controller :
```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
      return res.status(422).render('admin/edit-product', {
          pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: []
    });
  }
  // Je récupère le chemin vers le fichier
  const imageUrl = image.path;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: image,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
```

### Servir les images de façon statique

* On a déjà sevir le dossier public avec cette ligne de code dans app.js :
```js
app.use(express.static(path.join(__dirname, 'public')));
// On peut avoir plusieurs dossiers de fichiers statiques !
// On ajoute en premier param une condition, si le chemin commencer par /images, alors utilise ce dossier !
app.use('/images', express.static(path.join(__dirname, 'images')));
```

* /!\ De bien gérer les chemins dans les vues ! (ici vu qu'on passe par admin, il faut ajouter un /)

## Télécharger un fichier avec authentification

* Il faut préparer un fichier PDF dans le dossier data/invoices (pour créer un reçu)
* Dans la vue de l'order, on ajoute un lien pour télécharger le reçu
* Vu qu'on veut limiter les droits, on va créer une route dans shop.js pour gérer ça :
```js
router.get('/order/:orderId', isAuth, shopController.getInvoice);
```

* Dans le shop Controller :
```js 
// Il faut d'abord require le module filesystem et path pour naivguer dans le filesystem
const fs = require('fs');
const path = require('path');

exports.getInvoice = (req, res, next) => {
    // Je vais chercher mon Id dynamique dans l'url
    const orderId = req.params.orderId
    // Je vérifie un peu plus la correspondance entre le user et la bdd, si pas bon on throw une erreur, sinon on continue le script !
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('no order found'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }
        })
        .catch(err => next(err));
    const invoiceName = 'invoice-' + orderId + '.pdf';
    // Je construis le chemin vers le bon dossier
    const invoicePath = path.join('data', 'invoices', invoiceName);
    // Je lis le fichier avec la méthode readFile
    fs.readFile(invoicePath, (err, data) => {
        // Si erreur je renvoi à la gestion des erreurs
        if (err) {
            next(err);
        }
        // Sinon j'envoi la donnée pour lancer le téléchargement
        // Ici je permet l'ouverture d'un pdf dans le navigateur
        res.setHeader('Content-Type', 'application/pdf');
        // Ici je permet le changement du nom de fichier
        res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
        // J'envoie le fichier !
        res.send(data);
    });
}
```

* __/!\ Pour des gros fichiers cette méthode est pas géniale : lire un fichier de données dans la mémoire pour le servir en réponse n'est pas optimal !__
* il veut mieux "streamer" les données :
```js
//   // Je lis le fichier avec la méthode readFile
//     fs.readFile(invoicePath, (err, data) => {
//         // Si erreur je renvoi à la gestion des erreurs
//         if (err) {
//             next(err);
//         }
//         // Sinon j'envoi la donnée pour lancer le téléchargement
//         // Ici je permet l'ouverture d'un pdf dans le navigateur
//         res.setHeader('Content-Type', 'application/pdf');
//         // Ici je permet le changement du nom de fichier
//         res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
//         // J'envoie le fichier !
//         res.send(data);
//     });
/////////// A LA PLACE DU SCRIT PRECEDENT ON VA METTRE EN PLACE UN STREAMING
const file = fs.createReadStream(invoicePath);
res.setHeader('Content-Type', 'application/pdf');   
res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
// Permet de télécharger la data étape par étape
file.pipe(res);
```

## Utiliser PDFKit Generation  

* Créer un fichier PDF sur le serveur de façon dynamique
* /!\ La syntaxe de PDF Kit est liée à coffee
* `npm install --save pdfkit` >> puis require

* Toujours dans la même méthode :
```js
// Après la déclaration de la const invoicePath
const pdfDoc = new PDFDocument();
res.setHeader('Content-Type', 'application/pdf');   
res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
// Pour stocker aussi sur le serveur
pdfDoc.pipe(fs.createWriteStream(invoicePath));
// Pour le servir au client
pdfDoc.pipe(res);

// Commencer à éditer le fichier
pdfDoc.fontSize(26).text('Hello world', {
    underline: true
});
pdfDoc.text('---------------------');
// Boucle sur l'array products
let totalPrice = 0;
order.products.forEach(product => {
    totalPrice += product.qty * product.product.price
    pdfDoc.text(product.product.title + ' - ' product.qty + ' x $' + product.product.price);
});
pdfDoc.text('Total Price : ' + totalPrice + ' $');

// Signifie la fin de l'édition du fichier et l'envoi de la réponse sera lancé après
pdfDoc.end();
```

## Supprimer un fichier

* Dans le dossier utils, créer le fichier file.js :
```js
const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    })
}

module.exports = deleteFile;
```

* Dans l'admin controller :
```js
// Après avoir require fileHelper*
// Quand on en a besoin (dans les méthodes qui gèrent la suppression d'un produit par exemple) :
fileHelper.deleteFile(product.imageUrl);
```