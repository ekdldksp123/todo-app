import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      // optionally pass in vite config
      // viteConfig: customViteConfig,
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
