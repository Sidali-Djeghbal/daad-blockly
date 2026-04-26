<?php
require __DIR__ . '/_bootstrap.php';
$user = currentUser();
if ($user) redirect('/daad/app.php');

$errors = [];
$username = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireCsrf();
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (strlen($username) < 3 || strlen($username) > 32) $errors[] = 'اسم المستخدم 3-32 حرف';
    if (!preg_match('/^[A-Za-z0-9_]+$/', $username)) $errors[] = 'اسم المستخدم أحرف وأرقام فقط';
    if (strlen($password) < 6) $errors[] = 'كلمة المرور 6 أحرف';

    if (!$errors) {
        try {
            db()->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
            $id = (int) db()->lastInsertId();
            loginUser($id);
            redirect('/daad/app.php');
        } catch (PDOException $e) {
            $errors[] = 'الاسم مستخدم';
        }
    }
}
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>تسجيل - لغة ضاد</title>
  <link rel="stylesheet" href="/daad/assets/css/auth.css" />
</head>
<body>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-logo">
        <div class="logo-icon">
          <img src="/daad/assets/img/logo-dark.svg" alt="logo">
        </div>
        <h1>لغة ضاد</h1>
        <p>تعلّم البرمجة بالعربية</p>
      </div>

      <div class="auth-title">
        <h2>أنشئ حسابك</h2>
        <p>ابدأ رحلتك في البرمجة</p>
      </div>

      <?php if ($errors): ?>
        <div class="auth-errors">
          <?php foreach($errors as $e): ?>
            <div class="error-item"><?=h($e)?></div>
          <?php endforeach?>
        </div>
      <?php endif ?>

      <form class="auth-form" method="post" autocomplete="off">
        <input type="hidden" name="csrf" value="<?=csrf()?>" />

        <div class="form-group">
          <label for="username">
            اسم المستخدم
          </label>
          <input type="text" id="username" name="username" required minlength="3" maxlength="32" value="<?=h($username)?>" placeholder="اختر اسماً فريداً" />
        </div>

        <div class="form-group">
          <label for="password">
            كلمة المرور
          </label>
          <input type="password" id="password" name="password" required minlength="6" placeholder="6 أحرف على الأقل" />
        </div>

        <button type="submit" class="btn btn-primary">
          <span>إنشاء حساب</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>لديك حساب بالفعل؟</p>
        <a href="/daad/login.php" class="link-btn">سجل دخول</a>
      </div>
    </div>
  </div>
</body>
</html>