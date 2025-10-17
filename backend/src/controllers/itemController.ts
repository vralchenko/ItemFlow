import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';
import dbPromise from '../database.js';

interface Item {
    id: string;
    name: string;
    category_id: string | null;
    image: string | null;
}

interface ItemWithCategory extends Item {
    category: string | null;
}

interface GetItemsQuery {
    filter?: string;
    page?: string;
    limit?: string;
}

interface CreateItemBody {
    name: string;
    category_id: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', '..', 'uploads');

export const getItems = async (req: Request<{}, {}, {}, GetItemsQuery>, res: Response) => {
    try {
        const db = await dbPromise;
        const { filter } = req.query;
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '5', 10);
        const offset = (page - 1) * limit;

        let itemsQuery = `
            SELECT i.id, i.name, i.image, c.name as category 
            FROM items i 
            LEFT JOIN categories c ON i.category_id = c.id
        `;
        let countQuery = `
            SELECT COUNT(i.id) as count 
            FROM items i 
            LEFT JOIN categories c ON i.category_id = c.id
        `;

        const params: (string | number)[] = [];
        const countParams: string[] = [];

        if (filter) {
            const filterCondition = ` WHERE i.name LIKE ? OR c.name LIKE ?`;
            itemsQuery += filterCondition;
            countQuery += filterCondition;

            const filterParam = `%${filter}%`;
            params.push(filterParam, filterParam);
            countParams.push(filterParam, filterParam);
        }

        itemsQuery += ` ORDER BY i.name LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const items: ItemWithCategory[] = await db.all(itemsQuery, params);
        const total: { count: number } | undefined = await db.get(countQuery, countParams);

        if (total === undefined) {
            throw new Error("Could not retrieve total item count.");
        }

        res.json({
            totalItems: total.count,
            items: items,
            totalPages: Math.ceil(total.count / limit),
            currentPage: page,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: message });
    }
};

export const createItem = async (req: Request, res: Response) => {
    try {
        const db = await dbPromise;
        const { name, category_id } = req.body as CreateItemBody;
        const id = crypto.randomUUID();
        const image = req.file ? req.file.filename : '';

        await db.run('INSERT INTO items (id, name, category_id, image) VALUES (?, ?, ?, ?)', [id, name, category_id, image]);
        const newItem: ItemWithCategory | undefined = await db.get('SELECT i.id, i.name, i.image, c.name as category FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.id = ?', id);
        res.status(201).json(newItem);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: message });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        const db = await dbPromise;
        const { id } = req.params as { id: string };
        const { name, category_id } = req.body as CreateItemBody;

        const oldItem: Item | undefined = await db.get('SELECT * FROM items WHERE id = ?', id);
        if (!oldItem) {
            return res.status(404).send('Item not found');
        }

        let image = oldItem.image;
        if (req.file) {
            if (oldItem.image) {
                fs.unlink(path.join(uploadsPath, oldItem.image), (err) => { if (err) console.error(err); });
            }
            image = req.file.filename;
        }

        await db.run('UPDATE items SET name = ?, category_id = ?, image = ? WHERE id = ?', [name, category_id, image, id]);
        const updatedItem: ItemWithCategory | undefined = await db.get('SELECT i.id, i.name, i.image, c.name as category FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.id = ?', id);
        res.json(updatedItem);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: message });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const db = await dbPromise;
        const { id } = req.params as { id: string };

        const itemToDelete: Item | undefined = await db.get('SELECT * FROM items WHERE id = ?', id);
        if (!itemToDelete) {
            return res.status(404).send('Item not found');
        }

        
        if (itemToDelete.image) {
            fs.unlink(path.join(uploadsPath, itemToDelete.image), (err) => { if (err) console.error(err); });
        }

        await db.run('DELETE FROM items WHERE id = ?', id);
        res.status(204).send();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: message });
    }
};