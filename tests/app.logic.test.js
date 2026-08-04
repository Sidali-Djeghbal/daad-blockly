import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logicSrc = fs.readFileSync(
  path.resolve(__dirname, '../assets/js/app/logic.js'),
  'utf8'
);
(0, eval)(logicSrc);

const DaadApp = window.DaadApp;

function makeApi(overrides) {
  return Object.assign({
    runCode: vi.fn().mockResolvedValue({ ok: true, execId: 'e1' }),
    sendStdin: vi.fn().mockResolvedValue({ ok: true }),
    stopExecution: vi.fn().mockResolvedValue({ ok: true }),
    saveWorkspace: vi.fn().mockResolvedValue({ ok: true, path: '/home/u/workspaces/workspace.json' }),
    saveWorkspaceAs: vi.fn().mockResolvedValue({ ok: true, path: '/home/u/foo.json' }),
    openWorkspace: vi.fn().mockResolvedValue({ ok: true, json: '{}', path: '/home/u/foo.json' }),
    loadWorkspace: vi.fn().mockResolvedValue({ ok: true, json: '' }),
    onOutput: vi.fn(),
  }, overrides);
}

function makeDoms() {
  const calls = { status: [], errors: [], hidden: 0, running: [], output: [], inputVisible: [], filePaths: [], loaded: [], inputCleared: 0 };
  const app = new DaadApp({
    api: makeApi(),
    getCode: () => 'اطبع("hi")',
    getInput: () => 'some input',
    clearInput: () => { calls.inputCleared++; },
    getOutput: () => calls.output.map(c => c).join(''),
    setOutput: (s) => { calls.output = [s]; },
    appendOutput: (s) => { calls.output.push(s); },
    setStatus: (s) => { calls.status.push(s); },
    showError: (m) => { calls.errors.push(m); },
    hideError: () => { calls.hidden++; },
    setRunning: (b) => { calls.running.push(b); },
    hasInputBlock: () => false,
    setInputVisible: (v) => { calls.inputVisible.push(v); },
    getWorkspaceJson: () => '{"blocks":{"blocks":[]}}',
    loadWorkspaceState: (state) => { calls.loaded.push(state); },
    setFilePath: (p) => { calls.filePaths.push(p); },
  });
  return { app, calls };
}

describe('DaadApp construction', () => {
  it('throws when opts.api missing', () => {
    expect(() => new DaadApp({})).toThrow('opts.api is required');
  });
  it('accepts minimal opts (api only) with fallback no-ops', () => {
    const app = new DaadApp({ api: makeApi() });
    expect(app.isRunning).toBe(false);
    expect(app.currentExecId).toBeNull();
  });
});

describe('run flow', () => {
  let app, calls;
  beforeEach(() => ({ app, calls } = makeDoms()));

  it('start: sets running, clears output, hides error, calls api.runCode', async () => {
    await app.run();
    expect(calls.running).toContain(true);
    expect(calls.hidden).toBe(1);
    expect(calls.output).toEqual(['']);
    expect(app.api.runCode).toHaveBeenCalledWith('اطبع("hi")', 'some input');
    expect(app.currentExecId).toBe('e1');
    expect(calls.inputCleared).toBe(1);
  });

  it('runCode failure -> showError + not running', async () => {
    app.api.runCode.mockResolvedValueOnce({ ok: false, error: 'boom' });
    await app.run();
    expect(calls.errors).toContain('boom');
    expect(calls.running).toContain(false);
    expect(app.currentExecId).toBeNull();
  });

  it('runCode throw -> showError + not running', async () => {
    app.api.runCode.mockRejectedValueOnce(new Error('net'));
    await app.run();
    expect(calls.errors).toContain('net');
    expect(calls.running).toContain(false);
  });

  it('stop: when running, calls api.stopExecution', async () => {
    await app.run();
    expect(app.isRunning).toBe(true);
    await app.run();
    expect(app.api.stopExecution).toHaveBeenCalledWith('e1');
  });
});

