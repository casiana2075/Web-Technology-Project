import http from 'http';
import { URL } from 'url';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import querystring from 'querystring';

const { Pool } = pkg;

// Create a connection to db
const pool = new Pool({
    host: 'localhost',
    user: 'postgres', 
    password: 'STUDENT',
    database: 'AcVisDb',
    port: 5432,
});

// handle requests
const requestHandler = async (req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.url === '../routes/register.js') {
        let body = '';

        // Collect data from the POST request
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            console.log('Request body received:', body);
            const { username, password, confirmPassword, email } = querystring.parse(body);

            if (password !== confirmPassword) {
                res.statusCode = 400;
                return res.end('Passwords do not match');
            }

            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user into the database
                const result = await pool.query(
                    'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING userid',
                    [username, hashedPassword, email]
                );

                const newUserId = result.rows[0].userid;
                console.log(`User created with ID: ${newUserId}`);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`User created with ID: ${newUserId}`);
            } catch (error) {
                console.error('Error inserting user into database:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
};

// HTTP server
const server = http.createServer(requestHandler);

// Start server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
