import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    dts({
      tsconfigPath: './tsconfig.build.json',
    })
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './index.ts',
      formats: ['es'],
      name: 'VueDogForm',
      fileName: (format) => (format == 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external:  ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
