const express = require('express');
const cors = require('cors');
const path = require('path');

// Explicitly load the correct .env file based on NODE_ENV
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

// Import routes
const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const testRoutes = require('./routes/test');
const aiRoutes = require('./routes/ai');

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiRoutes);

// --- Conditional Test Route ---
// This ensures the test endpoint is only available during testing
if (process.env.NODE_ENV === 'test') {
    app.use('/api/test', testRoutes);
}

module.exports = app;