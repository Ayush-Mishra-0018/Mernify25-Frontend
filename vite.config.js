import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // makes assets paths relative
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: '/index.html', // ensures correct HTML entry
    },
  },
})