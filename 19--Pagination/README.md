# La pagination

Pour avoir les infos sur le fonctionnement en SQL :
> * https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging

```
To quickly sum it up: The LIMIT command allows you to restrict the amount of data points you fetch, it's your limit() equivalent. Combined with the OFFSET command (which replaces skip()), you can control how many items you want to fetch and how many you want to skip.

When using Sequelize, the official docs describe how to add pagination: http://docs.sequelizejs.com/manual/tutorial/querying.html#pagination-limiting
```

## Ajouter des liens de pagination

* Dans une vue :
```html
<section class="pagination">
    <a href="/?page=1">1</a>
    <a href="/?page=2">2</a>
</section>
```

* Dans le shop Controller :
```js
const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
    // On récupère le numéro de la page
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus_()
    const page = +req.query.page;
    let totalItems;

    Product.find().count()
        .then(numProducts => {
            totalItems = numproducts
            return  Product.find()
                // MongoDB fournit ces méthodes
                // Permet de sauter un certain nombre d'item
                .skip((page - 1) * ITEMS_PER_PAGE)
                // Permet de limiter le nombre de data à afficher
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('path', {
                datas...
                // On dynamise les datas pour afficher le nombre de page
                totalProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        });
}
```

## Dynamiser la vue

_cf le fichier index.ejs_