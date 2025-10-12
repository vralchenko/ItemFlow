const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

// Explicitly load the correct .env file based on NODE_ENV
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

async function setup() {
    try {
        const db = await open({
            filename: process.env.DATABASE_PATH || './database.sqlite',
            driver: sqlite3.Database
        });

        await db.exec('PRAGMA foreign_keys=ON;');

        // --- Table Creation ---
        await db.exec(`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE
            )
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS items (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category_id TEXT,
                image TEXT,
                FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
            )
        `);

        // --- Seed Data ---
        await db.exec('BEGIN TRANSACTION;');

        const categories = [
            { id: crypto.randomUUID(), name: 'Electronics' },
            { id: crypto.randomUUID(), name: 'Books' },
            { id: crypto.randomUUID(), name: 'Groceries' }
        ];

        const categoryStmt = await db.prepare('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)');
        for (const category of categories) {
            await categoryStmt.run(category.id, category.name);
        }
        await categoryStmt.finalize();

        const electronicsCat = categories.find(c => c.name === 'Electronics');
        const booksCat = categories.find(c => c.name === 'Books');

        const items = [
            { id: crypto.randomUUID(), name: 'Wireless Mouse', category_id: electronicsCat.id, image: '' },
            { id: crypto.randomUUID(), name: 'The Pragmatic Programmer', category_id: booksCat.id, image: '' },
            { id: crypto.randomUUID(), name: 'Milk', category_id: categories.find(c => c.name === 'Groceries').id, image: '' },
            { id: crypto.randomUUID(), name: 'Standalone Keyboard', category_id: electronicsCat.id, image: '' },
            { id: crypto.randomUUID(), name: 'Uncategorized Item', category_id: null, image: '' }
        ];

        const itemStmt = await db.prepare('INSERT OR IGNORE INTO items (id, name, category_id, image) VALUES (?, ?, ?, ?)');
        for (const item of items) {
            await itemStmt.run(item.id, item.name, item.category_id, item.image);
        }
        await itemStmt.finalize();

        await db.exec('COMMIT;');

        console.log('✅ Database tables are ready and seeded with initial data.');
        await db.close();
    } catch (err) {
        console.error('Error setting up the database:', err);
    }
}

setup();