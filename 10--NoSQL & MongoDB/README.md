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

const mongoConnect = (cb) => {
    // Bien modifier le user et le pass dans la string
    MongoClient.connect('urlServieDansParAtlas')
        .then(client => {
            console.log('Connected'));
            cb(client);
        } 
        .catch(err => console.log(err));
}

module.exports = mongoConnect;
```

* Ensuite dans le fichier du front controller :
```js
// En début de fichier
const mongoConnect = require('./utils/database');

// En fin de fichier
mongoConnect((client) => {
    console.log(client)
    app.listen(3000)
})
```
