const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  setWindowOpacity: (opacity) => ipcRenderer.send('set-window-opacity', opacity),
  setAlwaysOnTop: (alwaysOnTop) => ipcRenderer.send('set-always-on-top', alwaysOnTop),
  onCommandResult: (callback) => ipcRenderer.on('command-result', (event, result) => callback(result)),
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  receiveMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  
  // 窗口控制
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // 系统信息
  getPlatform: () => process.platform,
  
  // 文件系统
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
})