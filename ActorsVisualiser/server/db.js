const pkg = require('pg');
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres', 
    password: 'postgres',
    database: 'AcVisDb',
    port: 5432,
});

module.exports = pool;