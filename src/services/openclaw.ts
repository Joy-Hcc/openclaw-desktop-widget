import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface CommandResult {
  success: boolean
  stdout: string
  stderr: string
  error?: string
}

export interface OpenClawStatus {
  isRunning: boolean
  version?: string
  gatewayUrl?: string
  uptime?: string
}

export class OpenClawService {
  private openclawPath: string = 'openclaw'

  constructor(openclawPath?: string) {
    if (openclawPath) {
      this.openclawPath = openclawPath
    }
  }

  async executeCommand(command: string): Promise<CommandResult> {
    try {
      const { stdout, stderr } = await execAsync(command)
      return {
        success: true,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      }
    } catch (error: any) {
      return {
        success: false,
        stdout: '',
        stderr: error.stderr?.trim() || '',
        error: error.message
      }
    }
  }

  async getStatus(): Promise<OpenClawStatus> {
    try {
      // 检查版本
      const versionResult = await this.executeCommand(`${this.openclawPath} --version`)
      
      // 检查网关状态
      const statusResult = await this.executeCommand(`${this.openclawPath} gateway status`)
      
      const isRunning = statusResult.success && 
        (statusResult.stdout.includes('running') || 
         statusResult.stdout.includes('active'))

      return {
        isRunning,
        version: versionResult.success ? versionResult.stdout : undefined,
        gatewayUrl: isRunning ? 'http://localhost:3000' : undefined,
        uptime: isRunning ? '运行中' : '未运行'
      }
    } catch (error) {
      return {
        isRunning: false,
        uptime: '检查失败'
      }
    }
  }

  async startGateway(): Promise<CommandResult> {
    return this.executeCommand(`${this.openclawPath} gateway start`)
  }

  async stopGateway(): Promise<CommandResult> {
    return this.executeCommand(`${this.openclawPath} gateway stop`)
  }

  async restartGateway(): Promise<CommandResult> {
    return this.executeCommand(`${this.openclawPath} gateway restart`)
  }

  async checkInstallation(): Promise<boolean> {
    try {
      const result = await this.executeCommand(`${this.openclawPath} --version`)
      return result.success
    } catch {
      return false
    }
  }

  // 解析命令输出为结构化数据
  parseGatewayStatus(output: string): {
    status: 'running' | 'stopped' | 'error'
    pid?: number
    port?: number
    url?: string
  } {
    const lines = output.split('\n')
    const result = {
      status: 'stopped' as 'running' | 'stopped' | 'error',
      pid: undefined as number | undefined,
      port: undefined as number | undefined,
      url: undefined as string | undefined
    }

    for (const line of lines) {
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.includes('running') || lowerLine.includes('active')) {
        result.status = 'running'
      }
      
      if (lowerLine.includes('pid')) {
        const match = line.match(/pid[:\s]+(\d+)/i)
        if (match) {
          result.pid = parseInt(match[1], 10)
        }
      }
      
      if (lowerLine.includes('port')) {
        const match = line.match(/port[:\s]+(\d+)/i)
        if (match) {
          result.port = parseInt(match[1], 10)
          result.url = `http://localhost:${result.port}`
        }
      }
      
      if (lowerLine.includes('url') || lowerLine.includes('http')) {
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/)
        if (urlMatch) {
          result.url = urlMatch[1]
        }
      }
    }

    return result
  }

  // 获取帮助信息
  async getHelp(): Promise<string> {
    const result = await this.executeCommand(`${this.openclawPath} --help`)
    if (result.success) {
      return result.stdout
    }
    return '无法获取帮助信息'
  }

  // 获取子命令帮助
  async getCommandHelp(command: string): Promise<string> {
    const result = await this.executeCommand(`${this.openclawPath} ${command} --help`)
    if (result.success) {
      return result.stdout
    }
    return `无法获取 ${command} 命令的帮助信息`
  }
}

// 单例实例
export const openclawService = new OpenClawService()

// 工具函数
export const formatCommandForDisplay = (command: string): string => {
  return `$ ${command}`
}

export const isGatewayCommand = (command: string): boolean => {
  return command.includes('gateway')
}

export const getCommandType = (command: string): 'start' | 'stop' | 'status' | 'restart' | 'other' => {
  if (command.includes('start')) return 'start'
  if (command.includes('stop')) return 'stop'
  if (command.includes('status')) return 'status'
  if (command.includes('restart')) return 'restart'
  return 'other'
}