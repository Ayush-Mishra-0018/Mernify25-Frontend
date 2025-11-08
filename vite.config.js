import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // ensures relative asset paths work after deployment
  build: {
    outDir: 'dist', // this is the folder Railway should serve
  },
})