describe('handleOutput', () => {
  let app, calls;
  beforeEach(() => ({ app, calls } = makeDoms()));

  it('ignored when execId mismatch', () => {
    app.currentExecId = 'e1';
    app.handleOutput({ execId: 'other', stdout: 'x' });
    expect(calls.output).toEqual([]);
  });

  it('incremental stdout -> appendOutput', () => {
    app.currentExecId = 'e1';
    app.handleOutput({ execId: 'e1', stdout: 'partial' });
    expect(calls.output).toEqual(['partial']);
  });

  it('incremental stderr -> showError', () => {
    app.currentExecId = 'e1';
    app.handleOutput({ execId: 'e1', stderr: 'warn' });
    expect(calls.errors).toContain('warn');
  });

  it('done ok -> final stdout replaces, running false', () => {
    app.currentExecId = 'e1';
    app.handleOutput({ execId: 'e1', done: true, ok: true, stdout: 'final', stderr: '' });
    expect(calls.output).toEqual(['final']);
    expect(calls.running).toContain(false);
    expect(app.currentExecId).toBeNull();
  });

  it('done ok with stderr -> showError(stderr)', () => {
    app.currentExecId = 'e1';
    app.handleOutput({ execId: 'e1', done: true, ok: true, stdout: 'o', stderr: 'e' });
    expect(calls.errors).toContain('e');
  });

  it('done not ok -> showError(error) + stdout', () => {
    app.currentExecId = 'e1';
    app.handleOutput({ execId: 'e1', done: true, ok: false, error: 'fail', stdout: 'o' });
    expect(calls.errors).toContain('fail');
    expect(calls.output).toEqual(['o']);
    expect(app.currentExecId).toBeNull();
  });

  it('wireOutput registers handleOutput-bound callback via api.onOutput', () => {
    app.wireOutput();
    expect(app.api.onOutput).toHaveBeenCalledTimes(1);
    var cb = app.api.onOutput.mock.calls[0][0];
    expect(typeof cb).toBe('function');
    // The bound callback should forward to handleOutput.
    app.currentExecId = 'e1';
    cb({ execId: 'e1', stdout: 'forwarded' });
    expect(calls.output).toEqual(['forwarded']);
  });
});

describe('sendInput', () => {
  let app, calls;
  beforeEach(() => ({ app, calls } = makeDoms()));

  it('no-op when no current execId', async () => {
    await app.sendInput();
    expect(app.api.sendStdin).not.toHaveBeenCalled();
  });

  it('no-op when input empty', async () => {
    app.currentExecId = 'e1';
    app.getInput = () => '';
    await app.sendInput();
    expect(app.api.sendStdin).not.toHaveBeenCalled();
  });

  it('sends text + newline, clears input', async () => {
    app.currentExecId = 'e1';
    await app.sendInput();
    expect(app.api.sendStdin).toHaveBeenCalledWith('e1', 'some input\n');
    expect(calls.inputCleared).toBe(1);
  });

  it('sendStdin throw -> showError', async () => {
    app.currentExecId = 'e1';
    app.api.sendStdin.mockRejectedValueOnce(new Error('closed'));
    await app.sendInput();
    expect(calls.errors).toContain('closed');
  });
});

