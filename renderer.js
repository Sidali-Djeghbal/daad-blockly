(function() {
  'use strict';

  var api = window.DaadAPI;
  if (!api) {
    document.body.textContent = 'Error: DaadAPI not available (run in Electron)';
    return;
  }

  var codeBox = document.getElementById('codeBox');
  var outBox = document.getElementById('outBox');
  var runBtn = document.getElementById('runBtn');
  var saveBtn = document.getElementById('saveBtn');
  var saveAsBtn = document.getElementById('saveAsBtn');
  var openBtn = document.getElementById('openBtn');
  var saveStatus = document.getElementById('saveStatus');
  var errorIndicator = document.getElementById('errorIndicator');
  var fileInfo = document.getElementById('fileInfo');

  var workspace;
  var isInitialLoad = true;
  var currentFilePath = '';

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

  function updateCode() {
    try {
      codeBox.value = Blockly.Daad.workspaceToCode(workspace);
    } catch (e) {
      codeBox.value = 'Error: ' + e.message;
    }
  }

  function getWorkspaceJson() {
    try {
      return JSON.stringify(Blockly.serialization.workspaces.save(workspace));
    } catch (e) {
      console.warn('serialization error:', e);
      return '';
    }
  }

  async function doSave() {
    var json = getWorkspaceJson();
    if (!json) return;
    setStatus('جاري...');
    var result = await api.saveWorkspace(json);
    if (result.ok) {
      currentFilePath = result.path;
      setStatus('تم الحفظ');
      updateFileInfo();
    } else {
      setStatus('فشل');
      showError(result.error || 'فشل الحفظ');
    }
  }

  async function doSaveAs() {
    var json = getWorkspaceJson();
    if (!json) return;
    var result = await api.saveWorkspaceAs(json);
    if (result.ok) {
      currentFilePath = result.path;
      setStatus('تم الحفظ');
      updateFileInfo();
    } else if (!result.canceled) {
      showError(result.error || 'فشل الحفظ');
    }
  }

  async function doOpen() {
    var result = await api.openWorkspace();
    if (result.ok && result.json) {
      try {
        var state = JSON.parse(result.json);
        Blockly.serialization.workspaces.load(state, workspace);
        currentFilePath = result.path || '';
        setStatus('تم الفتح');
        updateFileInfo();
        updateCode();
      } catch (e) {
        showError('فشل فتح الملف: ' + e.message);
      }
    } else if (!result.canceled) {
      showError(result.error || 'فشل الفتح');
    }
  }

  async function doRun() {
    runBtn.disabled = true;
    outBox.textContent = '';
    if (errorIndicator) errorIndicator.style.display = 'none';

    var result = await api.runCode(codeBox.value);
    if (result.ok) {
      outBox.textContent = result.stdout;
      if (result.stderr) showError(result.stderr);
    } else {
      showError(result.error || 'فشل التنفيذ');
    }
    runBtn.disabled = false;
  }

  async function loadSavedWorkspace() {
    var result = await api.loadWorkspace();
    if (result.ok && result.json) {
      try {
        var state = JSON.parse(result.json);
        Blockly.serialization.workspaces.load(state, workspace);
      } catch (e) {
        console.warn('Failed to load workspace:', e);
      }
    }
    updateCode();
    setStatus('');
    isInitialLoad = false;
  }

  function updateFileInfo() {
    if (fileInfo) {
      if (currentFilePath) {
        var parts = currentFilePath.replace(/\\/g, '/').split('/');
        fileInfo.textContent = parts[parts.length - 1];
      } else {
        fileInfo.textContent = 'workspace.json';
      }
    }
  }

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

  function init() {
    workspace = Blockly.inject('blocklyDiv', {
      toolbox: window.DAAD_TOOLBOX,
      rtl: true,
      trashcan: true
    });

    setTimeout(applyBlocklyRTLFix, 300);
    workspace.addChangeListener(function() {
      applyBlocklyRTLFix();
    });

    loadSavedWorkspace();

    workspace.addChangeListener(function(e) {
      if (e && e.isUiEvent) return;
      updateCode();
    });

    runBtn.addEventListener('click', doRun);
    saveBtn.addEventListener('click', doSave);
    saveAsBtn.addEventListener('click', doSaveAs);
    openBtn.addEventListener('click', doOpen);
  }

  init();
})();
