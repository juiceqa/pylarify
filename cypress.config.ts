import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: "https://www.pylarify.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // and load any plugins that require the Node environment
    },
  }
})
