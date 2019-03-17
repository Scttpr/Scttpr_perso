/* 
Cours d'initation à Node.js OpenClassRoom
https://openclassrooms.com/fr/courses/1056721-des-applications-ultra-rapides-avec-node-js/1057142-une-premiere-application-avec-node-js#/id/r-1058207
*/

// Require l'objet HTTP
var http = require('http');
// Require l'objet Url
var url = require('url');
// Require querystring
var querystring = require('querystring');

/*
Il y a deux façons d'écrire un CB :
Soit en rangeant la fonction dans une variable, soit en la déclarant directement en paramètre de la méthode :

var exeOnUserConnexion = function (req, res) {
    res.writeHead(200);
    res.end('Salut tout le monde !');
}

var server = http.createServer(exeOnUserConnexion);

/!\ EN GENERAL ON CODE EN METTANT LES FONCTIONS DIRECTEMENT EN PARAM
*/

// Création du serveur via la méthode createServer contenue dans l'objet http
// req == la requête du visiteur : cet objet contient toutes les informations sur ce que le visiteur a demandé. On y trouve le nom de la page appelée, les paramètres, les éventuels champs de formulaires remplis...
// res == La réponse que vous devez renvoyer : c'est cet objet qu'il faut remplir pour donner un retour au visiteur. Au final, res contiendra en général le code HTML de la page à renvoyer au visiteur.

/*
Que dit la norme HTTP ? Que le serveur doit indiquer le type de données qu'il s'apprête à envoyer au client. Eh oui, un serveur peut renvoyer différents types de données :

    Du texte brut : text/plain

    Du HTML : text/html

    Du CSS : text/css

    Une image JPEG : image/jpeg

    Une vidéo MPEG4 : video/mp4

    Un fichier ZIP : application/zip

    etc.

Ce sont ce qu'on appelle les types MIME. Ils sont envoyés dans l'en-tête de la réponse du serveur.
*/
var server = http.createServer(function (req, res) {
    // En premier on parse l'URL provenant de la req pour déterminer la page
    var page = url.parse(req.url).pathname;
    // Maintenant on peut parse l'URL en récupérant aussi les params GET
    /*
    Pour décomposer ce code il s'agit de la méthode parse d'URL qui renvoi l'URL sous forme de string
    url.parse(req.url).query
    On utilise la méthode parse du module querystring qui prend en param... une string !
    Celle-ci renvoi un tableau des params ;)
    */
    var params = querystring.parse(url.parse(req.url).query);

    // On paramètre le header de la réponse en 202 et avec le MIME HTML
    // Le second param est en accolade car on peut le passer sous forme de tableau << MyRTFM
    res.writeHead(200, {"Content-Type": "text/html"});

    // Un beau routing à l'ancienne
    if (page == '/') {
        if ('prenom' in params) {
            res.write('Salut ' + params['prenom']);
        } else {
            res.write('Bienvenue bel inconnu');
        }
    }
    else if (page == '/sous-sol') {
        res.write('Vous êtes dans la cave à vins, ces bouteilles sont à moi !');
    }
    else if (page == '/etage/1/chambre') {
        res.write('Hé ho, c\'est privé ici !');
    } else {
        res.write('Coucou Tony');
    }
    // On peut console.log des messages
    console.log('Salut tout le monde !');
    // On peut écrire du code HTML ici mais ça sent le truc pas opti :p
    /*
    res.write(
        '<!DOCTYPE html>'+
        '<html>' +
        '    <head>' +
        '        <meta charset="utf-8" />' +
        '        <title>Ma page Node.js !</title>' +
        '    </head>' +
        '    <body>' +
        '     	<p>Voici un paragraphe <strong>HTML</strong> !</p>' +
        '    </body>' +
        '</html>'
    );
    */
    // On termine la réponse avec `end`, toujours.
    res.end('<h1>Hello World !</h1>');
});

// Le serveur se lance sur le port 8080
// On évite d'utiliser le port 80 qui est normalement réservé aux serveurs web (il est peut-être déjà utilisé par votre machine). Une fois en production on ira sur le port 80 car c'est à ce port que vos visiteurs iront taper en arrivant sur votre serveur.
server.listen(8080);