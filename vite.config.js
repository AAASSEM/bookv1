import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      writeBundle() {
        // Copy _redirects file to dist folder
        const src = resolve(__dirname, 'public/_redirects')
        const distDir = resolve(__dirname, 'dist')
        mkdirSync(distDir, { recursive: true })
        copyFileSync(src, resolve(distDir, '_redirects'))
      }
    }
  ],
  server: {
    historyApiFallback: true
  }
})
