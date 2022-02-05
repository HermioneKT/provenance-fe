import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    }
  },
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxt/postcss8'
  ],
  css: [
    '@/assets/css/main.css'
  ],
  env: {},
  head: {
    title: 'nuxt-community/typescript-template',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A boilerplate to start a Nuxt+TS project quickly' }
    ],
    link: []
  },
  loading: { color: '#0c64c1' },
  modules: [],
  plugins: [
    '~/plugins/truncate'
  ]
}

export default config
