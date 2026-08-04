// Pure application logic for the Daad Blockly renderer, extracted from
// renderer.js so it can be unit-tested in jsdom with a stubbed `api` and
// without loading Blockly or Electron's preload bridge.
//
// Usage (in renderer.js):
//   var app = new window.DaadApp({
//     api: window.DaadAPI,           // preload bridge (runCode, sendStdin, ...)
//     getCode: function() { return codeBox.value; },
//     getInput: function() { return inputBox ? inputBox.value : ''; },
//     ...
//   });
//   app.loadSaved(); app.wireOutput();
//   runBtn.addEventListener('click', app.run);
//
// No reference to Blockly, document, or window is made here. All DOM/Blockly
// access is funnelled through the opts callbacks so the same module runs in
// jsdom tests against a fake api.

(function(global) {
  'use strict';

  function DaadApp(opts) {
    if (!opts || !opts.api) {
      throw new Error('DaadApp: opts.api is required');
    }
    this.api = opts.api;

    // DOM/workspace accessors (all optional with safe fallbacks)
    this.getCode = opts.getCode || function() { return ''; };
    this.clearInput = opts.clearInput || function() {};
    this.setOutput = opts.setOutput || function() {};
    this.appendOutput = opts.appendOutput ||
      (function(s) { var cur = this.getOutput(); this.setOutput(cur + s); }).bind(this);
    this.getOutput = opts.getOutput || function() { return ''; };
    this.setStatus = opts.setStatus || function() {};
    this.showError = opts.showError || function() {};
    this.hideError = opts.hideError || function() {};
    this.setRunning = opts.setRunning || function() {};
    this.getInput = opts.getInput || function() { return ''; };
    this.hasInputBlock = opts.hasInputBlock || function() { return false; };
    this.setInputVisible = opts.setInputVisible || function() {};
    this.getWorkspaceJson = opts.getWorkspaceJson || function() { return ''; };
    this.loadWorkspaceState = opts.loadWorkspaceState || function() {};
    this.setFilePath = opts.setFilePath || function() {};

    // Internal state
    this.currentFilePath = '';
    this.isRunning = false;
    this.currentExecId = null;
  }

  DaadApp.prototype.updateInputVisibility = function() {
    this.setInputVisible(this.hasInputBlock());
  };

  // Run / stop. Toggles based on current run state.
  DaadApp.prototype.run = function() {
    if (this.isRunning) {
      return this.stop();
    }
    return this._startRun();
  };

  DaadApp.prototype._startRun = async function() {
    this.currentExecId = null;
    this.setRunning(true);
    this.isRunning = true;
    this.setOutput('');
    this.hideError();

    try {
      var input = this.getInput();
      var result = await this.api.runCode(this.getCode(), input);
      if (!result.ok) {
        this.showError(result.error || 'فشل بدء التنفيذ');
        this._setRunning(false);
        return;
      }
      this.currentExecId = result.execId;
      this.clearInput();
    } catch (e) {
      this.showError(e.message || 'فشل بدء التنفيذ');
      this._setRunning(false);
    }
  };

  DaadApp.prototype.stop = async function() {
    try {
      await this.api.stopExecution(this.currentExecId);
    } catch (e) {
      this.showError(e.message);
    }
  };

  // Called by the api.onOutput subscription (registered via wireOutput).
  DaadApp.prototype.handleOutput = function(data) {
    if (data.execId !== this.currentExecId) return;

    if (data.done) {
      this.currentExecId = null;
      this._setRunning(false);
      if (data.ok) {
        if (data.stdout !== undefined) this.setOutput(data.stdout);
        if (data.stderr) this.showError(data.stderr);
      } else {
        this.showError(data.error || 'فشل التنفيذ');
        if (data.stdout) this.setOutput(data.stdout);
      }
      return;
    }

    if (data.stdout) this.appendOutput(data.stdout);
    if (data.stderr) this.showError(data.stderr);
  };

  DaadApp.prototype.wireOutput = function() {
    if (this.api.onOutput) this.api.onOutput(this.handleOutput.bind(this));
  };

  DaadApp.prototype.sendInput = async function() {
    if (!this.currentExecId) return;
    var text = this.getInput();
    if (!text) return;
    try {
      await this.api.sendStdin(this.currentExecId, text + '\n');
      this.clearInput();
    } catch (e) {
      this.showError(e.message);
    }
  };

  DaadApp.prototype.save = async function() {
    var json = this.getWorkspaceJson();
    if (!json) return;
    this.setStatus('جاري...');
    try {
      var result = await this.api.saveWorkspace(json);
      if (result.ok) {
        this.currentFilePath = result.path;
        this.setStatus('تم الحفظ');
        this.setFilePath(result.path);
      } else {
        this.setStatus('فشل');
        this.showError(result.error || 'فشل الحفظ');
      }
    } catch (e) {
      this.setStatus('فشل');
      this.showError(e.message);
    }
  };

  DaadApp.prototype.saveAs = async function() {
    var json = this.getWorkspaceJson();
    if (!json) return;
    try {
      var result = await this.api.saveWorkspaceAs(json);
      if (result.ok) {
        this.currentFilePath = result.path;
        this.setStatus('تم الحفظ');
        this.setFilePath(result.path);
      } else if (!result.canceled) {
        this.showError(result.error || 'فشل الحفظ');
      }
    } catch (e) {
      this.showError(e.message);
    }
  };

  DaadApp.prototype.open = async function() {
    try {
      var result = await this.api.openWorkspace();
      if (result.ok && result.json) {
        try {
          var state = JSON.parse(result.json);
          this.loadWorkspaceState(state);
          this.currentFilePath = result.path || '';
          this.setStatus('تم الفتح');
          this.setFilePath(this.currentFilePath);
        } catch (e) {
          this.showError('فشل فتح الملف: ' + e.message);
        }
      } else if (!result.canceled) {
        this.showError(result.error || 'فشل الفتح');
      }
    } catch (e) {
      this.showError(e.message);
    }
  };

  // Loads previously saved workspace.json from userData on startup.
  // Returns nothing; callers may chain a code-refresh afterwards.
  DaadApp.prototype.loadSaved = async function() {
    try {
      var result = await this.api.loadWorkspace();
      if (result.ok && result.json) {
        try {
          var state = JSON.parse(result.json);
          this.loadWorkspaceState(state);
        } catch (e) {
          // Swallow parse errors — a fresh workspace is fine.
          if (typeof console !== 'undefined' && console.warn) {
            console.warn('Failed to load workspace:', e);
          }
        }
      }
    } catch (e) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Failed to load workspace:', e);
      }
    }
    this.setStatus('');
  };

  DaadApp.prototype._setRunning = function(running) {
    this.isRunning = running;
    this.setRunning(running);
  };

  global.DaadApp = DaadApp;
})(typeof window !== 'undefined' ? window : this);