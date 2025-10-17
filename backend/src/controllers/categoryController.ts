import { Request, Response } from 'express';
import crypto from 'crypto';
import dbPromise from '../database.js';

interface Category {
    id: string;
    name: string;
}

interface SqliteError extends Error {
    code: string;
}

const isSqliteError = (error: unknown): error is SqliteError => {
    return typeof error === 'object' && error !== null && 'code' in error;
};

export const getCategories = async (_req: Request, res: Response) => {
    const db = await dbPromise;
    const categories: Category[] = await db.all('SELECT * FROM categories ORDER BY name');
    res.json(categories);
};

export const createCategory = async (req: Request<{}, {}, { name: string }>, res: Response) => {
    const db = await dbPromise;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const id = crypto.randomUUID();
        await db.run('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name]);
        const newCategory: Category | undefined = await db.get('SELECT * FROM categories WHERE id = ?', id);
        res.status(201).json(newCategory);
    } catch (error: unknown) {
        if (isSqliteError(error) && error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'A category with this name already exists.' });
        }
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: message });
    }
};

export const updateCategory = async (req: Request<{ id: string }, {}, { name: string }>, res: Response) => {
    const db = await dbPromise;
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        await db.run('UPDATE categories SET name = ? WHERE id = ?', [name.trim(), id]);
        const updatedCategory: Category | undefined = await db.get('SELECT * FROM categories WHERE id = ?', id);
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error: unknown) {
        if (isSqliteError(error) && error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'A category with this name already exists.' });
        }
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: message });
    }
};

export const deleteCategory = async (req: Request<{ id: string }>, res: Response) => {
    const db = await dbPromise;
    const { id } = req.params;
    await db.run('DELETE FROM categories WHERE id = ?', id);
    res.status(204).send();
};