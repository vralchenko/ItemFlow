import app from './app.js';
import dbPromise from './database.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
    try {
        await dbPromise;

        app.listen(PORT, HOST, () => {
            console.log(`Backend server is running on http://${HOST}:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server after database connection:", error);
        process.exit(1);
    }
}

startServer();