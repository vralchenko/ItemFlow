import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from the correct .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'test'}` });

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    reporter: 'html',
    workers: 1,

    use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
        trace: 'on-first-retry',
    },
});