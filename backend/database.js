const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const dbPromise = open({
    filename: process.env.DATABASE_PATH || './database.sqlite',
    driver: sqlite3.Database
}).then(db => {
    console.log(`Successfully connected to the database at ${process.env.DATABASE_PATH}`);
    return db;
});

module.exports = dbPromise;