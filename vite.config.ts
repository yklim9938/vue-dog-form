import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import typescript2 from 'rollup-plugin-typescript2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    typescript2({
      check: false,
      include: ["src/components/*.vue", "src/index.ts"],
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true
        }
      },
      exclude: [
        'vite.config.ts'
      ]
    })
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
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
