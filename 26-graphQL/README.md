# GraphQL, REST on steroids

## GraphQL ?

* Comparer à une API REST :
    * REST == Stateless client indenpendant API pour échanger des données
    * Graph == Stateless client independent API pour échanger des données avec une grande flexibilité sur les requêtes

    * REST endpoints limites == GET /post > fetch Post > datas >>> __Et si je n'ai besoin que d'une partie de la donnée ???__
        * Solutions ? Créés plus de endpoint pour découper encore plus la donnée >>> __Pblme, beaucoup de endpoint, peu flexible !__
        * Solutions ? Ajouter des param à la requête (GET /post?data=slim) >>> __Pas clair, difficile à gérer côté front__
        * Solutions ? GraphQL >>> __AUCUN PROBLEME__

* Proche d'un langage de requête BDD pour le front

* Comment ça marche ?
    * Client envoi une sorte de requête au serveur (un seul endpoint)  : POST /graphql
        * Cette requête contient un body avec sa propre query qui sera parse sur le serveur pour retourner la bonne data
        ```json
        {
            query { // Type d'opération, il peut y avoir mutation ou subscription (pour le websocket)
                user {  // Endpoint
                    name // Les champs à extraire 
                    age
                }
            }
        }
        ```

* Les types d'opération :
    * query == get en REST
    * mutation == POST, PUT, PATCH, etc.
    * subscription ==  realitime connexion avec websocket

* Donc on envoi une requête sur un endpoint, côté serveur on définit les types de requêtes (équivalent des routes) qui sont connectés aux resolvers qui contiennent la logique côté serveur (équivalent des controllers) qui analyse la requête et fetch et traite les données en fonction et les retournent

## Le set-up

* `yarn add graphql express-graphql` == Modules à installer
* Apollo est le module le plus populaire mais est moins brut qu'express-graphql et donc moins pédagogique

* On crée un dossier graphQL à la racine avec un fichier resolvers.js et schema.js

* Dans schema.js:
```js
const { buildSchema } = require('graphql');

// Définition d'un schema, backticks pour la string sur plusieurs lignes
// Ici la query hello renvoie une donnée de type String
// Ici il s'agit d'un schema qui permet de récupérer un objet avec une string et un int (rootQuery)
module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }
    type RootQuery {
        hello: TestData!
    }
    
    schema {
        query: RootQuery
    }
`);
```

* Dans resolvers.js
```js
module.exports = {
    // Il faut ici une méthode pour chaque query du schema
    hello() {
        return {
            text: 'Hello world !',
            views: 122,

        }
    }
}
```

* Dans server.js ou app.js (FC):
```js
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

// Avant le traitement du middleware erreur, prend en premier param la définition de la route et la méthode graphqlHttp qui prend elle même en param un objet
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver
    // graphiql == outil pour tester l'API via l'url définie en 1er param
    graphiql: true,
}))
```

* Pour envoyer une requête, il faut envoyer dans le body une data avec cette syntaxe :
```graphql
{
    "query": "{ hello { text views } }"
}
```

## Définir une mutation


* Dans schema.js:
```js
const { buildSchema } = require('graphql');

// On passe en param de la mutation les éléments qui changent
// input est un mot clé natif
// Il faut définir un 'model' pour chaque élément
module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData) : User!
    }

    type RootQuery {
        hello: String!
    }
    
    schema {
        mutation: RootMutation
        query: RootQuery
    }
`);
```

* Dans resolvers.js
```js
// require la bdd
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = {
    createUser: async (args, req) => {
        // On peut aller chercher les éléments du schéma
        // const email = args.userInput.email;
        // await gère le return automatiquement
        const existingUser = await User.findOne({ email: args.userInput.email});
        if (existingUser) {
            const error = new Error('User already exists');
            throw error;
        }
        const hashedPw = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
            email: args.userInput.email,
            name: args.userInput.name,
            password: hashedPw,
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() }
    }
}
```

## Ajouter de la validation

* `yarn add validator` == On déplace la validation dans le resolvers.js
```js
module.exports = {
    createUser: async (args, req) => {
        const errors = [];
        if (!validator.isEmail(args.userInput.email)) {
            errors.push({ message: 'Email is not valid' });
        }
        if (validator.isEmpty(args.userInput.password) || !validator.isLength(args.userInput.password, { min: 5 })) {
            errors.push({ message: 'Password too short' });

        }
        if (errors.length > 0) {
            const error = new Error('Invalid input')
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({ email: args.userInput.email});
        if (existingUser) {
            const error = new Error('User already exists');
            throw error;
        }


        const hashedPw = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
            email: args.userInput.email,
            name: args.userInput.name,
            password: hashedPw,
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() }
    }
}
```

