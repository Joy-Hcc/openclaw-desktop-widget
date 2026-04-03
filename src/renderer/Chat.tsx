import React from 'react'
import { Message } from '../store'
import { Bot, User, Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface ChatProps {
  messages: Message[]
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return <User size={16} className="text-blue-400" />
      case 'bot':
        return <Bot size={16} className="text-green-400" />
      case 'command':
        return <Terminal size={16} className="text-purple-400" />
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />
      case 'info':
        return <Info size={16} className="text-blue-400" />
      default:
        return <Bot size={16} />
    }
  }

  const getMessageClass = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return 'bg-blue-500/20 border-blue-500/30'
      case 'bot':
        return 'bg-gray-700/50 border-gray-600/50'
      case 'command':
        return 'bg-purple-500/20 border-purple-500/30'
      case 'error':
        return 'bg-red-500/20 border-red-500/30'
      case 'success':
        return 'bg-green-500/20 border-green-500/30'
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30'
      default:
        return 'bg-gray-700/50 border-gray-600/50'
    }
  }

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
          <Bot size={32} />
        </div>
        <h3 className="text-lg font-medium mb-2">欢迎使用 OpenClaw Widget</h3>
        <p className="text-sm text-center max-w-md">
          输入 <code className="px-2 py-1 bg-gray-800 rounded">openclaw gateway start</code> 启动服务
          <br />
          或直接与 OpenClaw 对话
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-sm">
          <div className="p-3 bg-gray-800/30 rounded-lg text-xs">
            <div className="font-medium mb-1">快捷命令</div>
            <div className="space-y-1">
              <div>openclaw gateway status</div>
              <div>openclaw --help</div>
              <div>openclaw gateway start</div>
            </div>
          </div>
          <div className="p-3 bg-gray-800/30 rounded-lg text-xs">
            <div className="font-medium mb-1">对话示例</div>
            <div className="space-y-1">
              <div>你好，小闪！</div>
              <div>今天天气怎么样？</div>
              <div>帮我写个 Python 脚本</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`fade-in p-4 rounded-xl border ${getMessageClass(message.type)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getMessageIcon(message.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium capitalize">
                  {message.type === 'user' ? '你' : 
                   message.type === 'bot' ? '小闪' : 
                   message.type === 'command' ? '命令' : 
                   message.type}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chat