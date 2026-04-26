<?php
$uri = $_SERVER['REQUEST_URI'] ?? '/';
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