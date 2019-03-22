// require Express
const express = require('express');

// Création de l'app et définition du port
const app = express();
const port = 3000;

// Définition du moteur de template
app.set('view engine', 'ejs');

// Variable à passer à la vue
var text = 'Hello World !';

// Route
app.get('/', (req, res) => {
    // Va chercher la vue 'home' dans le dossier views et lui passe la variable text
    res.render('home', {text: text});
});

app.listen(port, () => {
    console.log('app launched on port ' + port);
});