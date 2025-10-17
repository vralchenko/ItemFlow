import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const initializeDatabase = async (): Promise<Database> => {
    const databasePath = process.env.DATABASE_PATH;

    if (!databasePath) {
        throw new Error("DATABASE_PATH environment variable is not set.");
    }

    try {
        const db = await open({
            filename: databasePath,
            driver: sqlite3.Database
        });
        console.log(`Successfully connected to the database at ${databasePath}`);
        return db;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

const dbPromise = initializeDatabase();

export default dbPromise;