const dbPromise = require('../database.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

exports.getItems = async (req, res) => {
    try {
        const db = await dbPromise;
        const { filter, page = 1, limit = 5 } = req.query;
        const offset = (page - 1) * limit;

        let itemsQuery = `
            SELECT i.id, i.name, i.image, c.name as category 
            FROM items i 
            LEFT JOIN categories c ON i.category_id = c.id
        `;
        let countQuery = `SELECT COUNT(*) as count FROM items`;
        const params = [];

        if (filter) {
            itemsQuery += ` WHERE i.name LIKE ?`;
            countQuery += ` WHERE name LIKE ?`;
            params.push(`%${filter}%`);
        }
        itemsQuery += ` ORDER BY i.name LIMIT ? OFFSET ?`;
        const countParams = [...params];
        params.push(limit, offset);

        const items = await db.all(itemsQuery, params);
        const total = await db.get(countQuery, countParams);

        res.json({
            totalItems: total.count,
            items: items,
            totalPages: Math.ceil(total.count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const db = await dbPromise;
        const { name, category_id } = req.body;
        const id = crypto.randomUUID();
        const image = req.file ? req.file.filename : '';

        await db.run('INSERT INTO items (id, name, category_id, image) VALUES (?, ?, ?, ?)', [id, name, category_id, image]);
        const newItem = await db.get('SELECT i.*, c.name as category FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.id = ?', id);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const db = await dbPromise;
        const { id } = req.params;
        const { name, category_id } = req.body;

        const oldItem = await db.get('SELECT * FROM items WHERE id = ?', id);
        if (!oldItem) return res.status(404).send('Item not found');

        let image = oldItem.image;
        if (req.file) {
            if (oldItem.image) {
                fs.unlink(path.join(__dirname, '..', 'uploads', oldItem.image), err => { if (err) console.error(err); });
            }
            image = req.file.filename;
        }

        await db.run('UPDATE items SET name = ?, category_id = ?, image = ? WHERE id = ?', [name, category_id, image, id]);
        const updatedItem = await db.get('SELECT i.*, c.name as category FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.id = ?', id);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const db = await dbPromise;
        const { id } = req.params;
        const itemToDelete = await db.get('SELECT * FROM items WHERE id = ?', id);
        if (!itemToDelete) return res.status(404).send('Item not found');
        if (itemToDelete.image) {
            fs.unlink(path.join(__dirname, '..', 'uploads', itemToDelete.image), err => { if (err) console.error(err); });
        }
        await db.run('DELETE FROM items WHERE id = ?', id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};