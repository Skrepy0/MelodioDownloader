// 用于打包python
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 定义路径
const projectRoot = path.resolve(__dirname, '..')
const venvPath = path.join(projectRoot, 'venv')
const mainScript = path.join(projectRoot, 'src', 'scripts', 'main.py')
const specFile = path.join(projectRoot, 'main.spec') // .spec 文件路径
const outputDir = path.join(projectRoot, 'py-dist')

// 检查 main.py 是否存在
if (!fs.existsSync(mainScript)) {
  console.error('❌ 未找到 src/scripts/main.py，请确认路径')
  process.exit(1)
}

// 检查 main.spec 是否存在
if (!fs.existsSync(specFile)) {
  console.error('❌ 未找到 main.spec')
  process.exit(1)
}

// 确定 Python 可执行文件路径
let pythonExe = 'python'
if (fs.existsSync(venvPath)) {
  const isWin = process.platform === 'win32'
  const venvPython = isWin ? path.join(venvPath, 'Scripts', 'python.exe') : path.join(venvPath, 'bin', 'python')
  if (fs.existsSync(venvPython)) {
    pythonExe = venvPython
    console.log(`✅ 使用虚拟环境 Python: ${pythonExe}`)
  } else {
    console.warn('⚠️ 虚拟环境存在但未找到 python 可执行文件，将尝试系统 Python')
  }
} else {
  console.log('ℹ️ 未找到虚拟环境，使用系统 Python')
}

// 检查 PyInstaller 是否可用，如果没有则自动安装
try {
  execSync(`${pythonExe} -m PyInstaller --version`, { stdio: 'ignore' })
} catch {
  console.log('📦 正在安装 PyInstaller ...')
  execSync(`${pythonExe} -m pip install pyinstaller`, { stdio: 'inherit' })
}

// 执行 PyInstaller 打包，使用 .spec 文件，并指定输出目录
console.log(`🚀 正在使用 ${specFile} 打包 ...`)
const cmd = `${pythonExe} -m PyInstaller ${specFile} --distpath ${outputDir}`
try {
  execSync(cmd, { stdio: 'inherit' })
  console.log(`✅ py部分打包成功！可执行文件位于: ${outputDir}/main${process.platform === 'win32' ? '.exe' : ''}`)
} catch (err) {
  console.error('❌ 打包失败:', err.message)
  process.exit(1)
}
