const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const crypto = require('crypto');

let mainWindow;

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'لغة ضاد',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => { mainWindow = null; });
});

const getDaadBinary = () => {
  const { platform } = process;
  const isWin = platform === 'win32';
  const binName = isWin ? 'daad.exe' : 'daad';
  const binPath = path.join(__dirname, 'bin', binName);
  if (!fs.existsSync(binPath)) {
    const altPath = path.join(__dirname, 'bin', 'ض');
    if (fs.existsSync(altPath)) return altPath;
    throw new Error(`Daad binary not found at ${binPath}`);
  }
  return binPath;
};

const getWorkspaceDir = () => {
  const dir = path.join(app.getPath('userData'), 'workspaces');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const MAX_OUTPUT = 1024 * 1024;
const TIMEOUT_MS = 10000;
const runningProcesses = new Map();

ipcMain.handle('daad:run', async (event, params) => {
  if (!params || typeof params.code !== 'string') {
    return { ok: false, error: 'Invalid code: expected string', execId: null };
  }
  if (params.code.length > 50000) {
    return { ok: false, error: 'Code too long (max 50000 chars)', execId: null };
  }
  if (params.input && typeof params.input !== 'string') {
    return { ok: false, error: 'Invalid input', execId: null };
  }

  try {
    const bin = getDaadBinary();
    const tmpFile = path.join(app.getPath('temp'), `daad_${crypto.randomUUID()}.daad`);
    fs.writeFileSync(tmpFile, params.code, 'utf-8');

    const proc = spawn(bin, [tmpFile], { stdio: ['pipe', 'pipe', 'pipe'] });
    const execId = crypto.randomUUID();
    let stdout = '', stderr = '';
    let timedOut = false;

    if (params.input) {
      var toWrite = params.input.endsWith('\n') ? params.input : params.input + '\n';
      proc.stdin.write(toWrite);
    }

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
      setTimeout(() => { try { proc.kill('SIGKILL'); } catch {} }, 500);
    }, TIMEOUT_MS);

    proc.stdout.on('data', (data) => {
      if (stdout.length < MAX_OUTPUT) {
        var chunk = data.toString();
        stdout += chunk;
        try { event.sender.send('daad:output', { execId, stdout: chunk, done: false }); } catch {}
      }
    });

    proc.stderr.on('data', (data) => {
      if (stderr.length < MAX_OUTPUT) {
        var chunk = data.toString().slice(0, MAX_OUTPUT);
        stderr += chunk;
        try { event.sender.send('daad:output', { execId, stderr: chunk, done: false }); } catch {}
      }
    });

    const cleanup = () => {
      clearTimeout(timer);
      fs.unlink(tmpFile, () => {});
    };

    proc.on('close', (exitCode) => {
      cleanup();
      runningProcesses.delete(execId);
      var result;
      if (timedOut) {
        result = { execId, ok: false, error: 'انتهت مهلة التنفيذ (10 ثوان)', stdout, stderr, exitCode: -1, done: true };
      } else if (exitCode === null) {
        result = { execId, ok: false, error: 'تم إيقاف التنفيذ', stdout, stderr, exitCode: -1, done: true };
      } else if (exitCode !== 0) {
        result = { execId, ok: false, error: 'خطأ في التنفيذ', stdout, stderr, exitCode, done: true };
      } else {
        result = { execId, ok: true, stdout, stderr, exitCode, done: true };
      }
      try { event.sender.send('daad:output', result); } catch {}
    });

    proc.on('error', (err) => {
      cleanup();
      runningProcesses.delete(execId);
      try {
        event.sender.send('daad:output', {
          execId, ok: false, error: err.message, stdout, stderr, exitCode: -1, done: true
        });
      } catch {}
    });

    runningProcesses.set(execId, proc);

    return { ok: true, execId };
  } catch (err) {
    return { ok: false, error: err.message, execId: null };
  }
});

ipcMain.handle('daad:stdin', (event, execId, data) => {
  if (!execId || typeof data !== 'string') return { ok: false };
  const proc = runningProcesses.get(execId);
  if (!proc) return { ok: false, error: 'No running process' };
  proc.stdin.write(data);
  return { ok: true };
});

ipcMain.handle('daad:stop', (event, execId) => {
  if (!execId) return { ok: false };
  const proc = runningProcesses.get(execId);
  if (!proc) return { ok: false, error: 'No running process' };
  proc.kill('SIGTERM');
  setTimeout(() => { try { proc.kill('SIGKILL'); } catch {} }, 500);
  return { ok: true };
});

ipcMain.handle('workspace:save', async (event, json) => {
  if (typeof json !== 'string') return { ok: false, error: 'Invalid data' };
  try {
    const dir = getWorkspaceDir();
    const filePath = path.join(dir, 'workspace.json');
    fs.writeFileSync(filePath, json, 'utf-8');
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('workspace:load', async () => {
  try {
    const filePath = path.join(getWorkspaceDir(), 'workspace.json');
    if (!fs.existsSync(filePath)) return { ok: true, json: '' };
    const json = fs.readFileSync(filePath, 'utf-8');
    return { ok: true, json };
  } catch (err) {
    return { ok: false, error: err.message, json: '' };
  }
});

ipcMain.handle('workspace:saveAs', async (event, json) => {
  if (typeof json !== 'string') return { ok: false, error: 'Invalid data' };
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'حفظ مساحة العمل',
      defaultPath: path.join(app.getPath('documents'), 'workspace.json'),
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    if (result.canceled) return { ok: false, canceled: true };
    if (!result.filePath) return { ok: false, error: 'No file path selected' };
    fs.writeFileSync(result.filePath, json, 'utf-8');
    return { ok: true, path: result.filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('workspace:open', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'فتح مساحة عمل',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      properties: ['openFile']
    });
    if (result.canceled) return { ok: false, canceled: true };
    if (!result.filePaths || result.filePaths.length === 0) {
      return { ok: false, error: 'لم يتم اختيار ملف' };
    }
    const json = fs.readFileSync(result.filePaths[0], 'utf-8');
    return { ok: true, json, path: result.filePaths[0] };
  } catch (err) {
    return { ok: false, error: err.message, json: '' };
  }
});
