import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { PythonShell, type Options } from 'python-shell'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  const preloadPath = path.join(__dirname, '../preload/index.mjs')

  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true, // 必须开启
      nodeIntegration: false, // 安全
    },
  })

  // 加载 Vite 开发服务器（开发环境）
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // 生产环境加载打包后的 HTML
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // 打开 DevTools（开发用）
  // if (process.env.NODE_ENV === 'development') {
  //   mainWindow.webContents.openDevTools()
  // }
}

// 处理 IPC 调用（执行 Python）
ipcMain.handle('getMusicsFromPy', async (event, indexTerm: string, count: number) => {
  try {
    // 使用 process.env.APP_ROOT（由 electron-vite 注入）定位项目根目录
    const root = process.env.APP_ROOT || path.resolve(__dirname, '../..')
    const scriptDir = path.join(root, 'src', 'scripts')

    const options: Options = {
      mode: 'text',
      scriptPath: scriptDir,
      args: [indexTerm, count.toString()],
    }

    const results = await PythonShell.run('main.py', options)
    const output = results.join('')
    const data = JSON.parse(output)
    return { success: true, data }
  } catch (error: any) {
    console.error('Python 执行错误:', error)
    // 如果 Python 脚本输出非 JSON 或抛出异常，返回错误
    return { success: false, error: error.message || '未知错误' }
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
