<?php
require __DIR__ . '/_bootstrap.php';
$user = currentUser();
if ($user) redirect('/daad/app.php');
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>لغة ضاد - البرمجة بالعربية</title>
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
      <p style="text-align: center; color: var(--text-light); margin: 20px 0;">
        ابدأ رحلتك في البرمجة بسهولة مع لغة ضاد
      </p>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 20px;">
        <a href="/daad/login.php" class="link-btn" style="text-align: center;">تسجيل دخول</a>
      </div>
    </div>
  </div>
</body>
</html>