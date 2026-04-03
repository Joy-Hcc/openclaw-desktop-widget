import { Tray, Menu, BrowserWindow, app, nativeImage } from 'electron'
import path from 'path'
import fs from 'fs'

export function createTray(mainWindow: BrowserWindow): Tray | null {
  // 图标路径
  const iconPath = path.join(__dirname, '../../public/tray-icon.png')

  let tray: Tray

  try {
    if (fs.existsSync(iconPath)) {
      // 使用自定义图标
      tray = new Tray(iconPath)
    } else {
      // 创建默认的空白图标（16x16）
      const emptyIcon = nativeImage.createEmpty()
      tray = new Tray(emptyIcon)
      console.warn('Tray icon not found, using empty icon')
    }
  } catch (error) {
    console.error('Failed to create tray icon:', error)
    return null
  }

  // 托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示/隐藏',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide()
        } else {
          mainWindow.show()
        }
      }
    },
    {
      label: '透明度',
      submenu: [
        { label: '100%', type: 'radio', click: () => mainWindow.setOpacity(1.0) },
        { label: '90%', type: 'radio', checked: true, click: () => mainWindow.setOpacity(0.9) },
        { label: '80%', type: 'radio', click: () => mainWindow.setOpacity(0.8) },
        { label: '70%', type: 'radio', click: () => mainWindow.setOpacity(0.7) },
        { label: '60%', type: 'radio', click: () => mainWindow.setOpacity(0.6) },
        { label: '50%', type: 'radio', click: () => mainWindow.setOpacity(0.5) },
      ]
    },
    {
      label: '置顶显示',
      type: 'checkbox',
      checked: true,
      click: (item) => {
        mainWindow.setAlwaysOnTop(item.checked)
      }
    },
    { type: 'separator' },
    {
      label: '启动 OpenClaw',
      click: () => {
        mainWindow.webContents.send('execute-command', 'openclaw gateway start')
      }
    },
    {
      label: '停止 OpenClaw',
      click: () => {
        mainWindow.webContents.send('execute-command', 'openclaw gateway stop')
      }
    },
    {
      label: '检查状态',
      click: () => {
        mainWindow.webContents.send('execute-command', 'openclaw gateway status')
      }
    },
    { type: 'separator' },
    {
      label: '设置',
      click: () => {
        mainWindow.webContents.send('open-settings')
      }
    },
    {
      label: '关于',
      click: () => {
        mainWindow.webContents.send('open-about')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        (app as any).isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('OpenClaw Desktop Widget')
  tray.setContextMenu(contextMenu)

  // 点击托盘图标显示/隐藏窗口
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  return tray
}
