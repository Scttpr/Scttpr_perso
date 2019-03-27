<?php

namespace app\Controllers;

class ErrorController extends CoreController {
    /**
     * Méthode permettant d'afficher la page "404"
     */
    public function err404() {
        $this->show('tony-404');
    }
}