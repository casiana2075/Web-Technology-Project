import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homePage.html'));
});

app.get('/api/awardsInfo', async (req, res) => {
    const query = req.query;

    if (query.category) {
        try {
            const { rows } = await pool.query('SELECT * FROM "awardsInfo" WHERE category = $1', [query.category]);
            res.json(rows);
        } catch (err) {
            console.error('Database query error:', err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(404).send('Not Found');
    }
});

app.get('/statisticsPage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'statisticsPage.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
