const dbPromise = require('../database.js');

exports.resetDatabase = async (req, res) => {
    if (process.env.NODE_ENV !== 'test') {
        return res.status(403).json({ error: 'This endpoint is only for testing purposes.' });
    }
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM items');
        await db.run('DELETE FROM categories');
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};