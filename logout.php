<?php
require __DIR__ . '/_bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$user = requireLogin();
requireCsrf();
if (!empty($_POST['workspace_json'])) saveWorkspace((int) $user['id'], $_POST['workspace_json']);
logoutUser();
redirect('/');