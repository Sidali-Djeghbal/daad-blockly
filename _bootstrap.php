<?php
declare(strict_types=1); // preventing workspace errors
session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Lax']);

// preventing xss
function h(string $v): string { return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function appBasePath(): string {
    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
    $basePath = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
    return $basePath === '/' ? '' : $basePath;
}
function appUrl(string $path = '/'): string {
    if ($path === '') {
        $path = '/';
    }
    if (preg_match('#^[a-z][a-z0-9+.-]*://#i', $path)) {
        return $path;
    }
    if ($path[0] !== '/') {
        $path = '/' . $path;
    }
    return appBasePath() . $path;
}
function redirect(string $path): void { 
    header('Location: ' . appUrl($path)); 
    exit; // exit directly := prevent connection interception 
}
function jsonResp(array $data, int $code = 200): void { http_response_code($code); header('Content-Type: application/json'); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
function csrf(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

// accept request from our website only
function requireCsrf(): void {
    $t = $_POST['csrf'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!hash_equals($_SESSION['csrf'] ?? '', $t)) { http_response_code(403); exit; }
}

// Aliases
function csrf_token(): string { return csrf(); }
function require_csrf(): void { requireCsrf(); }
function require_login(): array { return requireLogin(); }
function current_user(): ?array { return currentUser(); }
function login_user(int $id): void { loginUser($id); }
function logout_user(): void { logoutUser(); }
function workspace_load(int $id): string { return loadWorkspace($id); }
function workspace_save(int $id, string $json): void { saveWorkspace($id, $json); }
function json_response(array $data, int $code = 200): void { jsonResp($data, $code); }
function run_daad_code(string $code): array { return runDaad($code); }

function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $host = getenv('MYSQL_HOST') ?: getenv('DB_HOST') ?: 'localhost';
        $port = getenv('MYSQL_PORT') ?: getenv('DB_PORT') ?: '3306';
        $user = getenv('MYSQL_USER') ?: getenv('DB_USER') ?: 'root';
        $pass = getenv('MYSQL_PASSWORD') ?: getenv('DB_PASS') ?: '';
        $name = getenv('MYSQL_DATABASE') ?: getenv('DB_NAME') ?: 'daad_app';
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

function currentUser(): ?array {
    $id = $_SESSION['user_id'] ?? 0;
    if (!$id) return null;
    $stmt = db()->prepare('SELECT id, username FROM users WHERE id = ?');
    $stmt->execute([$id]);
    return $stmt->fetch() ?: null;
}

function requireLogin(): array {
    $u = currentUser();
    if (!$u) redirect('/login.php');
    return $u;
}

function loginUser(int $id): void { session_regenerate_id(true); $_SESSION['user_id'] = $id; }
function registerUser(string $username, string $password): int {
    $stmt = db()->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
    return (int) db()->lastInsertId();
}
function logoutUser(): void { session_destroy(); }

// TODO: beta usage - saving on every tiny block move is bad for DB performance. 
// suggestion: implement 'debouncing' in frontend JS (save only after 2 seconds of inactivity) 
// or i will use a manual "Save Project" button.
function saveWorkspace(int $uid, string $json): void {
    if (strlen($json) > 500000) throw new RuntimeException('Too large');
    db()->prepare('INSERT INTO workspaces (user_id, json, updated_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE json = VALUES(json), updated_at = NOW()')->execute([$uid, $json]);
}

function loadWorkspace(int $uid): string {
    $stmt = db()->prepare('SELECT json FROM workspaces WHERE user_id = ?');
    $stmt->execute([$uid]);
    $row = $stmt->fetch();
    return $row['json'] ?? '';
}

function runDaad(string $code, array $inputData = []): array {
    $bin = realpath(__DIR__ . '/bin/daad');

    if (!$bin || !is_executable($bin)) throw new RuntimeException('DAAD binary not found');

    $tmp = tempnam(sys_get_temp_dir(), 'daad_'); // just a tmp file (code of user).. 
    file_put_contents($tmp, $code);
    
    // EXPERIMENTAL: terminal I/O simulation. 
    // this handles user inputs fed into the DAAD script.
    // our frontend currently lacks an interactive terminal UI, so this will be fully implemented later.
    $inputFile = null;
    if (!empty($inputData)) {
        $inputFile = tempnam(sys_get_temp_dir(), 'daad_input_');
        file_put_contents($inputFile, implode("\n", $inputData) . "\n");
    }

    $env = [];
    $cmd = [$bin, $tmp]; // May cause risk !! we need docker container sandbox later..
    if ($inputFile) {
        $cmd[] = '-i';
        $cmd[] = $inputFile;
        $env["DAAD_INPUT"] = $inputFile;
    }
    
    // todo : sandboxing : unsafe adi !! 
    $descriptors = [['pipe','r'], ['pipe','w'], ['pipe','w']]; 
    $proc = proc_open($cmd, $descriptors, $pipes, null, $env ?: null);
    fclose($pipes[0]);
    stream_set_blocking($pipes[1], false);
    stream_set_blocking($pipes[2], false);

    $start = microtime(true);
    $timeout = 3.0; // preventing infinite loops (app runs only for 3s) 
    $stdout = $stderr = '';
    $exitCode = 0;

    // TODO: the $stderr output currently returns raw compiler errors. 
    // Needs optimization to parse the error and make it user-friendly/human-readable for beginners.

    while (true) {
        $stdout .= stream_get_contents($pipes[1]);
        $stderr .= stream_get_contents($pipes[2]);
        $st = proc_get_status($proc);
        if (!$st['running']) { $exitCode = $st['exitcode']; break; }
        if ((microtime(true) - $start) > $timeout) { proc_terminate($proc, 9); $exitCode = 124; $stderr .= "\n[Timeout]"; break; }
        usleep(10000); // give a rest to cpu.
    }

    $stdout .= stream_get_contents($pipes[1]);
    $stderr .= stream_get_contents($pipes[2]);
    proc_close($proc);
    @unlink($tmp); // remove tmp files..
    if ($inputFile) @unlink($inputFile);
    return [$stdout, $stderr, $exitCode];
}