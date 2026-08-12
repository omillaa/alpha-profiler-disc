// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/alpha-profiler-disc/', // IMPORTANTE: nome do seu repositório
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})