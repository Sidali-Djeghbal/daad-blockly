const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('DaadAPI', {
  runCode: (code, input) => {
    if (typeof code !== 'string') return Promise.reject(new Error('Invalid code'));
    if (input !== undefined && typeof input !== 'string') return Promise.reject(new Error('Invalid input'));
    return ipcRenderer.invoke('daad:run', { code, input: input || '' });
  },
  sendStdin: (execId, data) => {
    if (!execId || typeof data !== 'string') return Promise.reject(new Error('Invalid params'));
    return ipcRenderer.invoke('daad:stdin', execId, data);
  },
  stopExecution: (execId) => {
    if (!execId) return Promise.reject(new Error('Invalid execId'));
    return ipcRenderer.invoke('daad:stop', execId);
  },
  onOutput: (callback) => {
    if (typeof callback !== 'function') return;
    ipcRenderer.on('daad:output', (_event, data) => callback(data));
  },
  saveWorkspace: (json) => {
    if (typeof json !== 'string') return Promise.reject(new Error('Invalid workspace data'));
    return ipcRenderer.invoke('workspace:save', json);
  },
  loadWorkspace: () => ipcRenderer.invoke('workspace:load'),
  saveWorkspaceAs: (json) => {
    if (typeof json !== 'string') return Promise.reject(new Error('Invalid workspace data'));
    return ipcRenderer.invoke('workspace:saveAs', json);
  },
  openWorkspace: () => ipcRenderer.invoke('workspace:open'),
});
