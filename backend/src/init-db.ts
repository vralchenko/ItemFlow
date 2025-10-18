import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

async function setup() {
    const dbPath = process.env.DATABASE_PATH;
    if (!dbPath) {
        console.error("Error: DATABASE_PATH environment variable is not set.");
        process.exit(1);
    }

    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        await db.exec('PRAGMA foreign_keys=ON;');

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

        await db.exec('BEGIN TRANSACTION;');

        const categories = [
            { id: crypto.randomUUID(), name: 'Electronics' },
            { id: crypto.randomUUID(), name: 'Books' },
            { id: crypto.randomUUID(), name: 'Groceries' },
            { id: crypto.randomUUID(), name: 'Tropical Fruits' }
        ];

        const categoryStmt = await db.prepare('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)');
        for (const category of categories) {
            await categoryStmt.run(category.id, category.name);
        }
        await categoryStmt.finalize();

        const electronicsCat = categories.find(c => c.name === 'Electronics');
        const booksCat = categories.find(c => c.name === 'Books');
        const groceriesCat = categories.find(c => c.name === 'Groceries');
        const fruitsCat = categories.find(c => c.name === 'Tropical Fruits');

        if (!electronicsCat || !booksCat || !groceriesCat || !fruitsCat) {
            throw new Error("A required category was not found after seeding.");
        }

        const items = [
            { id: crypto.randomUUID(), name: 'Wireless Mouse', category_id: electronicsCat.id, image: 'https://res.cloudinary.com/dy3ms7zlg/image/upload/v1760788264/item-flow/b9lql2ozhij0h3h4zilv.jpg' },
            { id: crypto.randomUUID(), name: 'The Pragmatic Programmer', category_id: booksCat.id, image: 'https://res.cloudinary.com/dy3ms7zlg/image/upload/v1760788171/item-flow/hsnawhkbcenyayghbvip.jpg' },
            { id: crypto.randomUUID(), name: 'Milk', category_id: groceriesCat.id, image: 'https://res.cloudinary.com/dy3ms7zlg/image/upload/v1760788142/item-flow/dctokwyhpijuxzuigrbb.jpg' },
            { id: crypto.randomUUID(), name: 'Standalone Keyboard', category_id: electronicsCat.id, image: 'https://res.cloudinary.com/dy3ms7zlg/image/upload/v1760788161/item-flow/wbcbxex5ibigpboutkc8.jpg' },
            { id: crypto.randomUUID(), name: 'Apple', category_id: fruitsCat.id, image: 'https://res.cloudinary.com/dy3ms7zlg/image/upload/v1760799492/item-flow/pg0wuoibx7qamo3pwfa6.jpg' },
            { id: crypto.randomUUID(), name: 'Banana', category_id: fruitsCat.id, image: 'https://res.cloudinary.com/dy3ms7zlg/image/upload/v1760799504/item-flow/e5xo2pciwupxqpkmfdgc.jpg' }
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
        process.exit(1);
    }
}

setup();