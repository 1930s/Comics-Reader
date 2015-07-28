<?php

// Configure
// ---------------------------------------------------------------------------------------------------------------------
include __DIR__ . '/config.php';
include __DIR__ . '/functions.php';


// Create application
// ---------------------------------------------------------------------------------------------------------------------
$app = new \Slim\Slim(
    array(
        'view' => new CustomView('layout.php'),
        'templates.path' => 'views',
    )
);


// Add Imagecache
// ---------------------------------------------------------------------------------------------------------------------
Onigoetz\Imagecache\Support\Slim\ImagecacheRegister::register($app, $image_config);


// Add Cache
// ---------------------------------------------------------------------------------------------------------------------
$app->container->singleton(
    'cache',
    function () {
        return new Cache();
    }
);


// Init Routes
// ---------------------------------------------------------------------------------------------------------------------
include __DIR__ . '/routes.php';


// Run
// ---------------------------------------------------------------------------------------------------------------------
$app->run();