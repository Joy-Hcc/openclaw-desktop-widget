import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MessageType = 'user' | 'bot' | 'command' | 'error' | 'success' | 'info'

export interface Message {
  id?: string
  type: MessageType
  content: string
  timestamp: Date
}

interface AppState {
  // 消息状态
  messages: Message[]
  addMessage: (message: Omit<Message, 'id'>) => void
  clearMessages: () => void
  
  // 设置状态
  opacity: number
  setOpacity: (opacity: number) => void
  alwaysOnTop: boolean
  setAlwaysOnTop: (alwaysOnTop: boolean) => void
  autoStart: boolean
  setAutoStart: (autoStart: boolean) => void
  
  // OpenClaw 连接状态
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
  openclawPath: string
  setOpenclawPath: (path: string) => void
  
  // 窗口位置
  windowPosition: { x: number; y: number }
  setWindowPosition: (position: { x: number; y: number }) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 消息状态
      messages: [],
      addMessage: (message) => {
        const newMessage = {
          ...message,
          id: Date.now().toString()
        }
        set((state) => ({
          messages: [...state.messages, newMessage].slice(-100) // 保留最近100条
        }))
      },
      clearMessages: () => set({ messages: [] }),
      
      // 设置状态
      opacity: 0.9,
      setOpacity: (opacity) => {
        set({ opacity })
        // 更新窗口透明度
        if (window.electronAPI) {
          window.electronAPI.setWindowOpacity(opacity)
        }
      },
      alwaysOnTop: true,
      setAlwaysOnTop: (alwaysOnTop) => {
        set({ alwaysOnTop })
        // 更新窗口置顶状态
        if (window.electronAPI) {
          window.electronAPI.setAlwaysOnTop(alwaysOnTop)
        }
      },
      autoStart: false,
      setAutoStart: (autoStart) => set({ autoStart }),
      
      // OpenClaw 连接状态
      isConnected: false,
      setIsConnected: (isConnected) => set({ isConnected }),
      openclawPath: 'openclaw',
      setOpenclawPath: (openclawPath) => set({ openclawPath }),
      
      // 窗口位置
      windowPosition: { x: 0, y: 0 },
      setWindowPosition: (windowPosition) => set({ windowPosition }),
    }),
    {
      name: 'openclaw-widget-storage',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // 持久化最近50条消息
        opacity: state.opacity,
        alwaysOnTop: state.alwaysOnTop,
        autoStart: state.autoStart,
        openclawPath: state.openclawPath,
        windowPosition: state.windowPosition,
      }),
    }
  )
)

// 工具函数
export const formatCommandOutput = (output: string): string => {
  // 简单的命令输出格式化
  return output
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
}

export const isOpenClawCommand = (text: string): boolean => {
  return text.trim().toLowerCase().startsWith('openclaw')
}

export const extractCommand = (text: string): string => {
  return text.trim().split(' ')[0] || ''
}

export const getCommandArgs = (text: string): string[] => {
  const parts = text.trim().split(' ')
  return parts.slice(1)
}