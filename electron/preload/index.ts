import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getMusicsFromPy: (indexTerm: string, count: number) => ipcRenderer.invoke('getMusicsFromPy', indexTerm, count),
})
