import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 相对路径构建：产物可直接用 file:// 双击打开（配合 single-file.mjs 使用）
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 900,
    outDir: 'dist',
  },
})
