import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Asegurarse de que los archivos de assets tengan nombres predecibles
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})