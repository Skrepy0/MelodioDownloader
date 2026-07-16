import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

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

  if (app.isPackaged) {
    // 生产环境：从 app.getAppPath() 获取应用根目录，加载 dist/index.html
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html')
    mainWindow.loadFile(indexPath)
  } else {
    // 开发环境：加载 Vite 开发服务器
    mainWindow.loadURL('http://localhost:5173')
  }

  // 打开 DevTools（开发用）
  // if (process.env.NODE_ENV === 'development') {
  //   mainWindow.webContents.openDevTools()
  // }
}
function getPythonExePath() {
  const isDev = !app.isPackaged
  const platform = process.platform
  const exeName = platform === 'win32' ? 'main.exe' : 'main'

  if (isDev) {
    // 开发环境：直接从项目根目录的 py-dist 调用
    return path.join(process.env.APP_ROOT || process.cwd(), 'py-dist', exeName)
  } else {
    // 生产环境：从 resources/bin 调用
    return path.join(process.resourcesPath, 'bin', exeName)
  }
}

ipcMain.handle('getMusicsFromPy', async (event, indexTerm: string, count: number) => {
  const exePath = getPythonExePath()
  return new Promise((resolve, reject) => {
    const proc = spawn(exePath, [indexTerm, String(count)])
    let stdout = '',
      stderr = ''
    proc.stdout.on('data', (d) => (stdout += d))
    proc.stderr.on('data', (d) => (stderr += d))
    proc.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout)
          resolve({ success: true, data: result })
        } catch (e) {
          resolve({ success: false, error: '解析输出失败: ' + stdout })
        }
      } else {
        resolve({ success: false, error: stderr || `进程退出码 ${code}` })
      }
    })
    proc.on('error', (err) => {
      resolve({ success: false, error: err.message })
    })
  })
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
