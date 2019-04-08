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