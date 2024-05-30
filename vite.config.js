import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    base: '/',
    minify: 'terser',
    sourcemap: true,
    target: 'esnext'
  },
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

}
  // server:{
  //  proxy:{
  //   '/api': 'http://localhost:8000'
  //  },
  // //  port: 8000,
  // },
})
