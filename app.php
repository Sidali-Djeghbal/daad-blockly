<?php
require __DIR__ . '/_bootstrap.php';
$user = requireLogin();
$workspaceJson = loadWorkspace((int) $user['id']);
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>لغة ضاد</title>
  <link rel="stylesheet" href="/daad/assets/css/app.css" />
</head>
<body>
  <header class="topbar">
    <strong>لغة ضاد</strong>
    <div class="user-info">
      <span class="muted"><?=h($user['username'])?></span>
      <form method="post" action="/daad/logout.php">
        <input type="hidden" name="csrf" value="<?=csrf()?>" />
        <input type="hidden" name="workspace_json" id="logoutData" value="" />
        <button class="btn btn-secondary" type="submit">خروج</button>
      </form>
    </div>
  </header>

  <main class="main-container">
    <section class="blockly-section">
      <div id="blocklyDiv"></div>
    </section>
    <section class="workspace-section">
      <div class="workspace-header row space-between">
        <h2>المحاكاة</h2>
        <span id="saveStatus" class="muted">تم الحفظ</span>
      </div>
      <button id="runBtn" class="btn">تشغيل</button>
      <div id="errorIndicator" class="error-indicator" style="display:none"></div>
      <div class="workspace-split">
        <div class="code-area">
          <h3>كود</h3>
          <textarea id="codeBox"></textarea>
        </div>
        <div class="output-area">
          <h3>مخرجات</h3>
          <pre id="outBox" class="output"></pre>
        </div>
      </div>
    </section>
  </main>

  <script src="https://unpkg.com/blockly/blockly.min.js"></script>
  <script src="/daad/assets/js/blocks/io.js"></script>
  <script src="/daad/assets/js/blocks/math.js"></script>
  <script src="/daad/assets/js/blocks/variables.js"></script>
  <script src="/daad/assets/js/blocks/logic.js"></script>
  <script src="/daad/assets/js/blocks/lists.js"></script>
  <script src="/daad/assets/js/blocks/control.js"></script>
  <script src="/daad/assets/js/blocks/functions.js"></script>
  <script src="/daad/assets/js/blocks/toolbox.js"></script>
  <script src="/daad/assets/js/generator/index.js"></script>
  <script>window.DAAD_APP={csrf:'<?=csrf()?>',json:<?=json_encode($workspaceJson,JSON_UNESCAPED_UNICODE)?>};</script>
  <script src="/daad/assets/js/app.js"></script>
</body>
</html>