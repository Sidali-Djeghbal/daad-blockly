/* global Blockly */

(function() {
  'use strict';

  var cfg = window.DAAD_APP || {};
  var codeBox = document.getElementById('codeBox');
  var outBox = document.getElementById('outBox');
  var runBtn = document.getElementById('runBtn');
  var saveStatus = document.getElementById('saveStatus');
  var logoutData = document.getElementById('logoutData');
  var errorIndicator = document.getElementById('errorIndicator');

  var workspace;
  var lastJson = '';
  var isInitialLoad = true;
  var saveTimer;

  // HTTP
  function post(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': cfg.csrf
      },
      body: JSON.stringify(data)
    }).then(function(res) {
      return res.json().then(function(json) {
        if (!res.ok || !json.ok) throw new Error(json.error || 'Error');
        return json;
      });
    });
  }

  // UI helpers
  function setStatus(txt) {
    if (saveStatus) saveStatus.textContent = txt;
  }

  function showError(msg) {
    if (errorIndicator) {
      errorIndicator.textContent = msg;
      errorIndicator.style.display = 'block';
      setTimeout(function() { errorIndicator.style.display = 'none'; }, 5000);
    }
  }

  // Code generation
  function updateCode() {
    try {
      codeBox.value = Blockly.Daad.workspaceToCode(workspace);
    } catch(e) {
      codeBox.value = e;
    }
  }

  // JSON serialization
  function syncJson() {
    try {
      lastJson = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
      if (logoutData) logoutData.value = lastJson;
    } catch(e) { console.warn('syncJson error:', e); }
  }

  // Save with debounce
  function scheduleSave() {
    clearTimeout(saveTimer);
    setStatus('جاري...');
    saveTimer = setTimeout(function() {
      syncJson();
      if (!lastJson || !lastJson.trim()) {
        setStatus('تم');
        return;
      }
      post('api.php?action=save', { json: lastJson })
        .then(function() { setStatus('تم'); })
        .catch(function(e) {
          console.error('Save failed:', e);
          setStatus('فشل');
        });
    }, 800);
  }

  // Load workspace from DB
  function loadWorkspaceFromDb() {
    if (cfg.json && cfg.json.trim()) {
      try {
        var state = JSON.parse(cfg.json);
        Blockly.serialization.workspaces.load(state, workspace);
      } catch(e) { console.error('Failed to load workspace:', e); }
    }
    updateCode();
    syncJson();
    setStatus('تم');
    isInitialLoad = false;
  }

  // Run code
  function runCode() {
    runBtn.disabled = true;
    outBox.textContent = '';
    if (errorIndicator) errorIndicator.style.display = 'none';

    post('api.php?action=run', { code: codeBox.value })
      .then(function(r) {
        outBox.textContent = r.stdout;
        if (r.stderr) showError(r.stderr);
      })
      .catch(function(e) { showError(e.message); })
      .finally(function() { runBtn.disabled = false; });
  }

  // Fix bracket mirroring in Blockly - apply after workspace is rendered
  function applyBlocklyRTLFix() {
    var style = document.createElement('style');
    style.id = 'blockly-rtl-fix';
    style.textContent = `
      #blocklyDiv text,
      #blocklyDiv .blocklyText {
        direction: ltr !important;
        unicode-bidi: embed !important;
        text-anchor: start !important;
      }
      #blocklyDiv .fieldInput > input {
        direction: ltr;
        text-align: left;
      }
    `;
    var existing = document.getElementById('blockly-rtl-fix');
    if (existing) existing.remove();
    document.head.appendChild(style);
  }

  // Initialize
  function init() {
    workspace = Blockly.inject('blocklyDiv', {
      toolbox: window.DAAD_TOOLBOX,
      rtl: true,
      trashcan: true
    });

    // Apply RTL fix after blocks render
    setTimeout(applyBlocklyRTLFix, 300);
    workspace.addChangeListener(function() {
      applyBlocklyRTLFix();
    });

    // Load saved workspace
    loadWorkspaceFromDb();

    // Workspace changes
    workspace.addChangeListener(function(e) {
      if (e && e.isUiEvent) return;
      if (isInitialLoad) {
        updateCode();
        syncJson();
        return;
      }
      updateCode();
      syncJson();
      scheduleSave();
    });

    // Run button
    runBtn.addEventListener('click', runCode);

    // Codebox changes
    codeBox.addEventListener('input', function() {
      syncJson();
      scheduleSave();
    });
  }

  // Start
  init();
})();