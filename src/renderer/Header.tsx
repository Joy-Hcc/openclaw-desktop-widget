import React from 'react'
import { X, Minus, Settings, Trash2, RefreshCw } from 'lucide-react'

interface HeaderProps {
  isConnected: boolean
  onClearChat: () => void
  onCheckStatus: () => void
}

const Header: React.FC<HeaderProps> = ({ isConnected, onClearChat, onCheckStatus }) => {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow()
    }
  }

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow()
    }
  }

  const handleSettings = () => {
    // 打开设置面板
    if (window.electronAPI) {
      window.electronAPI.sendMessage('open-settings')
    }
  }

  return (
    <div className="draggable flex items-center justify-between p-4 border-b border-white/10">
      {/* 左侧：标题和状态 */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">⚡</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">OpenClaw Widget</h1>
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-gray-300">
                {isConnected ? '已连接' : '未连接'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：控制按钮 */}
      <div className="flex items-center space-x-2 no-drag">
        {/* 状态检查按钮 */}
        <button
          onClick={onCheckStatus}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="检查状态"
        >
          <RefreshCw size={18} />
        </button>

        {/* 清空聊天按钮 */}
        <button
          onClick={onClearChat}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="清空对话"
        >
          <Trash2 size={18} />
        </button>

        {/* 设置按钮 */}
        <button
          onClick={handleSettings}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="设置"
        >
          <Settings size={18} />
        </button>

        {/* 窗口控制按钮 */}
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={handleMinimize}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="最小化"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            title="关闭"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header