// wdio.conf.mjs
import { join } from 'path';
import fs from 'fs';
import allure from '@wdio/allure-reporter';

export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',

    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/features/**/*.feature'
    ],
    maxInstances: 1,

    //
    // ============
    // Capabilities
    // ============
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--start-maximized', '--disable-infobars', '--disable-notifications']
        }
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',

    bail: 0,
    baseUrl: 'https://ayo.co.id',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    //
    // ===================
    // Services
    // ===================
    services: [],

    //
    // ===================
    // Framework
    // ===================
    framework: 'cucumber',

    cucumberOpts: {
        require: [
            './test/step-definitions/**/*.js',
            './test/support/hooks.js'
        ],
        timeout: 60000,
        backtrace: false,
        strict: true,
        tagExpression: '',
        ignoreUndefinedDefinitions: false
    },

    //
    // ===================
    // Reporters
    // ===================
    reporters: [
        'spec',
        ['allure', {
            outputDir: './allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

    //
    // ===================
    // Hooks
    // ===================
    /**
     * Hook untuk screenshot otomatis setiap step (berhasil & gagal)
     */
    afterStep: async function (test, scenario, { error, duration, passed }) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const stepName = test.title.replace(/[^a-zA-Z0-9]/g, '_');
        const screenshotName = `${stepName}_${timestamp}.png`;

        // Ambil screenshot base64
        const screenshot = await browser.takeScreenshot();

        // Attach ke Allure
        allure.addAttachment(`Step Screenshot: ${test.title}`, Buffer.from(screenshot, 'base64'), 'image/png');

        // Simpan juga ke folder lokal (opsional)
        const screenshotsDir = path.resolve('./screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir);
        }
        await fs.promises.writeFile(path.join(screenshotsDir, screenshotName), Buffer.from(screenshot, 'base64'));
    }
};
