const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres', 
    password: 'STUDENT',
    database: 'AcVisDb',
    port: 5432,
});

module.exports = pool;