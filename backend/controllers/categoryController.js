const dbPromise = require('../database.js');
const crypto = require('crypto');

exports.getCategories = async (req, res) => {
    const db = await dbPromise;
    const categories = await db.all('SELECT * FROM categories ORDER BY name');
    res.json(categories);
};

exports.createCategory = async (req, res) => {
    const db = await dbPromise;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const id = crypto.randomUUID();
        await db.run('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name]);
        const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', id);
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'A category with this name already exists.' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    const db = await dbPromise;
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        await db.run('UPDATE categories SET name = ? WHERE id = ?', [name.trim(), id]);
        const updatedCategory = await db.get('SELECT * FROM categories WHERE id = ?', id);
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'A category with this name already exists.' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const db = await dbPromise;
    const { id } = req.params;
    await db.run('DELETE FROM categories WHERE id = ?', id);
    res.status(204).send();
};