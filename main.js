const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'لغة ضاد',
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
});

const getDaadBinary = () => {
  const isWin = process.platform === 'win32';
  const binName = isWin ? 'daad.exe' : 'daad';
  const binPath = path.join(__dirname, 'bin', binName);
  if (!fs.existsSync(binPath)) throw new Error(`Daad binary not found at ${binPath}`);
  return binPath;
};

const getWorkspaceDir = () => {
  const dir = path.join(app.getPath('userData'), 'workspaces');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

ipcMain.handle('daad:run', async (event, code) => {
  try {
    const bin = getDaadBinary();
    const tmpFile = path.join(app.getPath('temp'), `daad_${Date.now()}.daad`);
    fs.writeFileSync(tmpFile, code, 'utf-8');

    return new Promise((resolve) => {
      const proc = spawn(bin, [tmpFile], { timeout: 3000 });
      let stdout = '', stderr = '';

      proc.stdout.on('data', (data) => { stdout += data.toString(); });
      proc.stderr.on('data', (data) => { stderr += data.toString(); });

      proc.on('close', (exitCode) => {
        fs.unlink(tmpFile, () => {});
        resolve({ ok: true, stdout, stderr, exitCode });
      });

      proc.on('error', (err) => {
        fs.unlink(tmpFile, () => {});
        resolve({ ok: false, error: err.message, stdout: '', stderr: '', exitCode: -1 });
      });
    });
  } catch (err) {
    return { ok: false, error: err.message, stdout: '', stderr: '', exitCode: -1 };
  }
});

ipcMain.handle('workspace:save', async (event, json) => {
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
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'حفظ مساحة العمل',
      defaultPath: path.join(app.getPath('documents'), 'workspace.json'),
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    if (result.canceled) return { ok: false, canceled: true };
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
    const json = fs.readFileSync(result.filePaths[0], 'utf-8');
    return { ok: true, json, path: result.filePaths[0] };
  } catch (err) {
    return { ok: false, error: err.message, json: '' };
  }
});
