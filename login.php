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

    if (!$username || !$password) {
        $errors[] = 'الاسم وكلمة المرور مطلوبان';
    } else {
        $stmt = db()->prepare('SELECT id, password_hash FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        if (!$row || !password_verify($password, $row['password_hash'])) {
            $errors[] = 'بيانات الدخول غير صحيحة';
        } else {
            loginUser((int) $row['id']);
            redirect('/daad/app.php');
        }
    }
}
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>دخول - لغة ضاد</title>
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
        <h2>مرحباً بعودتك</h2>
        <p>ادخل بياناتك للمتابعة</p>
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
          <input type="text" id="username" name="username" required value="<?=h($username)?>" placeholder="ادخل اسم المستخدم" />
        </div>

        <div class="form-group">
          <label for="password">
            كلمة المرور
          </label>
          <input type="password" id="password" name="password" required placeholder="ادخل كلمة المرور" />
        </div>

        <button type="submit" class="btn btn-primary">
          <span>تسجيل دخول</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>ليس لديك حساب؟</p>
        <a href="/daad/register.php" class="link-btn">أنشئ حساب جديد</a>
      </div>
    </div>
  </div>
</body>
</html>