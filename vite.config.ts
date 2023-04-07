import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import prismjs from 'vite-plugin-prismjs'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [
        splitVendorChunkPlugin(),
        vue(),
        prismjs({
            languages: [ 'javascript', 'typescript', 'bash', 'markup' ],
            theme: 'okaidia',
            css: true
        })
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js',
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',

            '@': resolve(root, 'src'),
            '@pack': resolve(root, 'package.json'),
            '@comp': resolve(root, 'src/components'),
            '@util': resolve(root, 'src/utils'),
            '@store': resolve(root, 'src/stores')
        }
    }
})
