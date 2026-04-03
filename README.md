# OpenClaw Desktop Widget

一个透明的桌面对话框小部件，可以快速启动 OpenClaw 并直接对话。

## ✨ 特性

- **透明浮动窗口** - 可拖动，可调整透明度
- **快速启动** - 输入 `openclaw gateway` 即可启动服务
- **直接对话** - 在对话框内与 OpenClaw 交互
- **系统集成** - 开机自启动，系统托盘图标
- **跨平台** - 支持 Windows、macOS、Linux

## 🖼️ 界面预览

```
+-------------------------------+
|   OpenClaw Desktop Widget     |
|  [透明背景，可看到桌面]         |
|                               |
|  > openclaw gateway           |
|  ✅ OpenClaw 服务已启动        |
|                               |
|  > 你好                        |
|  👋 你好！我是小闪 ⚡          |
|                               |
|  [__________________________] |
|     输入消息...                |
+-------------------------------+
```

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/Joy-Hcc/openclaw-desktop-widget.git
cd openclaw-desktop-widget

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建应用
npm run build
```

### 使用

1. 启动应用后，会出现透明浮动窗口
2. 输入 `openclaw gateway` 启动 OpenClaw 服务
3. 直接在输入框中与 OpenClaw 对话
4. 右键系统托盘图标可调整设置

## 🛠️ 技术栈

- **Electron** - 跨平台桌面应用框架
- **React** + **TypeScript** - 前端界面
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **WebSocket** - 与 OpenClaw 通信

## 📁 项目结构

```
openclaw-desktop-widget/
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── index.ts    # 主进程入口
│   │   ├── window.ts   # 窗口管理
│   │   └── tray.ts     # 系统托盘
│   ├── renderer/       # 前端界面
│   │   ├── App.tsx     # 主组件
│   │   ├── Chat.tsx    # 聊天组件
│   │   └── Input.tsx   # 输入组件
│   ├── services/       # 服务层
│   │   ├── openclaw.ts # OpenClaw 集成
│   │   └── websocket.ts # WebSocket 通信
│   └── utils/          # 工具函数
├── public/             # 静态资源
├── package.json
├── electron-builder.json
└── README.md
```

## 🔧 配置

### 环境变量

```bash
# .env 文件
OPENCLAW_PATH=openclaw          # OpenClaw 命令路径
OPENCLAW_WS_URL=ws://localhost:3000  # WebSocket 地址
TRANSPARENCY=0.9                # 窗口透明度
ALWAYS_ON_TOP=true              # 是否置顶
```

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Shift+O` | 显示/隐藏窗口 |
| `Ctrl+Shift+C` | 清空对话历史 |
| `Ctrl+Shift+T` | 调整透明度 |
| `Ctrl+Shift+Q` | 退出应用 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [OpenClaw](https://openclaw.ai) - 强大的 AI 助手平台
- [Electron](https://www.electronjs.org) - 跨平台桌面框架
- 所有贡献者和用户

---

**让 OpenClaw 触手可及，随时对话！**