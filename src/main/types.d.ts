import { App } from 'electron'

declare module 'electron' {
  interface App {
    isQuiting?: boolean
  }
}

declare global {
  var __dirname: string
  var __filename: string
}

export {}
