const { defineConfig } = require('@playwright/test');

require('dotenv').config();

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: false,
    reporter: 'html',
    workers: 1,

    use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
        trace: 'on',
    },
});