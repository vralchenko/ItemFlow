import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}`;
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    if (nodeEnv === 'development' || nodeEnv === 'test') {
        console.warn(`Warning: ${envFile} file not found at ${envPath}. Using existing environment variables.`);
    }
    dotenv.config(); // Fallback to .env
}
