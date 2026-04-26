<?php
require __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'run') {
    requireCsrf();
    requireLogin();
    $data = json_decode(file_get_contents('php://input'), true);
    $code = $data['code'] ?? '';
    $inputData = $data['input'] ?? [];
    try {
        [$stdout, $stderr, $exit] = runDaad($code, $inputData);
        jsonResp(['ok' => true, 'stdout' => $stdout, 'stderr' => $stderr, 'exit' => $exit]);
    } catch (Throwable $e) {
        jsonResp(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

if ($method === 'POST' && $action === 'save') {
    requireCsrf();
    $user = requireLogin();
    $data = json_decode(file_get_contents('php://input'), true);
    $json = $data['json'] ?? '';
    try {
        saveWorkspace((int) $user['id'], $json);
        jsonResp(['ok' => true]);
    } catch (Throwable $e) {
        jsonResp(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

http_response_code(404);
echo 'Not found';