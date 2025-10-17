import { Request, Response } from 'express';
import dbPromise from '../database.js';

export const resetDatabase = async (req: Request, res: Response) => {
    if (process.env.NODE_ENV !== 'test') {
        return res.status(403).json({ error: 'This endpoint is only for testing purposes.' });
    }

    try {
        const db = await dbPromise;
        await db.run('DELETE FROM items');
        await db.run('DELETE FROM categories');
        res.status(204).send();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: message });
    }
};