## Gérer les erreurs

* Dans le Fc :
```js
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver
    graphiql: true,
    // Paramtréage et Gestion des erreurs
    formatError(err) {
        if (!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occured';
        const code = err.orginalError.code || 500;
        return {
            message,
            data,
            status: code,
        }
    }
}));
```

## Connecter l'API au Front

* Dans le fichier App.js, la méthode signupHandler :
```js
signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    // Toujours une query qui contient son type, son nom et le contenu nécessaire (voir Schema), ici on retourne l'id et l'email, ce n'est pas nécessaire mais c'est pour la syntaxe
    const graphqlQuery = {
        query: `
            mutation {
                createUser(userInput: { email: "${authData.signupForm.email.value}", name: "${...}", password: "${...}" }) {
                    _id
                    email
                }
            }
        `
    }
    fetch('http://localhost:8080/auth/signup', {
        // Méthode obligatoirement en POST
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        // Je veux stringifier ma requête GraphQL
        body: JSON.stringify(graphqlQuery);
    })
        .then(res => {
            return res.json();
        })
        .then(resData => {
            // Validation si il y a des erreurs
            if (resData.errors && resData.errors[0].status === 422) {
                throw new Error('validation failed, make sure email is a new one !');
            }
            if (resData.errors) {
                throw new Error ('user creation failed');
            }
            this.setState({ isAuth: false, authLoading: false });
            this.props.history.replace('/');
            })
        .catch(err => {
            console.log(err);
            this.setState({
                isAuth: false,
                authLoading: false,
                error: err
            });
        });
  };
```

* __/!\ Attention il peut y avoir une erreur dans la requête OPTIONS__
    * Pour fixer ça, dans la FC, dans le middleware qui paramètre les headers :
    ```js
    app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // On vient gérer l'erreur sur la méthode OPTIONS ici !!!
    // On return et donc on coupe la chaine des middleware et donc on n'ira pas vers le traitement graphQl
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
    });
    ```

## Ajouter une requête pour le login

* Même logique qu'en REST API
* Dans le schema :
```js
// Les changements se font au niveau de la RootQuery
module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData) : User!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }
    
    schema {
        mutation: RootMutation
        query: RootQuery
    }
`);
```

* Son resolver :
```js
module.exports = {
    createUser: async (args, req) => {
        const errors = [];
        if (!validator.isEmail(args.userInput.email)) {
            errors.push({ message: 'Email is not valid' });
        }
        if (validator.isEmpty(args.userInput.password) || !validator.isLength(args.userInput.password, { min: 5 })) {
            errors.push({ message: 'Password too short' });

        }
        if (errors.length > 0) {
            const error = new Error('Invalid input')
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({ email: args.userInput.email});
        if (existingUser) {
            const error = new Error('User already exists');
            throw error;
        }


        const hashedPw = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
            email: args.userInput.email,
            name: args.userInput.name,
            password: hashedPw,
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() }
    },
    // On récupère la méthode définie dans le schéma
    login: async ({ email, password }) => {
        // J'await pour la requête mongoose
        const user = await user.findOne({ email: email });
        if (!user) {
            const error = new Error('User not found');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        }, 'somesecret', { expiresIn: '1h' });
        return { token, userId: user._id.toString() };
    }
}
```

## Ajouter la fonctionnalité login

* Côté front, dans la méthode loginHandler():
```js
loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    // La syntaxe de la query est plus simple
    const graphqlQuery = {
        query: `
        {
            login(email: "${}authData.email", password: "${authData.password}") {
                token
                userId
            }
        }
        `
    }
    // La route est différent, il faut passer par Graphql
    fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(graphqlQuery);
    })
        .then(res => {
            return res.json();
        })
        .then(resData => {
            if (resData.errors && resData.errors[0].status === 422) {
                throw new Error('validation failed, make sure email is a new one !');
            }
            if (resData.errors) {
                throw new Error ('user creation failed');
            }
            // La réponse graphQL est un peu différente
            this.setState({
                isAuth: true,
                token: resData.data.login.token,
                authLoading: false,
                userId: resData.data.login.userId
            });
            localStorage.setItem('token', resData.data.login.token);
            localStorage.setItem('userId', resData.data.login.userId);
            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
            );
            localStorage.setItem('expiryDate', expiryDate.toISOString());
            this.setAutoLogout(remainingMilliseconds);
            })
        .catch(err => {
            console.log(err);
            this.setState({
                isAuth: false,
                authLoading: false,
                error: err
            });
        });
  };
```

## Ajouter une mutation pour créer un post

