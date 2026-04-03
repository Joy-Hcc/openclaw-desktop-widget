import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain } from 'electron'
import path from 'path'
import { createWindow } from './window'
import { createTray } from './tray'

// 处理单实例锁
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时，聚焦到现有窗口
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(() => {
  const mainWindow = createWindow()
  const tray = createTray(mainWindow)

  // 注册全局快捷键
  globalShortcut.register('CommandOrControl+Shift+O', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  // 处理窗口关闭事件（隐藏到托盘而不是退出）
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  // 处理应用退出
  app.on('before-quit', () => {
    app.isQuiting = true
    globalShortcut.unregisterAll()
  })

  // macOS 特殊处理
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC 通信处理
ipcMain.handle('execute-command', async (event, command: string) => {
  const { exec } = await import('child_process')
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr })
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
})

// 处理透明度和置顶设置
ipcMain.on('set-window-opacity', (event, opacity: number) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    window.setOpacity(opacity)
  }
})

ipcMain.on('set-always-on-top', (event, alwaysOnTop: boolean) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    window.setAlwaysOnTop(alwaysOnTop)
  }
})