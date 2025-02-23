import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Asegura que los assets se sirvan correctamente en producción
    base: '/',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          qrscanner: ['html5-qrcode']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})