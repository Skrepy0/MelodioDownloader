/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface RawMusicsInfo {
  success: boolean
  data?: Music[]
  error?: string
}

interface Window {
  electronAPI: {
    getMusicsFromPy: (indexTerm: string, count: number) => Promise<RawMusicsInfo>
  }
}
