<?php

namespace app\Controllers;

use app\Utils\Database; 
use app\Models\ListModel; 
use app\Models\CardModel; 
use app\Models\LabelModel;

class MainController extends CoreController {

    public function home() {
        $this->show('home');
    }
}