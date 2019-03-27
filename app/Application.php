<?php


namespace app;

use AltoRouter;
use Dispatcher;

class Application {
    /**
     * @var AltoRouter
     */
    private $router;

    public function __construct() {
       
        $this->router = new AltoRouter();

        $baseUrl = isset($_SERVER['BASE_URI']) ? trim($_SERVER['BASE_URI']) : '';
        $this->router->setBasePath($baseUrl);

        $this->mapRoutes();
    }

    public function mapRoutes() {
       
        $this->router->map('GET', '/', [
            'controller' => '\app\Controllers\MainController',
            'method' => 'home'
        ], 'home');
    }

    public function run() {
       
        $match = $this->router->match();

        $dispatcher = new Dispatcher($match, '\app\Controllers\ErrorController::err404');
        $dispatcher->dispatch();
    }
}