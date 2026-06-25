(function() {
  'use strict';

  var api = window.DaadAPI;
  if (!api) {
    document.body.textContent = 'Error: DaadAPI not available (run in Electron)';
    return;
  }

  var codeBox = document.getElementById('codeBox');
  var outBox = document.getElementById('outBox');
  var inputBox = document.getElementById('inputBox');
  var sendInputBtn = document.getElementById('sendInputBtn');
  var runBtn = document.getElementById('runBtn');
  var saveBtn = document.getElementById('saveBtn');
  var saveAsBtn = document.getElementById('saveAsBtn');
  var openBtn = document.getElementById('openBtn');
  var saveStatus = document.getElementById('saveStatus');
  var errorIndicator = document.getElementById('errorIndicator');
  var fileInfo = document.getElementById('fileInfo');
  var inputArea = document.getElementById('inputArea');

  if (!codeBox || !outBox || !runBtn) {
    document.body.textContent = 'Error: UI elements missing';
    return;
  }

  var workspace;
  var isInitialLoad = true;
  var currentFilePath = '';
  var isRunning = false;
  var currentExecId = null;

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

  function hasInputBlocks() {
    if (!workspace) return false;
    var blocks = workspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'daad_input') return true;
    }
    return false;
  }

  function updateInputVisibility() {
    if (!inputArea) return;
    inputArea.style.display = hasInputBlocks() ? '' : 'none';
  }

  function updateCode() {
    if (!workspace) return;
    try {
      codeBox.value = Blockly.Daad.workspaceToCode(workspace);
    } catch (e) {
      codeBox.value = 'Error: ' + e.message;
    }
    updateInputVisibility();
  }

  function getWorkspaceJson() {
    if (!workspace) return '';
    try {
      return JSON.stringify(Blockly.serialization.workspaces.save(workspace));
    } catch (e) {
      console.warn('serialization error:', e);
      return '';
    }
  }

  function setRunningState(running) {
    isRunning = running;
    if (running) {
      runBtn.textContent = 'إيقاف';
      runBtn.className = 'btn btn-danger';
      if (sendInputBtn) {
        sendInputBtn.disabled = false;
        sendInputBtn.classList.add('btn-send-active');
      }
    } else {
      runBtn.textContent = 'تشغيل';
      runBtn.className = 'btn';
      if (sendInputBtn) {
        sendInputBtn.disabled = true;
        sendInputBtn.classList.remove('btn-send-active');
      }
    }
  }

  async function sendInput() {
    if (!currentExecId || !inputBox) return;
    var text = inputBox.value;
    if (!text) return;
    try {
      await api.sendStdin(currentExecId, text + '\n');
      inputBox.value = '';
    } catch (e) {
      showError(e.message);
    }
  }

  async function doRun() {
    if (isRunning) {
      try {
        await api.stopExecution(currentExecId);
      } catch (e) {
        showError(e.message);
      }
      return;
    }

    currentExecId = null;
    setRunningState(true);
    outBox.textContent = '';
    if (errorIndicator) errorIndicator.style.display = 'none';

    try {
      var input = inputBox ? inputBox.value : '';
      var result = await api.runCode(codeBox.value, input);
      if (!result.ok) {
        showError(result.error || 'فشل بدء التنفيذ');
        setRunningState(false);
        return;
      }
      currentExecId = result.execId;
      if (inputBox) inputBox.value = '';
    } catch (e) {
      showError(e.message || 'فشل بدء التنفيذ');
      setRunningState(false);
    }
  }

  function handleOutput(data) {
    if (data.execId !== currentExecId) return;

    if (data.done) {
      currentExecId = null;
      setRunningState(false);
      if (data.ok) {
        if (data.stdout !== undefined) outBox.textContent = data.stdout;
        if (data.stderr) showError(data.stderr);
      } else {
        showError(data.error || 'فشل التنفيذ');
        if (data.stdout) outBox.textContent = data.stdout;
      }
      return;
    }

    if (data.stdout) outBox.textContent += data.stdout;
    if (data.stderr) showError(data.stderr);
  }

  async function doSave() {
    var json = getWorkspaceJson();
    if (!json) return;
    setStatus('جاري...');
    try {
      var result = await api.saveWorkspace(json);
      if (result.ok) {
        currentFilePath = result.path;
        setStatus('تم الحفظ');
        updateFileInfo();
      } else {
        setStatus('فشل');
        showError(result.error || 'فشل الحفظ');
      }
    } catch (e) {
      setStatus('فشل');
      showError(e.message);
    }
  }

  async function doSaveAs() {
    var json = getWorkspaceJson();
    if (!json) return;
    try {
      var result = await api.saveWorkspaceAs(json);
      if (result.ok) {
        currentFilePath = result.path;
        setStatus('تم الحفظ');
        updateFileInfo();
      } else if (!result.canceled) {
        showError(result.error || 'فشل الحفظ');
      }
    } catch (e) {
      showError(e.message);
    }
  }

  async function doOpen() {
    try {
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
    } catch (e) {
      showError(e.message);
    }
  }

  async function loadSavedWorkspace() {
    try {
      var result = await api.loadWorkspace();
      if (result.ok && result.json) {
        try {
          var state = JSON.parse(result.json);
          Blockly.serialization.workspaces.load(state, workspace);
        } catch (e) {
          console.warn('Failed to load workspace:', e);
        }
      }
    } catch (e) {
      console.warn('Failed to load workspace:', e);
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
    style.textContent = [
      '#blocklyDiv .blocklyToolboxDiv { left: auto; right: 0; }',
      '#blocklyDiv .blocklyToolboxCategory { direction: rtl; }',
      '#blocklyDiv .fieldInput > input { direction: ltr; text-align: left; }'
    ].join('\n');
    var existing = document.getElementById('blockly-rtl-fix');
    if (existing) existing.remove();
    style.id = 'blockly-rtl-fix';
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

    if (api.onOutput) api.onOutput(handleOutput);
    runBtn.addEventListener('click', doRun);
    if (sendInputBtn) sendInputBtn.addEventListener('click', sendInput);
    if (saveBtn) saveBtn.addEventListener('click', doSave);
    if (saveAsBtn) saveAsBtn.addEventListener('click', doSaveAs);
    if (openBtn) openBtn.addEventListener('click', doOpen);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
