<?php

ini_set('display_errors', 1);

define('BASE', dirname($_SERVER['SCRIPT_NAME']).'/');

/*
 * Gallery Directory
 */
define('GALLERY_ROOT', '/Volumes/Data/THE_DATA/Data/BD');


/*
 * Thumbs
 */
define("THUMB_ROOT", dirname(__FILE__)."/cache/MINI/");

define("THUMB_MAX_WIDTH", 80);
define("THUMB_MAX_HEIGHT", 80);


/*
 * Bigs
 */
define("BIG_ROOT", dirname(__FILE__)."/cache/BIG/");

define("BIG_MAX_WIDTH", 800);
define("BIG_MAX_HEIGHT", 2000);

/*
 * Others
 */
define("DIR_IMAGE_FILE", "_image.jpg");
define("ENLARGE_SMALL_IMAGES", FALSE);
define("JPEG_QUALITY", 75);

define('CACHE', dirname(__FILE__).'/cache/INTERNAL');


include 'functions.php';
include 'lib/cache.php';
include 'lib/image_manager.php';
include 'lib/limonade.php';

//Limonade options
option('base_uri', 'Public/BD/');
option('views_dir', dirname(__FILE__).'/views');

$cache = new Cache();

function cache_get($key){
    global $cache;
    return $cache->fetch($key);
}

function cache_set($key, $data, $ttl = 3600){
    global $cache;
    return $cache->store($key, $data, $ttl);
}