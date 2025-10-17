import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

import itemRoutes from './routes/items.js';
import categoryRoutes from './routes/categories.js';
import testRoutes from './routes/test.js';
import aiRoutes from './routes/ai.js';

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiRoutes);

if (process.env.NODE_ENV === 'test') {
    app.use('/api/test', testRoutes);
}

export default app;