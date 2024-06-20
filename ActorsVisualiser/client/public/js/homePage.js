import url from 'url';
import pool from '../../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function handleHomePage(req, res) {
    if (req.method === 'GET') {
        const query = url.parse(req.url, true).query;

        if (query.category) {
            try {
                const { rows } = await pool.query('SELECT * FROM "awardsInfo" WHERE category = $1', [query.category]);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(rows));
            } catch (err) {
                console.error('Database query error:', err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
            }
        } else {
            fs.readFile(path.join(__dirname,'..','..','views', 'homePage.html'), (err, data) => {
                if (err) {
                    console.error(err); 
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
        }
    } else {
        res.end('Invalid request');
    }
}

export default handleHomePage;