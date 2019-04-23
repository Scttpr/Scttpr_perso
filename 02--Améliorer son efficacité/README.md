# Improved Development Workflow and Debugging

## Comprendre les scripts NPM

* NPM == gestionnaire de paquets de Node Js
* Permet d'utiliser des modules externes
* `npm init` == Equivalent du `composer.json` en PHP, crée le fichier `package.json` (fichier de configuration)
    * package.json comprend une partie scripts : on peut ajouter ses scripts à l'intérieur comme start par exemple `start`
        * `start: node app.js` >> On peut lancer `npm start` dans le terminal pour lancer l'application car c'est un nom réservé
        * Pour les scripts non réservés, il faut utiliser la commande `npm run scriptName`

## Installer des modules externes

* Structure d'un projet Node :
    * Local project (qui contient le code et les paquets Core de Node)
    * Les dépendances (modules externes NPM comme express, body-parser, etc)

* Installer un module externe : Nodemon
    * `npm install nodemon --save-dev` == Module qui permet la maj en live des modifications sans relancer le serveur
        * Certains packages ne sont nécessaire que pendant la phase développement (comme Nodemon par exemple, d'où le `--save-dev`)
        * Le paquet est installé en local, cela crée le dossier `node_modules` et `package.json` a été mis à jour
        * On peut supprimer et réinstaller le dossier node_modules quand on le souhaite via `npm install` grâce au fichier de configuration `package.json`
        * `sudo npm install nodemon -g` == installer nodemon globalement

### Nodemon pour l'autostart

* Changer le paramètre start de `package.json` par `nodemon app.js`

## Comprendre les types d'erreurs

* Les différents types d'erreurs :
    * Les erreurs de syntaxe
    * Runtime errors == Code cassé
    * Logical errors == Erreurs de logiques, sans message d'erreurs

### Trouver et réparer les erreurs de syntaxes

* Le log d'erreur renvoi le numéro de la ligne (__/!\ en fonction de l'erreur, la ligne peut-être fausse__)
* On peut utiliser la coloration des parenthèses et accolades

### Gérer les erreurs de code

* Toujours lire les erreurs (huhu)
* En haut du message d'erreur : le code de l'erreur, un message sur l'erreur, nomDuFichier et ligne où l'erreur arrive

### Les erreurs de logique

* Les erreurs les plus difficiles à gérer
* L'application ou le script ne se comporte pas comme prévu
* Travailler avec le debugger de Node aide beaucoup
    * Dans déboguer > commencer à déboguer > choisir le langage
    * Il y a la console de débogage est attaché, il faut pour cela définir des breakpoints (des endroits pour que le code se stoppe) >> On peut les définir en cliquant à gauche des chiffres.
    * Au niveau du breakpoint, on peut passer sur la ligne pour voir les valeurs courantes de chaque élément
    * On peut aussi aller dans affichage > débog mode pour avoir le menu de débogage sur la gauche et non dans la console
    * On peut définir des watchers > Regarder des éléments précis

* On peut lancer du code dans le débogueur pour comprendre les valeurs dans les variables ou les fonctions
* Configuration du débogueur == launch.json > "restart": true, // "runtimeExecutable": "nodemon"
* On peut également changer la valeur d'une variable dans le débogueur via le menu de gauche, le script peut se lancer avec la nouvelle valeur

### Ressources sur le débogueur

> * https://nodejs.org/en/docs/guides/debugging-getting-started/
> * https://code.visualstudio.com/docs/nodejs/nodejs-debugging