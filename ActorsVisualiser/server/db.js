const pkg = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres', 
    password: 'STUDENT',
    database: 'AcVisDb',
    port: 5432,
});

function createTableIfNotExists() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "awardsInfo" (
        year TEXT,
        category TEXT,
        full_name TEXT,
        show TEXT,
        won BOOLEAN
    );`;

    pool.query(createTableQuery, (err, res) => {
        if (err) {
            console.error('Error creating table', err.stack);
        } else {
            console.log('Table created or already exists');
            populateDatabase();
        }
    });
}

function populateDatabase() {
    const results = [];

    fs.createReadStream('screen_actor_guild_awards.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            results.forEach(row => {
                const query = {
                    text: 'INSERT INTO "awardsInfo" (year, category, full_name, show, won) VALUES ($1, $2, $3, $4, $5)',
                    values: [row.year, row.category, row.full_name, row.show, row.won === 'true']
                };

                pool.query(query, (err, res) => {
                    if (err) {
                        console.error('Error executing query', err.stack);
                    } else {
                 //       console.log('Row inserted');
                    }
                });
            });
        });
}

pool.connect((err, client, done) => {
    if (err) throw err;
    console.log('Connected to the database');
    createTableIfNotExists();
    done();
});

module.exports = pool;