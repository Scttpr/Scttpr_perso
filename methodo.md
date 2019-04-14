# Note méthodologique

## Objectif

* Petite prise de note pour passer d'un problème à une solution codée, étape par étape.

## Support

### Le classique de la charrette :

```Après seulement quelques heures de route, au sein de cette longue caravane de marchands, certains chevaux montrent déjà des signes de fatigue alors que d'autres sont en pleine forme. En cherchant la raison de ce phénomène, vous vous rendez compte que certaines charrettes sont bien plus lourdes que les autres ! Vous décidez donc de régler le problème !```

* On veut donc coder un script qui puisse répartir le poids de façon égale entre les différentes charrettes.

## Préalable

### /!\ Ce qu'il ne faut pas faire /!\

* Se lancer bille en tête dans le code, non, non, non, très mauvaise idée.
* Ne pas lire l'énoncé dans sa totalité, non plus !
* Paniquer, stresser, manger des chips, bref, tout comportement qui ne consiste pas à suivre une méthodologie rigoureuse et calme pour survivre tranquillement à un problème.

### Ce qu'il est préférable de faire

* Être dans un espace de travail calme et propice à la concentration, la distraction n'est pas une bonne chose lorsqu'on doit être rigoureux.
* Se mettre dans des conditions optimales :
    * Envie d'un thé ? go
    * Envie de pisser ? go
    * Envie de fumer ? go
    * Besoin de rien envie de toi ? go

* Vous êtes bien installé ? Alors on peut se lancer dans le vif du sujet : la résolution étape par étape du problème.

## Etape 1 : formulation du problème

> Non, vous n'avez aucune raison de ne plus savoir par où commencer, car vous savez maintenant que le commencement commence au début, le reste, ça ne sera que le début de la suite.

### Dépieuter le problème

* Quel sont les éléments du problème ? Ici, il faut reprendre les éléments connus un par un pour mieux comprendre :
```
Après seulement quelques heures de route, au sein de cette longue caravane de marchands, certains chevaux montrent déjà des signes de fatigue alors que d'autres sont en pleine forme.
```
* Ici nous avons déjà :
    * Nous sommes sur la route depuis quelques heures
    * Nous sommes dans une longue caravane de marchands
    * Cette caravane est composée de chevaux
    * Les chevaux montrent des signes de fatigue, d'autres non.

* Que peut-on en conclure ? Et bien déjà beaucoup de choses !
    * Nous avons un __contexte__ : une caravane de marchands en circulation
    * Une __temporalité__ : Le voyage dure depuis quelques heures
    * Et finalement un __problème__ : les chevaux se fatiguent de façon inégale.

* Voyons la suite :
```
En cherchant la raison de ce phénomène, vous vous rendez compte que certaines charrettes sont bien plus lourdes que les autres ! Vous décidez donc de régler le problème !
```

* Alors alors encore une fois :
    * En fait on nous aide un peu puisqu'on a déjà cherché ! Cool !
    * La caravane est composée de charrettes
    * Ces charrettes ont des poids variables
    * ... hoho !

* Alors là c'est la fête car on a tous les éléments du problèmes :
    * __On connaît la provenance du problème__ : Le poids des charrettes n'est pas égale, la fatigue non plus... à tous les coups les chevaux tractent les charrettes et donc fatiguent en fonction du poids de cette dernière. *scratch sratch* C'est parti !

### Du dépieutage relou à une formulation plus précise

* Nous avons donc un __problème__ : le poids des charrettes est inégal, la fatigue des chevaux n'est pas uniforme.
* Nous avons un __objectif__ : Faire en sorte que la fatigue des chevaux soit uniforme.

* Il faut maintenant lister les différents éléments que nous avons (et oui encore), mais on va essayer de se rapprocher d'une forme qui nous permettra de commencer à passer à l'algo :
    * J'ai des chevaux, donc un nombre de chevaux, donc on pourrait appeler ça... n chevaux, et puis... vu qu'on est plutôt bonne pratique et qu'on veut anticiper un poil, on va carrément faire les fifous, on va les appeler __nHorses__. Si on voulait être vraiment très précis, on aurait pu les appeler numberHorses, mais on est dev, on reste feignant !
    * J'ai un poids par cheval... __horseWeight__ ? C'est pas idéal mais pourquoi pas !

* J'ai donc nHorses qui portent chacun horseWeight. Le problème c'est donc que ce horseWeight n'est pas constant mais variable selon le cheval, pas cool. On va accélérer un peu, il faut réfléchir un peu et chercher toutes les infos qu'on peut trouver depuis ces deux données :

    * Si j'ai nHorses portant horseWeight, alors je peux avoir le poids total en additionnant le poids porté par chaque cheval. On pourrait appeler cette donnée supplémentaire... le __totalWeight__. Comment je le calcule ? >>> 
        * Au départ, totalWeight est forcément de 0, pour chaque cheval, je veux additioner horseWeight à totalWeight (bordel ça ressemble à du code !)
    * Je veux que le poids soit pareil pour tous les chevaux... donc il faut que chaque cheval porte la même valeur... une valeur moyenne de ma charge totale en quelque sorte, pourquoi pas __avgWeight__  (on aurait pu l'appeler averageWeight mais c'est long et chiant):
        * Comment on calcule avgWeight ? Et bien on a déjà besoin du totalWeight et vu que c'est une moyenne, il suffit de le diviser par le nombre de chevaux... On l'a, nickel !

Les choses se précisent, si j'arrive à faire un script qui modifie le horseWeight pour qu'il soit égal à avgWeight pour chaque cheval, j'ai gagné ! ça sent bon :D

## Passer des éléments de la problématique au code

