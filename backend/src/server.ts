import app from './app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
    console.log(`Backend server is running on http://${HOST}:${PORT}`);
});