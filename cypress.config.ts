import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      // optionally pass in vite config
      // viteConfig: path.resolve(__dirname, './vite.config.ts'),
      // // or a function - the result is merged with
      // // any `vite.config` file that is detected
      // viteConfig: async () => {
      //   // ... do things ...
      //   const modifiedConfig = await injectCustomConfig(baseConfig)
      //   return modifiedConfig
      // },
    },
  },
})
