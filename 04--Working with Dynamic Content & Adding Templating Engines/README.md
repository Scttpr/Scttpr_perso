# Working with dynamic content & adding templates

## Partager les données de la requête à la réponse

* `const product = [];` == Une variable pour stocker l'input (les valeurs d'un array d'une constante peuvent varier !)
* `exports.product = product` == Exporter la variable vers l'app
* `adminData.routes` == importer les routes et non le produit dans la route

* `product.push({title: req.body.title});` == Récupérer le titre dans la requête et le push dans l'array product, les données sont mises à jour dans tous les fichiers concernés par cette variable.
* __Les données sont partagés via le serveur, donc elle se conserve sur le serveur et donc ne se réinitialise pas au lancement du site et même d'un user à l'autre__

## Les moteurs de templates

* Remplace les placeholders par du code généré par le serveur pour faire du contenu dynamique

* Les différents moteurs de templates :
    * EJS == `<p><%= name %></p>` (proche de PHP)
    * Pug (jade) == `p #{name}` (minimal & custom)
    * Handlebars == `<p>{{ name }}</p>` (normal HTML & custom)

### Installer Pug

> https://pugjs.org/api/getting-started.html

* `npm install --save ejs pug express-handlebars` == Installer plusieurs paquets à la fois

* Le templater le plus exotique

* `app.set('template engine', 'pug')` == Dans app.js on set le moteur de template (set(name, value) permet de définir des informations sur le projet)
* `app.set('views', 'views')` == Ici on s'intéresse à `views` qui est par défaut configuré sur le dossier views

* `index.pug` == nouveau format !
* L'indentation est importante dans pug pour définir les parents et enfants en HTML :
```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title My Shop
        link(rel="stylesheet", href="/css/main.css")
        link(rel="stylesheet", href="/css/product.css")
    body
        header.main-header
            nav.main-header__nav
                ul.main-header__item-list
                    li.main-header__item
                        a.active(href="/") Shop
                    li.main-header__item
                        a(href="/admin/add-product") Add Product
```

* `res.render('shop');` == méthode pour servir les fichiers templates

### Apporter du contenu dynamique

* `const products = adminData.products;` == Stocker le contenu de l'import
* `res.render('shop', {prods: products, docTitle = 'Toto'});` == Permet de passer des données à la vue
* `# { docTitle }` == Permet de passer du contenu dynamique sur la vue

* `.grid` == En Pug, un élément avec une seule classe est par défaut une div

* `each value in array` == Il faut ensuite indenter le contenu de la boucle.
* `h1.product-title #{value.title}` == Ajouter du contenu dynamique

* `if prods.length > 0` == Pareil ce que contient le if est indenté par rapport à ce statement
* `else` == Indentation importante ici aussi !

### Ajouter un layout

* `block styles` // `block content` == Rend possible d'ajouter du PUG au niveau de l'ancre block (ajouter une ligne de fichier css par exemple)
* `extends layouts/main-layout.pug` == require le layout en début de fichier
    * `block content` == Permet d'introduire du PUG à la suite de cette ancre, ne pas oublier d'indenter !

* `path: '/admin/add-product'` == A ajouter en données à passer à la vue et permet de paramétrer la vue si active ou pas avec une condition :

```pug
li.main-header__item
    a(href="/admin/add-product", class=(path === '/admin/add-product' ? 'active' : '')) Add Product
```

## Les alternatives 

__A refaire plus tard !__