const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('DaadAPI', {
  runCode: (code) => ipcRenderer.invoke('daad:run', code),
  saveWorkspace: (json) => ipcRenderer.invoke('workspace:save', json),
  loadWorkspace: () => ipcRenderer.invoke('workspace:load'),
  saveWorkspaceAs: (json) => ipcRenderer.invoke('workspace:saveAs', json),
  openWorkspace: () => ipcRenderer.invoke('workspace:open'),
});