### Identifier et typer les variables

* Avant de commencer ma recette secrète pour rééquilibrer mes pauvres chevaux, il faut que je définisse mes ingrédients :
    * __nHorses__ est un chiffre entier (int), je n'ai pas de demi-chevaux (les shetlands ça tire pas bien les caravanes)
    * __horseWeight__ la réponse n'est pas la même en fonction du langage mais de façon générale, le poids n'est pas forcément un chiffre rond, donc il s'agit d'un nombre décimal, un float
    * __totalWeight__ comme le poids est un float, la somme des poids risque d'être un float ;)
    * __avgWeight__ Ici aussi, float.

* On a les ingrédients de notre recette. Si on essayait d'écrire cette recette ?

### Passer au méta-code

* Alors j'ai :
```
nHorses = monNombreDeCheval
horseWeight = ... ??? 
totalWeight = ......... AAAAAAAH PANIIIIIIQUE !
```
* j'ai... un soucis, il me faut la valeur du poids porté par chaque cheval... et ça je ne l'ai pas encore, il faut que je le récupère.

* Cette donnée est un poil différente des autres car il nous faut un poids par cheval ! Qu'est-ce qui nous permet de stocker des valeurs dans une même variable... tatataaa > __les tableaux__ ! Du coup, pour la convention et parce que c'est plus court en anglais, on appelera ça des __array__ dans le code

* Le soucis c'est : comment je fais pour remplir un tableau ? Et bien comme dans la vraie vie, je prends une valeur et je la mets dedans, j'en prends une seconde et ... ainsi de suite. Ici je vais peser mes chevaux, alors à chaque pesée, je veux pouvoir enregistrer la pesée dans le tableau :
```
Pour chaque cheval j'ajoute le poids courant à la suite dans le tableau
```
* ... Pourquoi je voulais le poids courant au départ ? ... Ah oui, pour calculer le poids total ! Alors très important : si je peux utiliser une méthode de travail pour répondre à plusieurs résultats, j'en profite :
```
Pour chaque cheval j'ajoute le poids courant à la suite dans le tableau et j'ajoute ce poids au poids total
```

* Pour reprendre le méta-code avec les nouveaux éléments :
```
nHorses = monNombreDeCheval

Pour chaque cheval:
    arrayHorses[cheval] = lePoidsDuCheval
    totalWeight = totalWeight + arrayHorses[cheval]
```

* Ensuite j'avance dans la logique, je sais qu'il me faut maintenant le poids total et le poids moyen :
```
nHorses = monNombreDeCheval

Pour chaque cheval:
    arrayHorses[cheval] = lePoidsDuCheval
    totalWeight = totalWeight + arrayHorses[cheval]

avgWeight = totalWeight / nHorses
```

* Maintenant il faut que je rééquilibre le tout. J'ai le poids pour chaque cheval, j'ai le poids moyen. Il faut maintenant que je calcule combien j'ajoute ou je retire à chaque cheval par rapport à la moyenne, c'est un poil de math mais vraiment pas grand chose :
    * Je veux le poids à ajouter ou à enlever. Donc la différence entre le poids moyen et le poids porté par le cheval, pour faire ça bien, on pourrait appeler cette donnée... écart, ou weightDifference (weightDiff !), mais bon, au fond, est-ce que c'est pas le but final de notre travail ? Si ? Allez, go pour __result__  :
    ```
    Pour chaque cheval:
        result[cheval] = avgWeight - arrayHorses[cheval]
    ```

* Bordel, on a réussi !!! On a la solution. Du coup, plus qu'à passer au code !

## Du méta-code au code

> Parce que j'aime JS, on va faire tout ça en JS, c'est plus cool. Vu que ça reste de l'algo léger et un exercice de support, je vais pas m'amuser à mettre ça dans un objet et tout le tralala, on reste dans le code pur juste pour appréhender le : comment je passe d'une syntaxe méta à une syntaxe JS

### La partie facile : déclarer mes variables

* Attention, ici, nous sommes dans une application factorisable du problème dans le sens où quel que soit le nombre de cheval et les poids portés, notre script fonctionnera, il y aura donc des inputs qui seront du type définis plus haut (int, float), on traitera le comment des inputs un peu après. Pour tester ses variables, on peut tout à fait remplacer les inputs par des valeurs de test !

* Hop, on a déjà pas mal d'éléments, vu qu'on est dans la réalité, il y a pas mal de données entrantes.
```js
// Nombre de cheval
var nHorses = input;
// On déclare nos variables avant la boucle pour ne pas les déclarer à chaque fois :
var arrayHorses = [];
var totalWeight = 0;
// On gère le pour chaque avec une boucle de notre choix, ici le but est de remplir un tableau de l'index 0 à l'index nHorses
for(var i = 0; i < nHorses; i++) {
    // Je définis le poids du cheval avec la méthode push qui permet d'ajouter une entrée à la fin du tableau
    arrayHorses.push(input);
    totalWeight += arrayHorses[i];
}

// Une fois que j'ai tous les poids d'ajouter :
var avgWeight = totalWeight / nHorses;
var results = [];
// Maintenant pour chaque cheval, je calcule le résultat
for(var y = 0; y < nHorses; y++) {
    // Je calcule et ensuite j'ajoute au tableau
    result = avgWeight - arrayHorses[y]
    results.push(result);
}

console.log(results)
```

* Voilà c'est terminé ! ... Hihi, non en fait pas tout à fait, on pourrait mettre ça dans une ou des fonctions pour permettre de réutiliser l'ensemble. Là tout de suite j'ai pas le temps de terminer donc je vous push ça, je vous fais la suite dans pas longtemps ;)