/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRESENTATION_URL_MODE?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}
