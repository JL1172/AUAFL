import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'public', // Where your font files might be
  build: {
    outDir: '../dist-client'
  }
})
