import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    base: '/',
    minify: 'terser',
    sourcemap: true,
    target: 'esnext'
  },
  server:{
   proxy:{
    // '/api': 'http://localhost:8000'
    '/api': 'https://you-tube-twitter-app.vercel.app'
   },
  //  port: 8000,
  },
})
