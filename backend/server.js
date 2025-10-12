const app = require('./app');

const PORT = process.env.PORT || 3001;

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});