<?php

namespace app\Controllers;

abstract class CoreController {

    public function notFound() {
    }

    protected function show($tplName, $viewVars = []) {
       
        extract($viewVars);

        require __DIR__.'/../views/header.tpl.php';
        require __DIR__.'/../views/'.$tplName.'.tpl.php';
        require __DIR__.'/../views/footer.tpl.php';
    }

  
    /*
    * @param mixed $data
    */
    protected function showJson($data) {
        // Autorise l'accès à la ressource depuis n'importe quel autre domaine
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Credentials: true');
        // Dit au navigateur que la réponse est au format JSON
        header('Content-Type: application/json');
        // La réponse en JSON est affichée
        echo json_encode($data);
    }
}