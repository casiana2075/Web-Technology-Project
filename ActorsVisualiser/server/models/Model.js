const pool = require('../db');

function findAll(){

    console.log("Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });

}

function checkUser(username, password){

    console.log("Model!");
    console.log(username, password);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username,password], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });

}
function getUserByEmail(email){
    console.log("Model!");
    console.log(email);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = $1' , [email], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

function getUserByUsername(username){
    console.log("Model!");
    console.log(username);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1' , [username], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

function createUser(username, password, email){
    console.log("Model!");
    console.log(username, password, email);

    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, password, email], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}
function getCategories() {
    console.log("Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT DISTINCT category FROM "awardsInfo"', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}

function getYears() {
    console.log("Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT DISTINCT year FROM "awardsInfo"', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}

function getSeriesCategories() {
    console.log("Fetching categories containing 'series'");

    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM "awardsInfo" WHERE LOWER(category) LIKE $1';
        const params = ['%series%'];

        console.log('Executing query:', query);
        console.log('With parameters:', params);

        pool.query(query, params, (err, res) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                console.log('Query results:', res.rows);
                resolve(res.rows);
            }
        });
    });
}
    function getAwardsInfo(category, year) {
        console.log("Model!");
        console.log("Category:", category);
        console.log("Year:", year);
    
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM "awardsInfo" WHERE 1=1';
            const params = [];
    
            if (category) {
                console.log('Category before query:', category); 
                params.push(`%${category}%`);
                query += ' AND LOWER(category) LIKE LOWER($' + params.length + ')';
            }
    
            if (year) {
                params.push(year);
                query += ' AND year = $' + params.length;
            }
            console.log('Executing query:', query);
            console.log('With parameters:', params);
    
            pool.query(query, params, (err, res) => {
                if (err) {
                    console.error('Error executing query:', err);
                    reject(err);
                } else {
                    console.log('Query results:', res.rows);
                    resolve(res.rows);
                }
            });
        });
    }
 
module.exports = {
    findAll,
    checkUser,
    getUserByEmail,
    getUserByUsername,
    createUser,
    getCategories,
    getYears,
    getSeriesCategories,
    getAwardsInfo
};