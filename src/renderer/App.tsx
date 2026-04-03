import React, { useState, useEffect, useRef } from 'react'
import Chat from './Chat'
import Input from './Input'
import Header from './Header'
import { useStore } from '../store'

declare global {
  interface Window {
    electronAPI: any
  }
}

function App() {
  const { messages, addMessage, clearMessages } = useStore()
  const [isConnected, setIsConnected] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // 初始化连接
  useEffect(() => {
    // 检查 OpenClaw 状态
    checkOpenClawStatus()
    
    // 监听来自主进程的消息
    if (window.electronAPI) {
      window.electronAPI.receiveMessage('command-result', (result: any) => {
        if (result.error) {
          addMessage({
            type: 'error',
            content: `命令执行失败: ${result.error}`,
            timestamp: new Date()
          })
        } else {
          addMessage({
            type: 'bot',
            content: result.stdout || '命令执行成功',
            timestamp: new Date()
          })
        }
      })
    }
  }, [])

  const checkOpenClawStatus = async () => {
    try {
      const result = await window.electronAPI.executeCommand('openclaw --version')
      setIsConnected(true)
      addMessage({
        type: 'success',
        content: `✅ OpenClaw 已连接 (${result.stdout.trim()})`,
        timestamp: new Date()
      })
    } catch (error) {
      setIsConnected(false)
      addMessage({
        type: 'error',
        content: '❌ 无法连接到 OpenClaw，请确保已安装并配置',
        timestamp: new Date()
      })
    }
  }

  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    addMessage({
      type: 'user',
      content,
      timestamp: new Date()
    })

    // 如果是 openclaw 命令
    if (content.startsWith('openclaw')) {
      addMessage({
        type: 'command',
        content: `执行: ${content}`,
        timestamp: new Date()
      })

      try {
        const result = await window.electronAPI.executeCommand(content)
        addMessage({
          type: 'bot',
          content: result.stdout || '命令执行成功',
          timestamp: new Date()
        })
      } catch (error: any) {
        addMessage({
          type: 'error',
          content: `错误: ${error.error || error.message}`,
          timestamp: new Date()
        })
      }
    } else {
      // 普通对话（这里可以集成 OpenClaw WebSocket）
      addMessage({
        type: 'bot',
        content: `你说: "${content}" (OpenClaw 对话功能待集成)`,
        timestamp: new Date()
      })
    }
  }

  const handleClearChat = () => {
    clearMessages()
    addMessage({
      type: 'info',
      content: '对话已清空',
      timestamp: new Date()
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl text-white">
      {/* 头部 */}
      <Header 
        isConnected={isConnected}
        onClearChat={handleClearChat}
        onCheckStatus={checkOpenClawStatus}
      />

      {/* 聊天区域 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 pt-2 h-[calc(100vh-140px)] no-drag"
      >
        <Chat messages={messages} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-white/10 p-4 no-drag">
        <Input onSend={handleSendMessage} />
        
        {/* 快捷命令 */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => handleSendMessage('openclaw gateway status')}
            className="px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
          >
            状态检查
          </button>
          <button
            onClick={() => handleSendMessage('openclaw gateway start')}
            className="px-3 py-1 text-xs bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
          >
            启动服务
          </button>
          <button
            onClick={() => handleSendMessage('openclaw gateway stop')}
            className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            停止服务
          </button>
          <button
            onClick={() => handleSendMessage('openclaw --help')}
            className="px-3 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
          >
            查看帮助
          </button>
        </div>
      </div>
    </div>
  )
}

export default App