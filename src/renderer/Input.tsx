import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, Keyboard } from 'lucide-react'

interface InputProps {
  onSend: (message: string) => void
}

const Input: React.FC<InputProps> = ({ onSend }) => {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    
    // 命令补全
    if (e.key === 'Tab') {
      e.preventDefault()
      if (input.startsWith('openclaw')) {
        const suggestions = [
          'openclaw gateway start',
          'openclaw gateway stop',
          'openclaw gateway status',
          'openclaw gateway restart',
          'openclaw --help',
          'openclaw --version'
        ]
        
        const matching = suggestions.find(s => s.startsWith(input))
        if (matching) {
          setInput(matching)
        }
      }
    }
    
    // 上箭头历史记录
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      // TODO: 实现历史记录功能
    }
  }

  const handleVoiceInput = () => {
    if (!isRecording) {
      // 开始录音
      setIsRecording(true)
      // TODO: 实现语音识别
      setTimeout(() => {
        setIsRecording(false)
        // 模拟语音识别结果
        setInput('openclaw gateway status')
      }, 2000)
    } else {
      // 停止录音
      setIsRecording(false)
    }
  }

  const insertQuickCommand = (command: string) => {
    setInput(command)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* 输入框 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息或 OpenClaw 命令..."
          className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-400"
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* 语音输入按钮 */}
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
            isRecording 
              ? 'bg-red-500/20 text-red-400 animate-pulse' 
              : 'hover:bg-white/10 text-gray-400'
          }`}
          title={isRecording ? '停止录音' : '语音输入'}
        >
          <Mic size={18} />
        </button>
        
        {/* 发送按钮 */}
        <button
          type="submit"
          disabled={!input.trim()}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
            input.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
          }`}
          title="发送消息"
        >
          <Send size={18} />
        </button>
      </div>

      {/* 快捷命令提示 */}
      {input.startsWith('openclaw') && (
        <div className="text-xs text-gray-400 px-1">
          按 <kbd className="px-1 py-0.5 bg-gray-800 rounded">Tab</kbd> 自动补全命令
        </div>
      )}

      {/* 快捷命令按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => insertQuickCommand('openclaw gateway status')}
          className="px-3 py-1.5 text-sm bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Terminal size={14} />
          <span>状态检查</span>
        </button>
        <button
          type="button"
          onClick={() => insertQuickCommand('openclaw gateway start')}
          className="px-3 py-1.5 text-sm bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Play size={14} />
          <span>启动服务</span>
        </button>
        <button
          type="button"
          onClick={() => insertQuickCommand('openclaw gateway stop')}
          className="px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Square size={14} />
          <span>停止服务</span>
        </button>
        <button
          type="button"
          onClick={() => insertQuickCommand('openclaw --help')}
          className="px-3 py-1.5 text-sm bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors flex items-center space-x-2"
        >
          <HelpCircle size={14} />
          <span>查看帮助</span>
        </button>
      </div>
    </form>
  )
}

// 添加缺失的图标组件
const Terminal = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <polyline points="7 9 11 13 7 17" />
    <line x1="13" y1="17" x2="19" y2="17" />
  </svg>
)

const Play = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const Square = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
)

const HelpCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export default Input