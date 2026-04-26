<?php
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = strtok($uri, '?');

if ($uri === '/api.php' || strpos($uri, '/api.php') === 0) {
    require __DIR__ . '/api.php';
    return true;
}

$file = __DIR__ . $uri;

if (is_dir($file)) {
    $file .= '/index.php';
}

if (file_exists($file) && is_readable($file)) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
        include $file;
        return true;
    }
}

return false;