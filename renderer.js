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

  function init() {
    var daadTheme = Blockly.Theme.defineTheme('daad', {
      componentStyles: {
        toolboxBackgroundColour: '#f8fafc',
        toolboxForegroundColour: '#1e293b',
        flyoutBackgroundColour: '#fafafa',
        flyoutForegroundColour: '#1e293b',
        flyoutOpacity: 1,
        scrollbarColour: '#cbd5e1',
        scrollbarOpacity: 0.4,
      },
      fontStyle: {
        family: 'system-ui, -apple-system, sans-serif',
        weight: '500',
      },
    });

    workspace = Blockly.inject('blocklyDiv', {
      toolbox: window.DAAD_TOOLBOX,
      rtl: true,
      trashcan: true,
      theme: daadTheme,
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

    // Undo/Redo
    var undoBtn = document.getElementById('undoBtn');
    var redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.addEventListener('click', function() { workspace.undo(false); });
    if (redoBtn) redoBtn.addEventListener('click', function() { workspace.undo(true); });
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        workspace.undo(false);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        workspace.undo(true);
      }
      var inEditableField = e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && !inEditableField) {
        e.preventDefault();
        doSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o' && !inEditableField) {
        e.preventDefault();
        doOpen();
      }
    });

    // Examples dropdown
    var examplesBtn = document.getElementById('examplesBtn');
    var examplesMenu = document.getElementById('examplesMenu');
    if (examplesBtn && examplesMenu) {
      var updateExamplesExpanded = function() {
        examplesBtn.setAttribute('aria-expanded', examplesMenu.classList.contains('open'));
      };
      examplesBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var willOpen = !examplesMenu.classList.contains('open');
        examplesMenu.classList.toggle('open', willOpen);
        updateExamplesExpanded();
        if (willOpen) {
          var firstItem = examplesMenu.querySelector('.dropdown-item');
          if (firstItem) firstItem.focus();
        }
      });
      examplesBtn.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          examplesMenu.classList.add('open');
          updateExamplesExpanded();
          var firstItem = examplesMenu.querySelector('.dropdown-item');
          if (firstItem) firstItem.focus();
        }
      });
      examplesMenu.addEventListener('keydown', function(e) {
        var items = Array.prototype.slice.call(examplesMenu.querySelectorAll('.dropdown-item'));
        var idx = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(idx + 1) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          examplesMenu.classList.remove('open');
          updateExamplesExpanded();
          examplesBtn.focus();
        }
      });
      examplesMenu.querySelectorAll('.dropdown-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var key = item.getAttribute('data-example');
          if (confirm('تحميل المثال سيزيل الكتل الحالية. هل تتابع؟')) {
            try {
              workspace.clear();
              var ex = window.DAAD_EXAMPLES_XML && window.DAAD_EXAMPLES_XML[key];
              if (!ex) return;
              var parser = new DOMParser();
              var xmlDom = parser.parseFromString(ex.xml, 'text/xml');
              var parseErr = xmlDom.querySelector('parsererror');
              if (parseErr) { alert('خطأ في XML: ' + parseErr.textContent); return; }
              Blockly.Xml.domToWorkspace(xmlDom.documentElement, workspace);
              updateCode();
            } catch (err) {
              console.error('Example load error:', err);
              alert('خطأ في تحميل المثال: ' + err.message);
            }
          }
          examplesMenu.classList.remove('open');
          updateExamplesExpanded();
        });
      });
      document.addEventListener('click', function() {
        if (examplesMenu.classList.contains('open')) {
          examplesMenu.classList.remove('open');
          updateExamplesExpanded();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
