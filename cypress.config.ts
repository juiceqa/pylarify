import { defineConfig } from "cypress";
import webpackConfig from './webpack.config';
import {
  structuredData,
  StructuredDataParam,
  StructuredDataResult,
} from "./structured-data-testing-tool";
const fs = require('fs');
const csvdata = require('csvdata');
const { stringify } = require('csv-stringify/sync');
const path = require('path');
const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter');
require("ts-node").register({
  transpileOnly: true,
});

/**
 * @type {Cypress.PluginConfig}
 */

export default defineConfig({
  projectId: 'nddaa6',
  e2e: {
   baseUrl: "https://pylarify.com",
   // baseUrl: "https://illuccixhcp.com",
    experimentalSessionAndOrigin: true,
    excludeSpecPattern: ["**/__snapshots__/*", "**/__image_snapshots__/*"],
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  pageLoadTimeout: 60000,
  viewportWidth: 1280,
  viewportHeight: 780,
  requestTimeout: 30000,
  experimentalInteractiveRunEvents: true,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/result/screenshots",
  videosFolder: "cypress/result/videos",
  chromeWebSecurity: false,

  retries: {
    runMode: 0,
    openMode: 0,
  },

  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36",

  defaultCommandTimeout: 15000,

  env: {
    DEV_URL:
      "https://development:t2RDvFnV7NW@staging-illuccix.kinsta.cloud",
    LIVE_URL: "https://illuccixhcp.com",
  },

  reporter: "cypress-multi-reporters",
  video: true,

  reporterOptions: {
    reporterEnabled: "cypress-mochawesome-reporter",
    cypressMochawesomeReporterOptions: {
      enableCode: false,
      reportDir: "cypress/reports/mocha",
      embeddedScreenshots: true,
      inlineAssets: true,
      reportPageTitle: "SEO/Accessibility/Viewport Test Report",
      reportPageTitleAlignment: "center",
      reportPageTitleSize: "h1",
      reportPageTitleColor: "#000000",
      reportFilename: "[status]_[datetime]-[name]-report",
      reportDateFormat: "YYYY-MM-DD HH:mm:ss",
      reportGitInfo: true,
      reportTitle: "Trudhesa HCP's SEO/Accessibility/Viewport Test Report",
      quite: true,
      overwrite: false,
      html: false,
      json: true,
      timestamp: "yyyy-mm-dd'T'HH:MM:ssl",
      code: false,
      showPassed: true,
      autoOpen: true,
      charts: true,
      debug: true,
      saveAllAttempts: true,
    },
    screenshotsFolder: "images",
  },
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    async setupNodeEvents(on, config) {

      on('task', {
        writeCsvFile({ filename, data }) {
            const filePath = path.join(__dirname, '..', '..', 'csvs', filename);
            const csvOutput = stringify(data, { header: true });
            fs.writeFileSync(filePath, csvOutput);
            return null;
        }
    });


    require('cypress-mochawesome-reporter/plugin')(on);
    installLogsPrinter(on, {
        printLogsToConsole: "always",
        printLogsToFile: 'always',
        includeSuccessfulHookLogs: true,
        outputRoot: config.projectRoot + '/logs/',
        collectTestLogs: () => console.log('a'),
        outputTarget: {
            'performance-logs.json': 'json'
        }
    })

    on('task', {
        readFileMaybe({ filename, defaultContent }) {
            if (fs.existsSync(filename)) {
                return fs.readFileSync(filename, 'utf8');
            }

            return defaultContent;
        },
    });
    on('task', {
        saveMeasures(measures) {
            const filtered = measures.filter(s => Boolean(s)).map(({ duration }, k) => ({
                test: k + 1,
                'duration (ms)': Math.round(duration)
            }))

            console.table('Page load timings', filtered)
            return null
        }
    })
    if (config.testingType === 'component') {
        const { startDevServer } = require('@cypress/webpack-dev-server')

        // Your project's Webpack configuration
        const webpackConfig = require('../../webpack.config.js')

        on('dev-server:start', (options) =>
          startDevServer({ options, webpackConfig })
        )
      }
    return config
    },
  },

  component: {
    specPattern: "src/**/*.cy.*",
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig
    },
  },
});
