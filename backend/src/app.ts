import './loadEnv.js';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import itemRoutes from './routes/items.js';
import categoryRoutes from './routes/categories.js';
import testRoutes from './routes/test.js';
import aiRoutes from './routes/ai.js';

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));

app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiRoutes);

if (process.env.NODE_ENV === 'test') {
    app.use('/api/test', testRoutes);
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(">>> UNHANDLED ERROR!:", err);
    res.status(500).json({ error: "An internal server error occurred." });
});

export default app;