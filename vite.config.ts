/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import packageInfo from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/react-menu/index.ts"),
      formats: ['es', 'cjs'],
      fileName: (format) => `react-menu.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageInfo.peerDependencies), ...Object.keys(packageInfo.dependencies)]
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
