<?php

require __DIR__.'/../vendor/autoload.php';

use app\Application;
use app\Utils\Database;

$app = new Application(); 
$app->run();