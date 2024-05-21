const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { Pool } = require('pg');

// Create a connection to db
const pool = require('../config/db');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && url.parse(req.url).pathname === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, password } = querystring.parse(body);

            pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, result) => {
                if (err) throw err;
            
                if (result.rows.length > 0) {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Login successful');
                } else {
                    res.writeHead(401, {'Content-Type': 'text/plain'});
                    res.end('Username or password is incorrect');
                }
            });
        });
    } else {
        res.end('Invalid request');
    }
});

server.listen(3000, () => console.log('Server running on port 3000'));