describe('save / saveAs / open / loadSaved', () => {
  let app, calls;
  beforeEach(() => ({ app, calls } = makeDoms()));

  it('save: no json -> no call', async () => {
    app.getWorkspaceJson = () => '';
    await app.save();
    expect(app.api.saveWorkspace).not.toHaveBeenCalled();
  });

  it('save ok -> status تم الحفظ, setFilePath, currentFilePath', async () => {
    await app.save();
    expect(calls.status).toContain('جاري...');
    expect(calls.status).toContain('تم الحفظ');
    expect(calls.filePaths).toContain('/home/u/workspaces/workspace.json');
    expect(app.currentFilePath).toBe('/home/u/workspaces/workspace.json');
  });

  it('save fail -> status فشل + showError', async () => {
    app.api.saveWorkspace.mockResolvedValueOnce({ ok: false, error: 'disk' });
    await app.save();
    expect(calls.status).toContain('فشل');
    expect(calls.errors).toContain('disk');
  });

  it('save throw -> status فشل + showError', async () => {
    app.api.saveWorkspace.mockRejectedValueOnce(new Error('io'));
    await app.save();
    expect(calls.status).toContain('فشل');
    expect(calls.errors).toContain('io');
  });

  it('saveAs ok -> setFilePath + status تم الحفظ', async () => {
    await app.saveAs();
    expect(calls.filePaths).toContain('/home/u/foo.json');
    expect(calls.status).toContain('تم الحفظ');
  });

  it('saveAs canceled -> no error, no status change', async () => {
    app.api.saveWorkspaceAs.mockResolvedValueOnce({ ok: false, canceled: true });
    await app.saveAs();
    expect(calls.errors).toEqual([]);
    expect(calls.status).not.toContain('فشل');
  });

  it('saveAs non-canceled fail -> showError', async () => {
    app.api.saveWorkspaceAs.mockResolvedValueOnce({ ok: false, error: 'x' });
    await app.saveAs();
    expect(calls.errors).toContain('x');
  });

  it('open ok -> loadWorkspaceState(parsed), setFilePath, status تم الفتح', async () => {
    app.api.openWorkspace.mockResolvedValueOnce({
      ok: true, json: '{"blocks":{"blocks":[]}}', path: '/home/u/bar.json',
    });
    await app.open();
    expect(calls.loaded).toEqual([{ blocks: { blocks: [] } }]);
    expect(calls.filePaths).toContain('/home/u/bar.json');
    expect(calls.status).toContain('تم الفتح');
  });

  it('open with invalid json -> showError فشل فتح الملف', async () => {
    app.api.openWorkspace.mockResolvedValueOnce({ ok: true, json: 'not-json', path: '' });
    await app.open();
    expect(calls.errors.some(m => m.startsWith('فشل فتح الملف'))).toBe(true);
  });

  it('open canceled -> no error', async () => {
    app.api.openWorkspace.mockResolvedValueOnce({ ok: false, canceled: true });
    await app.open();
    expect(calls.errors).toEqual([]);
  });

  it('loadSaved with no json -> no load', async () => {
    await app.loadSaved();
    expect(calls.loaded).toEqual([]);
    expect(calls.status).toContain('');
  });

  it('loadSaved with json -> loadWorkspaceState', async () => {
    app.api.loadWorkspace.mockResolvedValueOnce({
      ok: true, json: '{"blocks":{"blocks":[]}}',
    });
    await app.loadSaved();
    expect(calls.loaded).toEqual([{ blocks: { blocks: [] } }]);
  });

  it('loadSaved malformed json -> swallowed, no throw', async () => {
    app.api.loadWorkspace.mockResolvedValueOnce({ ok: true, json: 'bad' });
    await expect(app.loadSaved()).resolves.toBeUndefined();
    expect(calls.loaded).toEqual([]);
  });

  it('loadSaved api throw -> swallowed, no throw', async () => {
    app.api.loadWorkspace.mockRejectedValueOnce(new Error('disk'));
    await expect(app.loadSaved()).resolves.toBeUndefined();
  });
});

describe('updateInputVisibility', () => {
  let app, calls;
  beforeEach(() => ({ app, calls } = makeDoms()));

  it('visible when hasInputBlock true', () => {
    app.hasInputBlock = () => true;
    app.updateInputVisibility();
    expect(calls.inputVisible).toContain(true);
  });

  it('hidden when hasInputBlock false', () => {
    app.hasInputBlock = () => false;
    app.updateInputVisibility();
    expect(calls.inputVisible).toContain(false);
  });
});