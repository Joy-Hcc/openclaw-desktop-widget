import { BrowserWindow, screen } from 'electron'
import path from 'path'

export function createWindow(): BrowserWindow {
  // 获取主显示器信息
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    x: width - 420, // 右侧留出边距
    y: height - 520, // 底部留出边距
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    opacity: 0.9, // 默认透明度
    backgroundColor: '#00000000', // 完全透明背景
    show: false, // 初始不显示
    icon: path.join(__dirname, '../../public/icon.png')
  })

  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // 启用拖动
  mainWindow.setIgnoreMouseEvents(false)

  return mainWindow
}

// 创建预加载脚本
export const preloadScript = `
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  setWindowOpacity: (opacity) => ipcRenderer.send('set-window-opacity', opacity),
  setAlwaysOnTop: (alwaysOnTop) => ipcRenderer.send('set-always-on-top', alwaysOnTop),
  onCommandResult: (callback) => ipcRenderer.on('command-result', (event, result) => callback(result)),
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  receiveMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args))
})
`
